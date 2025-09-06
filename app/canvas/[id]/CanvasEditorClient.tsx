"use client";

import { useEffect, useState } from "react";
import { databases, storage } from "@/lib/appwrite";
import { Toolbar } from "@/components/CanvasEditor/Toolbar";
import BlockItem from "@/components/CanvasEditor/BlockItem";
import Cursors from "@/components/CanvasEditor/Cursors";
import { Templates, Block } from "@/components/CanvasEditor/templates";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { v4 as uuidv4 } from "uuid";
import { usePresence } from "@/hooks/usePresence";
import { ID } from "appwrite";
import CanvasSettings from "@/components/CanvasEditor/CanvasSettings"; // ✅ updated import

export default function CanvasEditorClient({ id }: { id: string }) {
  const [canvas, setCanvas] = useState<any>(null);
  const { people: presence, updateCursor } = usePresence(id);

  // Load canvas
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const doc = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID || "",
          id
        );
        const parsed = {
          ...doc,
          blocks: (doc.blocks || [])
            .map((b: string) => {
              try {
                return JSON.parse(b);
              } catch {
                return null;
              }
            })
            .filter(Boolean),
        };
        setCanvas(parsed);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  // Realtime subscribe
  useEffect(() => {
    if (!id) return;
    let unsubscribe: any;
    (async () => {
      try {
        const mod = await import("@/lib/appwrite");
        const realtime = (mod as any).realtime;
        if (!realtime) return;
        const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID}.documents.${id}`;
        unsubscribe = realtime.subscribe([channel], (res: any) => {
          if (res.events?.includes("databases.*.documents.*.update")) {
            setCanvas((prev: any) => {
              const merged = { ...prev, ...res.payload };
              return {
                ...merged,
                blocks: (merged.blocks || [])
                  .map((b: string) => {
                    try {
                      return JSON.parse(b);
                    } catch {
                      return null;
                    }
                  })
                  .filter(Boolean),
              };
            });
          }
        });
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      try {
        if (unsubscribe) unsubscribe();
      } catch {}
    };
  }, [id]);

  // persist helper
  const persist = async (patch: any) => {
    if (!canvas) return;
    try {
      const payload = {
        ...patch,
        ...(patch.blocks
          ? { blocks: patch.blocks.map((b: Block) => JSON.stringify(b)) }
          : {}),
      };
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID || "",
        canvas.$id,
        payload
      );
      setCanvas({ ...canvas, ...patch });
    } catch (e) {
      console.error(e);
    }
  };

  // Add block
  const add = async (t: keyof typeof Templates) => {
    const block = Templates[t]();
    const blocks = [...(canvas?.blocks || []), block];
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
  };

  // Add image
  const addImage = async (file: File) => {
    if (!file) return;
    try {
      const up = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "",
        ID.unique(),
        file
      );
      const url = storage.getFileView(up.bucketId, up.$id);
      const block: Block = { id: uuidv4(), type: "image", props: { url } };
      const blocks = [...(canvas?.blocks || []), block];
      setCanvas({ ...canvas, blocks });
      await persist({ blocks });
    } catch (e) {
      console.error(e);
    }
  };

  const onUpdateBlock = async (b: Block) => {
    const blocks = (canvas.blocks || []).map((x: Block) =>
      x.id === b.id ? b : x
    );
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = canvas.blocks.findIndex((b: any) => b.id === active.id);
      const newIndex = canvas.blocks.findIndex((b: any) => b.id === over.id);
      const newBlocks = arrayMove(canvas.blocks, oldIndex, newIndex);
      setCanvas({ ...canvas, blocks: newBlocks });
      persist({ blocks: newBlocks });
    }
  };

  const aiSuggest = async () => {
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        body: JSON.stringify({ prompt: canvas?.title || "Landing page" }),
      });
      const json = await res.json();
      if (Array.isArray(json.blocks)) {
        const gen = json.blocks.map((blk: any) => ({ ...blk, id: uuidv4() }));
        const blocks = [...(canvas?.blocks || []), ...gen];
        setCanvas({ ...canvas, blocks });
        await persist({ blocks });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!canvas) return <div className="mt-8">Loading...</div>;

  return (
    <div
      className="relative mt-8"
      onMouseMove={(e) => updateCursor({ x: e.clientX, y: e.clientY })}
    >
      <Cursors presence={presence} />

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="col-span-12 md:col-span-3">
          <Toolbar onAdd={add} onAddImage={addImage} onAI={aiSuggest} />
        </div>

        {/* Middle editor */}
        <div className="col-span-12 md:col-span-6">
          <div className="glass p-4 rounded">
            <DndContext
              onDragEnd={onDragEnd}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={canvas.blocks?.map((b: any) => b.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="canvas-area">
                  {(canvas.blocks || []).map((block: any) => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      onUpdate={onUpdateBlock}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Right sidebar (Canvas Settings) */}
        <div className="col-span-12 md:col-span-3">
          <CanvasSettings
            canvasId={canvas.$id}
            initialTitle={canvas.title}
            presenceCount={presence.length}
          />
        </div>
      </div>
    </div>
  );
}
