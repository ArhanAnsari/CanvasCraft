// app/api/ai/suggest/route.ts
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    // ✅ Await the result
    const { text } = await streamText({
      model: google("gemini-2.5-flash"),
      prompt: `Generate JSON blocks for a landing page editor.
      Each block must be of type "hero", "cta", "features", "gallery", "footer", or "text".
      Format only valid JSON array. Do NOT wrap in markdown.
      Example: [{"id": "uuid", "type": "hero", "props": {...}}, ...]
      Prompt: ${prompt}`,
    });

    // ✅ text is async-accessed
    const raw = await text;
    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const blocks = JSON.parse(clean);

    return NextResponse.json({ blocks });
  } catch (e: any) {
    console.error("AI suggest error", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
