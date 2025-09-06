// app/api/canvas/create/route.ts
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { ID, Permission, Role } from "appwrite";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();

    const doc = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
      ID.unique(),
      {
        name,
        ownerId: session.user.$id,
      },
      [
        Permission.read(Role.user(session.user.$id)),
        Permission.update(Role.user(session.user.$id)),
        Permission.delete(Role.user(session.user.$id)),
      ]
    );

    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
