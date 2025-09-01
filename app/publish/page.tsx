'use client';
import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";

export default function Publish() {
  const [published, setPublished] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
          process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID || ""
        );
        setPublished((res.documents || []).filter((d: any) => d.publishedUrl));
      } catch (e) {
        console.error("Failed to load published canvases:", e);
      }
    })();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Published Sites</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {published.map((p) => (
          <div key={p.$id} className="glass p-4 rounded">
            <h3 className="font-semibold">{p.title}</h3>
            {p.publishedUrl ? (
              <a
                href={p.publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 text-sm hover:underline"
              >
                {p.publishedUrl}
              </a>
            ) : (
              <div className="text-xs text-slate-400">No URL</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
