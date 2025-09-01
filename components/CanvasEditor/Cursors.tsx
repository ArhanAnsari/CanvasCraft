"use client";

import React from "react";
import type { PresenceDoc } from "@/types/presence";

type Props = { presence?: PresenceDoc[] };

export default function Cursors({ presence = [] }: Props) {
  return (
    <>
      {/* Floating cursors */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {presence.map((p) => {
          if (!p.cursor) return null;
          return (
            <div
              key={`cursor-${p.$id}`}
              className="absolute"
              style={{ left: p.cursor.x, top: p.cursor.y }}
            >
              <div
                className="h-3 w-3 rounded-full shadow"
                style={{ background: p.color, border: "2px solid rgba(0,0,0,.4)" }}
              />
              <div
                className="mt-1 px-2 py-0.5 text-xs rounded shadow"
                style={{ background: "rgba(0,0,0,.6)", color: "#fff" }}
              >
                {p.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact roster */}
      <div className="absolute right-4 top-4 flex flex-col gap-2 z-50">
        {presence.map((p) => (
          <div key={p.$id} className="flex items-center gap-2 p-2 glass rounded">
            <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
            <div className="text-xs">{p.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
