import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params; // ✅ Await params
    const { title } = await req.json();

    await databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
      id,
      { title, status: "published" }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Publish Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
