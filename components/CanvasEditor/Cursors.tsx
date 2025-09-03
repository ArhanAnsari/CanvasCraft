"use client";

import React from "react";

type PresenceUser = {
  $id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
};

type Props = { presence?: PresenceUser[] };

export default function Cursors({ presence = [] }: Props) {
  return (
    <>
      {/* Floating cursors */}
      <div className="pointer-events-none fixed inset-0 z-40">
        {presence.map((p) => {
          if (!p.cursor) return null;
          return (
            <div
              key={`cursor-${p.$id}`}
              className="absolute transition-transform duration-75"
              style={{ left: p.cursor.x, top: p.cursor.y }}
            >
              <div
                className="h-3 w-3 rounded-full shadow"
                style={{
                  background: p.color,
                  border: "2px solid rgba(0,0,0,.4)",
                }}
              />
              <div
                className="mt-1 px-2 py-0.5 text-xs rounded shadow whitespace-nowrap"
                style={{ background: p.color, color: "#fff" }}
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
          <div
            key={p.$id}
            className="flex items-center gap-2 px-3 py-1 rounded-full shadow bg-slate-800/70"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: p.color }}
            />
            <div className="text-xs text-white">{p.name}</div>
          </div>
        ))}
      </div>
    </>
  );
}
