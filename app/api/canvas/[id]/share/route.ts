import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { email, role } = await req.json();

  try {
    // Store invite record in DB (you can later send email notifications here)
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
      "unique()",
      {
        canvasId: params.id,
        email,
        role,
        status: "pending",
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
  }
}
