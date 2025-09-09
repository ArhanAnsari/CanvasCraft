import { NextResponse } from "next/server";
import { databases, Query } from "@/lib/appwrite";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const presenceColl = process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!;

    // 🔹 Find collaborators by presence
    const res = await databases.listDocuments(db, presenceColl, [
      Query.equal("canvasId", params.id),
    ]);

    return NextResponse.json({ users: res.documents });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
