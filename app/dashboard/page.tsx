'use client';

import { useEffect, useState } from "react";
import { databases, ID } from "@/lib/appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
  const [canvases, setCanvases] = useState<any[]>([]);
  const router = useRouter();

  // 🔄 Load canvases
  useEffect(() => {
    fetchCanvases();
  }, []);

  const fetchCanvases = async () => {
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!
      );
      setCanvases(res.documents || []);
    } catch (e) {
      console.error("Failed to fetch canvases:", e);
      toast.error("Failed to load canvases");
    }
  };

  // ➕ Create new canvas
  const createCanvas = async () => {
    try {
      const doc = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
        ID.unique(),
        {
          title: `Untitled ${Date.now()}`,
          blocks: [] as string[],
          published: false,
          publishedUrl: "", // ✅ optional field for live link
        }
      );
      toast.success("New canvas created!");
      router.push(`/canvas/${doc.$id}`);
    } catch (e) {
      console.error("Failed to create canvas:", e);
      toast.error("Failed to create canvas");
    }
  };

  // 🗑️ Delete canvas
  const deleteCanvas = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this canvas? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
        id
      );
      setCanvases((prev) => prev.filter((c) => c.$id !== id));
      toast.success("Canvas deleted");
    } catch (e) {
      console.error("Failed to delete canvas:", e);
      toast.error("Failed to delete canvas");
    }
  };

  // 🌍 Publish/Unpublish toggle
  const togglePublish = async (id: string, current: boolean, slug?: string) => {
    try {
      const newStatus = !current;
      const publishedUrl = newStatus
        ? `https://canvascraft.appwrite.network/s/${slug || id}/index`
        : "";

      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
        id,
        {
          published: newStatus,
          publishedUrl,
        }
      );

      // update state instantly
      setCanvases((prev) =>
        prev.map((c) =>
          c.$id === id ? { ...c, published: newStatus, publishedUrl } : c
        )
      );

      toast.success(newStatus ? "Canvas published!" : "Canvas unpublished");
    } catch (e) {
      console.error("Failed to toggle publish:", e);
      toast.error("Failed to update publish status");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="btn btn-primary" onClick={createCanvas}>
          New Canvas
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {canvases.map((c) => (
          <div
            key={c.$id}
            className="glass p-4 rounded flex flex-col justify-between"
          >
            <div>
              <Link
                href={`/canvas/${c.$id}`}
                className="font-semibold hover:underline"
              >
                {c.title}
              </Link>
              <div className="text-xs text-slate-400">
                {c.published ? "Published" : "Draft"}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              {c.published && c.publishedUrl ? (
                <a
                  href={c.publishedUrl}
                  target="_blank"
                  className="text-cyan-300 hover:underline"
                >
                  Live Site
                </a>
              ) : (
                "Not Published"
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => togglePublish(c.$id, c.published, c.slug)}
                className="text-green-400 hover:underline"
              >
                {c.published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => deleteCanvas(c.$id)}
                className="text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
