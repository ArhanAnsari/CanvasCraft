import { NextResponse } from "next/server";
import { suggestBlocks } from "@/lib/ai";

export async function POST(req: Request){
  try{
    const { prompt } = await req.json();
    const blocks = await suggestBlocks(prompt || "Landing page for a modern startup");
    return NextResponse.json({ blocks });
  }catch(e){
    return NextResponse.json({ error: "AI suggestion failed" }, { status: 500 });
  }
}
