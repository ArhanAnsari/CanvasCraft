// app/api/canvas/list/route.ts
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const docs = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
      [
        Query.equal("ownerId", session.user.$id), // owned canvases
        // Appwrite automatically includes docs shared with the user via permissions
      ]
    );

    return NextResponse.json(docs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
