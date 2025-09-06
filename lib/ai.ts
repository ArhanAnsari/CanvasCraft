import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function suggestBlocks(prompt: string) {
  const res = await generateText({
    model: google("gemini-2.0-flash"),
    prompt: `Return JSON only with an array "blocks". Blocks: hero, features, gallery, cta, footer. Example hero fields: heading, subheading, buttonLabel, buttonHref. User prompt: ${prompt}`,
  });

  try {
    const text = res.text || "";
    const jsonStart = text.indexOf("{");
    if (jsonStart >= 0) {
      const parsed = JSON.parse(text.slice(jsonStart));
      return parsed.blocks || [];
    }
    return [];
  } catch {
    return [];
  }
}
