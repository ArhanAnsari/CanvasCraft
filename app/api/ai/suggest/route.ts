import { NextResponse } from "next/server";
import { suggestBlocks } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const blocks = await suggestBlocks(prompt || "Landing page");
    return NextResponse.json({ blocks });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
