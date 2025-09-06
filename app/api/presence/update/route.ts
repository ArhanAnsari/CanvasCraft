// app/api/presence/update/route.ts
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { Query } from "appwrite";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { canvasId, isOnline } = await req.json();

    const existing = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!,
      [Query.equal("userId", session.user.$id), Query.equal("canvasId", canvasId)]
    );

    if (existing.total > 0) {
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_PRESENCE_COLLECTION_ID!,
        existing.documents[0].$id,
        { isOnline }
      );
    } else {
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID!,
        process.env.APPWRITE_PRESENCE_COLLECTION_ID!,
        ID.unique(),
        { userId: session.user.$id, canvasId, isOnline }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
