import { NextResponse } from "next/server";
import { databases, Query } from "@/lib/appwrite";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { uid } = await req.json();

    const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const canvasesColl = process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!;
    const presenceColl = process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!;

    const canvas = await databases.getDocument(db, canvasesColl, params.id);

    // 🔹 Update sharedWith field
    const sharedWith = (canvas.sharedWith || []).filter((u: string) => u !== uid);
    await databases.updateDocument(db, canvasesColl, params.id, { sharedWith });

    // 🔹 Remove presence entry
    const res = await databases.listDocuments(db, presenceColl, [
      Query.equal("canvasId", params.id),
      Query.equal("userId", uid),
    ]);

    for (const doc of res.documents) {
      await databases.deleteDocument(db, presenceColl, doc.$id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
