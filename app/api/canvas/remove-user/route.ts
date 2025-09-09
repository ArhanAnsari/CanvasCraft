import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { uid } = await req.json();

  const canvas = await databases.getDocument("your-db-id", "canvases", params.id);
  const sharedWith = (canvas.sharedWith || []).filter((u: string) => u !== uid);

  await databases.updateDocument("your-db-id", "canvases", params.id, { sharedWith });

  return NextResponse.json({ success: true });
}
