'use client';
import { useEffect, useState } from "react";
import { databases, storage, Query } from "@/lib/appwrite";
import { Toolbar } from "@/components/CanvasEditor/Toolbar";
import BlockItem from "@/components/CanvasEditor/BlockItem";
import Cursors from "@/components/CanvasEditor/Cursors";
import { Templates, Block } from "@/components/CanvasEditor/templates";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { v4 as uuidv4 } from "uuid";
import { use } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function CanvasEditor({ params }: { params: { id: string } }) {
  const id = params.id;
  const [canvas, setCanvas] = useState<any>(null);
  const [presence, setPresence] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const doc = await databases.getDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID || "",
          id
        );
        // 🔑 parse blocks
        const parsed = {
          ...doc,
          blocks: (doc.blocks || []).map((b: string) => {
            try {
              return JSON.parse(b);
            } catch {
              return null;
            }
          }).filter(Boolean),
        };
        setCanvas(parsed);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  // subscribe realtime for canvas updates
  useEffect(() => {
    if (!id) return;
    let unsubscribe: any;
    (async () => {
      try {
        const mod = await import('@/lib/appwrite');
        const realtime = (mod as any).realtime;
        if (!realtime) return;
        const channel = `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID}.documents.${id}`;
        unsubscribe = realtime.subscribe([channel], (res: any) => {
          if (res.events?.includes("databases.*.documents.*.update")) {
            setCanvas((prev: any) => {
              const merged = { ...prev, ...res.payload };
              return {
                ...merged,
                blocks: (merged.blocks || []).map((b: string) => {
                  try {
                    return JSON.parse(b);
                  } catch {
                    return null;
                  }
                }).filter(Boolean),
              };
            });
          }
        });
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      try { if (unsubscribe) unsubscribe(); } catch { }
    };
  }, [id]);

  // presence polling
  useEffect(() => {
    if (!id) return;
    const i = setInterval(async () => {
      try {
        const list = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID || "",
          [Query.equal("canvasId", id)]
        );
        setPresence(list.documents || []);
      } catch (e) { }
    }, 4000);
    return () => clearInterval(i);
  }, [id]);

  // persist helper: stringify blocks before saving
  const persist = async (patch: any) => {
    if (!canvas) return;
    try {
      const payload = {
        ...patch,
        ...(patch.blocks ? { blocks: patch.blocks.map((b: Block) => JSON.stringify(b)) } : {}),
      };
      const updated = await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID || "",
        canvas.$id,
        payload
      );
      setCanvas({
        ...canvas,
        ...patch,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const add = async (t: keyof typeof Templates) => {
    const block = Templates[t]();
    const blocks = [...(canvas?.blocks || []), block];
    setCanvas({ ...canvas, blocks });
    await persist({ blocks });
  };

  const addImage = async (file: File) => {
    if (!file) return;
    try {
      const up = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "",
        'unique()',
        file
      );
      const url = `${(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '').replace('/v1', '')}/storage/buckets/${up.bucketId}/files/${up.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
      const block: Block = { id: uuidv4(), type: 'image', props: { url } };
      const blocks = [...(canvas?.blocks || []), block];
      setCanvas({ ...canvas, blocks });
      await persist({ blocks });
    } catch (e) {
      console.error(e);
    }
  };

  const onUpdateBlock = async (b: Block) => {
    const blocks = (canvas.blocks || []).map((x: Block) => x.id === b.id ? b : x);
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
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        body: JSON.stringify({ prompt: canvas?.title || 'Landing page' }),
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

  if (!canvas) return <div className="mt-8">Loading...</div>;

  return (
    <div className="relative mt-8">
      <Cursors presence={presence} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3">
          <Toolbar onAdd={add} onAddImage={addImage} onAI={aiSuggest} />
        </div>
        <div className="col-span-12 md:col-span-6">
          <div className="glass p-4 rounded">
            <div className="flex items-center justify-between mb-4">
              <div>Editing: <strong>{canvas.title}</strong></div>
              <div className="text-sm text-slate-300">Presence: {presence.length}</div>
            </div>

            <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]}>
              <SortableContext items={canvas.blocks?.map((b: any) => b.id) || []} strategy={verticalListSortingStrategy}>
                <div className="canvas-area">
                  {(canvas.blocks || []).map((block: any) => (
                    <BlockItem key={block.id} block={block} onUpdate={onUpdateBlock} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="glass p-4 rounded">
            <h4 className="font-semibold mb-2">Canvas Settings</h4>
            <label className="block mb-2 text-sm">Title
              <input
                defaultValue={canvas.title}
                onBlur={(e) => persist({ title: e.currentTarget.value })}
                className="w-full mt-1 p-2 rounded bg-slate-900 border"
              />
            </label>
            <button className="mt-3 btn btn-primary w-full" onClick={publish}>Publish</button>
            {canvas.published && canvas.publishedUrl && (
              <a
                href={canvas.publishedUrl}
                target="_blank"
                className="mt-2 block text-cyan-300 text-sm"
              >
                View Live Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
