"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Client, Databases, ID, Permission, Role, Query } from "appwrite";
import type { PresenceDoc, Cursor } from "@/types/presence";
import { colorFromId } from "@/lib/colors";

// --- ENV ---
const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT  = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const DB_ID    = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRESENCE = process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!;

// Heartbeat settings
const HEARTBEAT_MS = 10_000;       // write "I'm alive" every 10s
const STALE_AFTER_MS = 35_000;     // consider user offline if >35s old
const REFRESH_ON_EVENT_DEBOUNCE = 300;

// Create SDK client (client-side)
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT);
const databases = new Databases(client);

// simple throttle
function throttle<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let last = 0, timer: any;
  return function(this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  } as T;
}

// Generate or reuse a local "user" if your app doesn’t have auth yet.
function getOrMakeAnonUser() {
  const key = "ccraft:anon";
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  if (raw) return JSON.parse(raw);
  const user = {
    $id: `anon_${crypto.randomUUID()}`,
    email: "",
    name: "Guest",
  };
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(user));
  return user;
}

export function usePresence(canvasId: string, user?: { $id: string; email?: string; name?: string }) {
  const me = useMemo(() => {
    const u = user ?? getOrMakeAnonUser();
    return {
      id: u.$id,
      name: u.name || u.email?.split("@")[0] || "Guest",
      color: colorFromId(u.$id),
    };
  }, [user]);

  const tabId = useMemo(() => (typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`), []);
  const [people, setPeople] = useState<PresenceDoc[]>([]);
  const myDocIdRef = useRef<string | null>(null);
  const cursorRef = useRef<Cursor | undefined>(undefined);
  const heartbeatTimer = useRef<any>(null);
  const unsubRef = useRef<() => void>();

  // Join or update (ensure single doc per user per canvas)
  const joinOrUpdate = useCallback(async () => {
    const nowIso = new Date().toISOString();

    // Try to find an existing presence doc for this user+canvas
    const existing = await databases.listDocuments(DB_ID, PRESENCE, [
      Query.equal("canvasId", canvasId),
      Query.equal("userId", me.id),
    ]);

    if (existing.total > 0) {
      const doc = existing.documents[0];
      myDocIdRef.current = doc.$id;
      await databases.updateDocument(DB_ID, PRESENCE, doc.$id, {
        name: me.name,
        color: me.color,
        lastSeen: nowIso,
        tabId,
      });
      return doc.$id;
    } else {
      const permissions = [
        Permission.read(Role.any()),             // show presence publicly
        Permission.update(Role.user(me.id)),     // only the user can update self
        Permission.delete(Role.user(me.id)),
        Permission.write(Role.user(me.id)),
      ];
      const created = await databases.createDocument(
        DB_ID, PRESENCE, ID.unique(),
        {
          canvasId,
          userId: me.id,
          name: me.name,
          color: me.color,
          lastSeen: nowIso,
          tabId,
          cursor: null,
        },
        permissions
      );
      myDocIdRef.current = created.$id;
      return created.$id;
    }
  }, [canvasId, me.color, me.id, me.name, tabId]);

  // Heartbeat
  const beat = useCallback(async () => {
    if (!myDocIdRef.current) return;
    try {
      await databases.updateDocument(DB_ID, PRESENCE, myDocIdRef.current, {
        lastSeen: new Date().toISOString(),
        ...(cursorRef.current ? { cursor: cursorRef.current } : {}),
      });
    } catch {
      // ignore (network hiccups)
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
    heartbeatTimer.current = setInterval(beat, HEARTBEAT_MS);
  }, [beat]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
  }, []);

  const leave = useCallback(async () => {
    stopHeartbeat();
    if (myDocIdRef.current) {
      try { await databases.deleteDocument(DB_ID, PRESENCE, myDocIdRef.current); } catch {}
      myDocIdRef.current = null;
    }
  }, [stopHeartbeat]);

  // Update cursor (throttled to avoid spamming)
  const updateCursor = useMemo(
    () =>
      throttle(async (cursor: Cursor) => {
        cursorRef.current = cursor;
        if (!myDocIdRef.current) return;
        try {
          await databases.updateDocument(DB_ID, PRESENCE, myDocIdRef.current, {
            cursor,
            lastSeen: new Date().toISOString(),
          });
        } catch {}
      }, 120), // ~8 updates/sec
    []
  );

  // Keep local list fresh (and drop stale users)
  const refresh = useCallback(async () => {
    const cutoffIso = new Date(Date.now() - STALE_AFTER_MS).toISOString();
    const res = await databases.listDocuments(DB_ID, PRESENCE, [
      Query.equal("canvasId", canvasId),
      Query.greaterThan("lastSeen", cutoffIso),
      Query.orderDesc("$updatedAt"),
      Query.limit(50),
    ]);
    setPeople(res.documents as any);
  }, [canvasId]);

  // Debounced refresh for realtime events
  const debouncedRefresh = useMemo(
    () => throttle(refresh, REFRESH_ON_EVENT_DEBOUNCE),
    [refresh]
  );

  // Realtime subscribe to collection changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      await joinOrUpdate();
      await refresh();
      startHeartbeat();

      const channel = `databases.${DB_ID}.collections.${PRESENCE}.documents`;
      const unsub = client.subscribe(channel, (evt) => {
        const payload = (evt as any).payload;
        if (!payload || payload.canvasId !== canvasId) return; // only our canvas
        debouncedRefresh();
      });
      unsubRef.current = unsub;
    })();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        startHeartbeat();
        beat();
      } else {
        stopHeartbeat();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onBeforeUnload = () => { // best-effort cleanup
      navigator.sendBeacon?.(
        `${ENDPOINT}/databases/${DB_ID}/collections/${PRESENCE}/documents/${myDocIdRef.current}`,
        "" // not supported with Appwrite REST without JWT; we still also do delete on unload below
      );
    };
    window.addEventListener("beforeunload", onBeforeUnload);

    const onUnload = () => { leave(); };
    window.addEventListener("unload", onUnload);

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("unload", onUnload);
      stopHeartbeat();
      if (unsubRef.current) { try { unsubRef.current(); } catch {} }
      // Remove our doc if we still own one
      leave();
    };
  }, [beat, canvasId, debouncedRefresh, joinOrUpdate, leave, refresh, startHeartbeat, stopHeartbeat]);

  return { people, updateCursor };
}
