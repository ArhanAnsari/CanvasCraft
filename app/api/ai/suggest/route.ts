// app/api/ai/suggest/route.ts
import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt: `
        Generate JSON blocks for a landing page editor.
        Each block must be one of: "hero", "cta", "features", "gallery", "footer", or "text".
        
        Strictly return a valid JSON array in this format:
        [
          {"id": "uuid", "type": "hero", "props": {...}},
          {"id": "uuid", "type": "cta", "props": {...}}
        ]

        Prompt: ${prompt}
      `,
    });

    const blocks = JSON.parse(text);
    return NextResponse.json({ blocks });
  } catch (e: any) {
    console.error("AI suggest error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
