import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Generate JSON blocks for a landing page editor.
Each block must be of type "hero", "cta", "features", "gallery", "video", "form", "footer", "text", "image", or "button".
Ensure each block has useful example props (like real headlines, button text, image urls, gallery items, video embeds, form fields).
Return ONLY a valid JSON array. Do NOT wrap in markdown, code fences, or extra text.
Example: [{"id":"uuid","type":"hero","props":{"headline":"Welcome to My App","tagline":"Fast. Modern. Reliable."}}]
Prompt: ${prompt}`,
    });

    // Clean response: remove markdown/code fences if AI accidentally adds them
    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const blocks = JSON.parse(clean);

    return NextResponse.json({ blocks });
  } catch (e: any) {
    console.error("AI suggest error", e);
    return NextResponse.json({ error: e.message, raw: e.toString() }, { status: 500 });
  }
}
