import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteProps) {
  const { id } = await params; // ✅ canvasId
  const { email, role } = await req.json();

  try {
    // Create presence record for invited user
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PRESENCE_COLLECTION_ID!, // ✅ Use presence collection
      "unique()",
      {
        canvasId: id, // ✅ relation to canvases
        inviteEmail: email, // ✅ store invite email
        role: role || "viewer", // default role
        status: "invited",
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Invite Error:", error);
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    );
  }
}
