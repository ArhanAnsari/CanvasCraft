"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Client, Databases, ID, Query, Permission, Role } from "appwrite";
import { colorFromId } from "@/lib/colors";

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT!;
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const PRESENCE = process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!;

const HEARTBEAT_MS = 10_000;
const STALE_AFTER_MS = 35_000;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT);
const databases = new Databases(client);

function getOrMakeAnonUser() {
  const key = "ccraft:anon";
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  if (raw) return JSON.parse(raw);
  const user = { $id: `anon_${crypto.randomUUID()}`, name: "Guest" };
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(user));
  return user;
}

export function usePresence(canvasId: string, user?: { $id: string; name?: string }) {
  const me = useMemo(() => {
    const u = user ?? getOrMakeAnonUser();
    return { id: u.$id, name: u.name || "Guest", color: colorFromId(u.$id) };
  }, [user]);

  const [people, setPeople] = useState<any[]>([]);
  const cursor = useRef({ x: 0, y: 0 });

  // heartbeat
  useEffect(() => {
    let stopped = false;

    const beat = async () => {
      if (stopped) return;
      try {
        await databases.createDocument(DB_ID, PRESENCE, ID.unique(), {
          canvasId,
          userId: me.id,
          name: me.name,
          color: me.color,
          cursor: cursor.current,
          ts: Date.now(),
        }, [Permission.write(Role.any())]);
      } catch {
        // ignore duplicates (could be replaced by update if needed)
      }
    };

    beat();
    const i = setInterval(beat, HEARTBEAT_MS);
    return () => { stopped = true; clearInterval(i); };
  }, [canvasId, me]);

  // poll & cleanup stale
  useEffect(() => {
    let stopped = false;
    const poll = async () => {
      if (stopped) return;
      try {
        const list = await databases.listDocuments(DB_ID, PRESENCE, [Query.equal("canvasId", canvasId)]);
        const now = Date.now();
        setPeople(list.documents.filter((d: any) => now - d.ts < STALE_AFTER_MS));
      } catch {}
    };
    poll();
    const i = setInterval(poll, 5000);
    return () => { stopped = true; clearInterval(i); };
  }, [canvasId]);

  const updateCursor = (pos: { x: number; y: number }) => {
    cursor.current = pos;
  };

  return { me, people, updateCursor };
}
