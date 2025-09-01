'use client';

import { useEffect, useState } from "react";
import { databases, ID } from "@/lib/appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Canvas {
  $id: string;
  title: string;
  published: boolean;
  publishedUrl?: string;
}

export default function Dashboard() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔄 Load canvases
  useEffect(() => {
    fetchCanvases();
  }, []);

  const fetchCanvases = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!
      );
      // map Appwrite documents to our Canvas interface
      const docs = res.documents || [];
      const mapped = (docs as any[]).map((d) => ({
        $id: d.$id,
        title: d.title ?? `Untitled ${d.$createdAt ?? Date.now()}`,
        published: Boolean(d.published),
        publishedUrl: d.publishedUrl || undefined,
      })) as Canvas[];
      setCanvases(mapped);
    } catch (e) {
      console.error("Failed to fetch canvases:", e);
      toast.error("Failed to load canvases");
    } finally {
      setLoading(false);
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
          publishedUrl: "",
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
    if (!window.confirm("Are you sure you want to delete this canvas?")) return;

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

  // 🌍 Publish site (calls /api/publish)
  const publishSite = async (id: string) => {
    try {
      toast.loading("Publishing site...");
      const res = await fetch("/api/publish", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (res.ok) {
        setCanvases((prev) =>
          prev.map((c) =>
            c.$id === id
              ? { ...c, published: true, publishedUrl: data.url }
              : c
          )
        );
        toast.success("Site published!");
      } else {
        toast.error(data.error || "Publish failed");
      }
    } catch (e) {
      console.error("Failed to publish:", e);
      toast.error("Something went wrong while publishing");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white shadow"
          onClick={createCanvas}
        >
          + New Canvas
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading canvases...</p>
      ) : canvases.length === 0 ? (
        <p className="text-slate-400">No canvases yet. Create one!</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {canvases.map((c) => (
            <div
              key={c.$id}
              className="glass p-5 rounded-2xl shadow-md flex flex-col justify-between"
            >
              <div>
                <Link
                  href={`/canvas/${c.$id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {c.title}
                </Link>
                <div
                  className={`mt-1 inline-block px-2 py-0.5 text-xs rounded-full ${
                    c.published
                      ? "bg-green-600/20 text-green-400"
                      : "bg-slate-600/20 text-slate-400"
                  }`}
                >
                  {c.published ? "Published" : "Draft"}
                </div>
              </div>

              <div className="mt-3">
                {c.published && c.publishedUrl ? (
                  <a
                    href={c.publishedUrl}
                    target="_blank"
                    className="text-cyan-400 hover:underline text-sm"
                  >
                    🌍 View Live Site
                  </a>
                ) : (
                  <span className="text-slate-500 text-sm">Not Published</span>
                )}
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <button
                  onClick={() =>
                    c.published ? toast.info("Unpublish coming soon") : publishSite(c.$id)
                  }
                  className={`px-3 py-1 rounded-lg ${
                    c.published
                      ? "bg-yellow-700 hover:bg-yellow-800 text-yellow-200"
                      : "bg-green-700 hover:bg-green-800 text-green-200"
                  }`}
                >
                  {c.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => deleteCanvas(c.$id)}
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-red-200 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
