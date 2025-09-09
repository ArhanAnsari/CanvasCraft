import { NextResponse } from "next/server";
import { databases, ID } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { id, userId, role = "viewer" } = await req.json();
    if (!id || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const canvasesColl = process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!;
    const presenceColl = process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!;

    const doc = await databases.getDocument(db, canvasesColl, id);

    // 🔹 Update sharedWith field
    const updated = await databases.updateDocument(db, canvasesColl, id, {
      sharedWith: [...(doc.sharedWith || []), userId],
    });

    // 🔹 Add presence record
    await databases.createDocument(db, presenceColl, ID.unique(), {
      canvasId: id,
      userId,
      ownerId: doc.ownerId,
      role,
      status: "invited",
      lastActiveAt: new Date().toISOString(),
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
