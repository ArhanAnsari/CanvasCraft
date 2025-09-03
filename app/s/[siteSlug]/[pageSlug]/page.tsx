import { databases, Query } from "@/lib/appwrite";
import { Block } from "@/components/CanvasEditor/templates";
import ReadOnlyBlockRenderer from "@/components/CanvasEditor/ReadOnlyBlockRenderer";

export const dynamic = "force-dynamic";

export default async function PublishedPage({
  params,
}: {
  params: { siteSlug: string; pageSlug: string };
}) {
  const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const coll = process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!;

  const res = await databases.listDocuments(db, coll, [
    Query.equal("siteSlug", params.siteSlug),
    Query.equal("pageSlug", params.pageSlug),
  ]);

  const doc = res.documents[0];

  if (!doc || !doc.published) {
    return <div className="mt-12 text-center">404 – Not Published</div>;
  }

  // ✅ parse JSON strings back to Block objects
  const blocks: Block[] = (doc.blocks || []).map((b: any) => {
    try {
      return typeof b === "string" ? JSON.parse(b) : b;
    } catch {
      return null;
    }
  }).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{doc.title}</h1>
      <div className="space-y-4">
        {blocks.map((block: Block) => (
          <ReadOnlyBlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}
