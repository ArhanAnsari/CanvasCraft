'use client';

import { useEffect, useState } from "react";
import { databases, ID, account } from "@/lib/appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { Pencil, Trash2, Share2, Globe, GlobeLock } from "lucide-react";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Canvas {
  $id: string;
  title: string;
  published: boolean;
  publishedUrl?: string;
  blocks?: any[];
  userId: string;
  sharedWith?: string[];
}

export default function Dashboard() {
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [me, setMe] = useState<any>(null);
  const { user } = useAuth();

  if (!user) return null;

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        const user = await account.get();
        setMe(user);
        fetchCanvases(user.$id);
      } catch {
        router.replace("/login");
      }
    };
    checkAuthAndLoad();
  }, [router]);

  useEffect(() => {
  const unsubscribe = databases.client.subscribe(
    `databases.${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}.collections.${process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID}.documents`,
    (res: any) => {
      fetchCanvases(me?.$id);
    }
  );
    return () => unsubscribe();
  }, [me]);

  const fetchCanvases = async (uid: string) => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!
      );

      const docs = res.documents || [];
      const mapped = (docs as any[])
        .filter((d) => d.userId === uid || (d.sharedWith || []).includes(uid))
        .map((d) => ({
          $id: d.$id,
          title: d.title ?? `Untitled ${d.$createdAt ?? Date.now()}`,
          published: Boolean(d.published),
          publishedUrl: d.publishedUrl || undefined,
          userId: d.userId,
          sharedWith: d.sharedWith || [],
          blocks: (d.blocks || [])
            .map((b: string) => {
              try {
                return JSON.parse(b);
              } catch {
                return null;
              }
            })
            .filter(Boolean),
        })) as Canvas[];
      setCanvases(mapped);
    } catch (e) {
      console.error("Failed to fetch canvases:", e);
      toast.error("Failed to load canvases");
    } finally {
      setLoading(false);
    }
  };

  const createCanvas = async () => {
    try {
      const user = await account.get();

      const doc = await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
        ID.unique(),
        {
          title: `Untitled ${Date.now()}`,
          blocks: [],
          published: false,
          publishedUrl: "",
          ownerId: user.$id,
          userId: user.$id,
        }
      );

      toast.success("New canvas created!");
      router.push(`/canvas/${doc.$id}`);
    } catch (e) {
      console.error("Failed to create canvas:", e);
      toast.error("Failed to create canvas");
    }
  };

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
            c.$id === id ? { ...c, published: true, publishedUrl: data.url } : c
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

  const unpublishSite = async (id: string) => {
    try {
      toast.loading("Unpublishing site...");
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
        id,
        {
          published: false,
          publishedUrl: "",
        }
      );

      setCanvases((prev) =>
        prev.map((c) =>
          c.$id === id ? { ...c, published: false, publishedUrl: "" } : c
        )
      );
      toast.success("Site unpublished!");
    } catch (e) {
      console.error("Failed to unpublish:", e);
      toast.error("Unpublish failed");
    } finally {
      toast.dismiss();
    }
  };

  const shareCanvas = async (canvasId: string, userId: string) => {
  const doc = await databases.getDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
    canvasId
  );

  const updatedSharedWith = Array.isArray(doc.sharedWith) ? doc.sharedWith : [];
  if (!updatedSharedWith.includes(userId)) {
    updatedSharedWith.push(userId);
  }

  await databases.updateDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
    canvasId,
    { sharedWith: updatedSharedWith }
  );
};


  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white shadow w-full sm:w-auto"
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
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {canvases.map((c) => (
            <div
              key={c.$id}
              className="relative bg-slate-800/40 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-lg flex flex-col justify-between 
              transform transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600">
                      <MoreVertical size={16} className="text-slate-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border border-slate-700">
                    <DropdownMenuItem onClick={() => router.push(`/canvas/${c.$id}`)}> <Pencil size={16} className="text-slate-300" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareCanvas(c.$id, user.$id)}> <Share2 size={16} className="text-slate-300" /> Share</DropdownMenuItem>
                    {c.published ? (
                      <DropdownMenuItem onClick={() => unpublishSite(c.$id)}> <GlobeLock size={16} className="text-yellow-400" /> Unpublish</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => publishSite(c.$id)}> <Globe size={16} className="text-green-400" /> Publish</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => deleteCanvas(c.$id)} className="text-red-400"> <Trash2 size={16} className="text-red-400" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 🔹 Card Content */}
              <div>
                <Link
                  href={`/canvas/${c.$id}`}
                  className="text-lg font-semibold hover:underline text-slate-100"
                >
                  {c.title}
                </Link>

                <span
                  className={`ml-3 inline-block px-3 py-1 text-xs rounded-full ${c.published
                      ? "bg-green-600/20 text-green-400"
                      : "bg-slate-600/20 text-slate-400"
                    }`}
                >
                  {c.published ? "Published" : "Draft"}
                </span>

                <div className="mt-2 text-sm text-slate-400">
                  {c.userId === me?.$id ? "👑 Owner" : "👥 Shared"}
                </div>
              </div>

              <div className="mt-3">
                {c.published && c.publishedUrl ? (
                  <a
                    href={c.publishedUrl}
                    target="_blank"
                    className="text-cyan-400 hover:underline text-sm break-words"
                  >
                    🌍 View Live Site
                  </a>
                ) : (
                  <span className="text-slate-500 text-sm">Not Published</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
