// app/canvas/[id]/CanvasEditorClient.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
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
import CanvasSettings from "@/components/CanvasEditor/CanvasSettings";

export default function CanvasEditorClient({ id }: { id: string }) {
  const [canvas, setCanvas] = useState<any | null>(null);
  const { people: presence, updateCursor } = usePresence(id);

  // selected block id (for keyboard delete / visual focus / nav)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  // clipboard for copy/paste saved to localStorage key
  const CLIP_KEY = "ccraft:clipboard";

  // Load canvas from Appwrite
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

  // Realtime subscribe to updates
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

  // Helper: persist patch to Appwrite (stringify blocks)
  const persist = useCallback(
    async (patch: any) => {
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
        // optimistic UI update
        setCanvas((c: any) => ({ ...c, ...patch }));
      } catch (e) {
        console.error(e);
      }
    },
    [canvas]
  );

  // Add block
  const add = async (t: keyof typeof Templates) => {
    const block = Templates[t]();
    const blocks = [...(canvas?.blocks || []), block];
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
    setSelectedBlockId(block.id);
  };

  // Add image via storage
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
      setSelectedBlockId(block.id);
    } catch (e) {
      console.error(e);
    }
  };

  // Update individual block
  const onUpdateBlock = async (b: Block) => {
    const blocks = (canvas.blocks || []).map((x: Block) => (x.id === b.id ? b : x));
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
  };

  // Delete block
  const onDeleteBlock = async (idToDelete: string) => {
    if (!canvas) return;
    const blocks = (canvas.blocks || []).filter((b: Block) => b.id !== idToDelete);
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
    if (selectedBlockId === idToDelete) setSelectedBlockId(null);
  };

  // Duplicate block
  const duplicateBlock = async (idToDup: string) => {
    if (!canvas) return;
    const block = canvas.blocks.find((b: Block) => b.id === idToDup);
    if (!block) return;
    const copy = { ...block, id: uuidv4() };
    const index = canvas.blocks.findIndex((b: Block) => b.id === idToDup);
    const blocks = [...canvas.blocks.slice(0, index + 1), copy, ...canvas.blocks.slice(index + 1)];
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
    setSelectedBlockId(copy.id);
  };

  // Copy/Paste using localStorage
  const copyBlock = (idToCopy: string) => {
    if (!canvas) return;
    const block = canvas.blocks.find((b: Block) => b.id === idToCopy);
    if (!block) return;
    localStorage.setItem(CLIP_KEY, JSON.stringify(block));
  };

  const pasteBlock = async (insertAfterId?: string) => {
    const data = localStorage.getItem(CLIP_KEY);
    if (!data || !canvas) return;
    try {
      const parsed = JSON.parse(data) as Block;
      const newBlock = { ...parsed, id: uuidv4() };
      const idx = insertAfterId ? canvas.blocks.findIndex((b: Block) => b.id === insertAfterId) : -1;
      const blocks = idx >= 0
        ? [...canvas.blocks.slice(0, idx + 1), newBlock, ...canvas.blocks.slice(idx + 1)]
        : [...canvas.blocks, newBlock];
      setCanvas({ ...canvas, blocks });
      await persist({ blocks });
      setSelectedBlockId(newBlock.id);
    } catch (e) {
      console.error("Paste failed", e);
    }
  };

  // Keyboard nav / delete / copy-paste shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedBlockId) return;

      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      // don't intercept while typing in inputs/textareas/contenteditable
      const isTyping =
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement && (document.activeElement as HTMLElement).getAttribute("contenteditable") === "true");
      if (isTyping) return;

      // Delete / Backspace to delete selected block
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDeleteBlock(selectedBlockId);
        return;
      }

      // Arrow navigation (up/down) to change selection
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const idx = canvas.blocks.findIndex((b: Block) => b.id === selectedBlockId);
        if (idx > 0) setSelectedBlockId(canvas.blocks[idx - 1].id);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const idx = canvas.blocks.findIndex((b: Block) => b.id === selectedBlockId);
        if (idx < canvas.blocks.length - 1) setSelectedBlockId(canvas.blocks[idx + 1].id);
        return;
      }

      // Copy (Ctrl/Cmd + C)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyBlock(selectedBlockId);
        return;
      }

      // Paste (Ctrl/Cmd + V)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteBlock(selectedBlockId);
        return;
      }

      // Duplicate (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateBlock(selectedBlockId);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedBlockId, canvas]);

  // Reorder on drag end
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

  // AI suggest integration
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

  // Publish
  const publish = async () => {
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        body: JSON.stringify({ id: canvas.$id, userId: canvas.userId }),
      });
      const json = await res.json();
      if (json.url) {
        await persist({ published: true, publishedUrl: json.url });
        alert(`Published at: ${json.url}`);
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
        <div className="col-span-12 md:col-span-3">
          <Toolbar onAdd={add} onAddImage={addImage} onAI={aiSuggest} />
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="glass p-4 rounded">
            <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]}>
              <SortableContext items={canvas.blocks?.map((b: any) => b.id) || []} strategy={verticalListSortingStrategy}>
                <div className="canvas-area">
                  {(canvas.blocks || []).map((block: any) => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => setSelectedBlockId(block.id)}
                      onUpdate={onUpdateBlock}
                      onDelete={onDeleteBlock}
                      onDuplicate={() => duplicateBlock(block.id)}
                      onCopy={() => copyBlock(block.id)}
                      onPaste={() => pasteBlock(block.id)}
                      onMoveUp={() => {
                        const idx = canvas.blocks.findIndex((b: Block) => b.id === block.id);
                        if (idx > 0) {
                          const newBlocks = arrayMove(canvas.blocks, idx, idx - 1);
                          setCanvas({ ...canvas, blocks: newBlocks });
                          persist({ blocks: newBlocks });
                        }
                      }}
                      onMoveDown={() => {
                        const idx = canvas.blocks.findIndex((b: Block) => b.id === block.id);
                        if (idx < canvas.blocks.length - 1) {
                          const newBlocks = arrayMove(canvas.blocks, idx, idx + 1);
                          setCanvas({ ...canvas, blocks: newBlocks });
                          persist({ blocks: newBlocks });
                        }
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <CanvasSettings canvasId={canvas.$id} initialTitle={canvas.title} presenceCount={presence.length} />
          <div className="mt-4 glass p-4 rounded">
            <h4 className="font-semibold text-slate-200 mb-2">Quick Actions</h4>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-indigo-600 rounded text-white" onClick={() => publish()}>
                Publish
              </button>
              <button
                className="px-3 py-2 bg-slate-700 rounded text-white"
                onClick={() => {
                  const data = localStorage.getItem(CLIP_KEY);
                  if (data) {
                    pasteBlock();
                  } else {
                    alert("Clipboard empty");
                  }
                }}
              >
                Paste (global)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
