import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteProps) {
  const { id } = await params; // ✅ Await params
  const { title } = await req.json();

  try {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
      id,
      { title, status: "draft" }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
