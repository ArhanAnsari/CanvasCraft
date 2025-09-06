import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { id, userId } = await req.json();
    if (!id || !userId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const coll = process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!;
    const doc = await databases.getDocument(db, coll, id);

    const updated = await databases.updateDocument(db, coll, id, {
      sharedWith: [...(doc.sharedWith || []), userId],
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
