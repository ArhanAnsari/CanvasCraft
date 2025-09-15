"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { useSwipeable } from "react-swipeable";
import AIPromptDialog from "@/components/CanvasEditor/AIPromptDialog";

export default function CanvasEditorClient({ id }: { id: string }) {
  const [canvas, setCanvas] = useState<any | null>(null);
  const { people: presence, updateCursor } = usePresence(id);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const CLIP_KEY = "ccraft:clipboard";

  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [aiOpen, setAiOpen] = useState(false);

  // ========== Helpers ==========
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
        setCanvas((c: any) => ({ ...c, ...patch }));
      } catch (e) {
        console.error(e);
      }
    },
    [canvas]
  );

  // ========== CRUD ==========
  const add = async (t: keyof typeof Templates) => {
    const block = Templates[t]();
    const blocks = [...(canvas?.blocks || []), block];
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
    setSelectedBlockId(block.id);
  };

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

  const onUpdateBlock = async (b: Block) => {
    const blocks = (canvas.blocks || []).map((x: Block) =>
      x.id === b.id ? b : x
    );
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
  };

  const onDeleteBlock = async (idToDelete: string) => {
    if (!canvas) return;
    const blocks = (canvas.blocks || []).filter(
      (b: Block) => b.id !== idToDelete
    );
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
    if (selectedBlockId === idToDelete) setSelectedBlockId(null);
  };

  const duplicateBlock = async (idToDup: string) => {
    if (!canvas) return;
    const block = canvas.blocks.find((b: Block) => b.id === idToDup);
    if (!block) return;
    const copy = { ...block, id: uuidv4() };
    const index = canvas.blocks.findIndex((b: Block) => b.id === idToDup);
    const blocks = [
      ...canvas.blocks.slice(0, index + 1),
      copy,
      ...canvas.blocks.slice(index + 1),
    ];
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
    setSelectedBlockId(copy.id);
  };

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
      const idx = insertAfterId
        ? canvas.blocks.findIndex((b: Block) => b.id === insertAfterId)
        : -1;
      const blocks =
        idx >= 0
          ? [
              ...canvas.blocks.slice(0, idx + 1),
              newBlock,
              ...canvas.blocks.slice(idx + 1),
            ]
          : [...canvas.blocks, newBlock];
      setCanvas({ ...canvas, blocks });
      await persist({ blocks });
      setSelectedBlockId(newBlock.id);
    } catch (e) {
      console.error("Paste failed", e);
    }
  };

  // ========== Move Up/Down ==========
  const moveBlock = async (id: string, dir: "up" | "down") => {
    if (!canvas) return;
    const idx = canvas.blocks.findIndex((b: Block) => b.id === id);
    if (idx === -1) return;
    const newIndex = dir === "up" ? idx - 1 : idx + 1;
    if (newIndex < 0 || newIndex >= canvas.blocks.length) return;
    const newBlocks = arrayMove(canvas.blocks, idx, newIndex);
    setCanvas({ ...canvas, blocks: newBlocks });
    await persist({ blocks: newBlocks });
    setSelectedBlockId(newBlocks[newIndex].id);
  };

  // ========== Keyboard + Swipe ==========
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedBlockId) return;
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isTyping =
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement &&
          (document.activeElement as HTMLElement).getAttribute(
            "contenteditable"
          ) === "true");
      if (isTyping) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDeleteBlock(selectedBlockId);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveBlock(selectedBlockId, "up");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveBlock(selectedBlockId, "down");
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        e.preventDefault();
        copyBlock(selectedBlockId);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        e.preventDefault();
        pasteBlock(selectedBlockId);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateBlock(selectedBlockId);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedBlockId, canvas]);

  const swipeHandlers = useSwipeable({
    onSwipedUp: () =>
      selectedBlockId ? moveBlock(selectedBlockId, "down") : null,
    onSwipedDown: () =>
      selectedBlockId ? moveBlock(selectedBlockId, "up") : null,
    trackTouch: true,
    trackMouse: false,
  });

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

  // ========== AI & Publish ==========
  const aiSuggest = async (customPrompt?: string) => {
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        body: JSON.stringify({
          prompt: customPrompt || canvas?.title || "Landing page",
        }),
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

  // ========== Data load ==========
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

  // ========== Realtime ==========
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
    return () => unsubscribe && unsubscribe();
  }, [id]);

  if (!canvas) return <div className="mt-8">Loading...</div>;

  return (
    <div
      className="relative mt-8"
      onMouseMove={(e) => updateCursor({ x: e.clientX, y: e.clientY })}
    >
      <Cursors presence={presence} />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <Toolbar
            onAdd={add}
            onAddImage={addImage}
            onAI={() => setAiOpen(true)}
          />
        </div>

        <AIPromptDialog
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          onInsert={async (genBlocks) => {
            const blocks = [...(canvas?.blocks || []), ...genBlocks];
            setCanvas({ ...canvas, blocks });
            await persist({ blocks });
          }}
        />

        <div className="col-span-12 md:col-span-6">
          <div className="glass p-4 rounded">
            {selectedBlockId && (
              <div className="mb-3 p-2 bg-slate-700 rounded text-slate-200 text-sm flex justify-between items-center">
                <span>
                  ✨ Selected Block:{" "}
                  <strong>
                    {
                      canvas.blocks.find(
                        (b: Block) => b.id === selectedBlockId
                      )?.type
                    }
                  </strong>
                </span>
                <span className="hidden md:inline text-slate-400">
                  ⌨️ Del: delete | ↑↓: navigate | ⌘+C/V/D: copy/paste/dup
                </span>
              </div>
            )}

            <DndContext
              onDragEnd={onDragEnd}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={canvas.blocks?.map((b: any) => b.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div className="canvas-area" {...swipeHandlers}>
                  {(canvas.blocks || []).map((block: any) => (
                    <div
                      key={block.id}
                      ref={(el) => {
                        blockRefs.current[block.id] = el;
                      }}
                    >
                      <BlockItem
                        block={block}
                        isSelected={selectedBlockId === block.id}
                        onSelect={() => setSelectedBlockId(block.id)}
                        onUpdate={onUpdateBlock}
                        onDelete={onDeleteBlock}
                        onDuplicate={() => duplicateBlock(block.id)}
                        onCopy={() => copyBlock(block.id)}
                        onPaste={() => pasteBlock(block.id)}
                        onMoveUp={() => moveBlock(block.id, "up")}
                        onMoveDown={() => moveBlock(block.id, "down")}
                      />
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <CanvasSettings
            canvasId={canvas.$id}
            initialTitle={canvas.title}
            presenceCount={presence.length}
          />
          <div className="mt-4 glass p-4 rounded">
            <h4 className="font-semibold text-slate-200 mb-2">Quick Actions</h4>
            <div className="flex gap-2 flex-wrap">
              <button
                className="px-3 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
                onClick={() => publish()}
              >
                Publish
              </button>
              <button
                className="px-3 py-2 bg-slate-700 rounded text-white hover:bg-slate-600"
                onClick={() => {
                  const data = localStorage.getItem(CLIP_KEY);
                  if (data) pasteBlock();
                  else alert("Clipboard empty");
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
