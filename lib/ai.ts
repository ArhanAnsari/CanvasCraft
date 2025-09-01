import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
// export const gemini = google({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });

export async function suggestBlocks(prompt: string){
  const res = await generateText({
    model: google('gemini-2.0-flash'),
    prompt: `You are a site section generator. Output STRICT JSON with an array named blocks. Blocks can be hero, features, gallery, cta, footer. Example hero fields: heading, subheading, buttonLabel, buttonHref. Keep to 3-5 blocks. User prompt: ${prompt}`
  });
  try{
    const text = res.text || "";
    // find first { to try parse
    const jsonStart = text.indexOf("{");
    if(jsonStart >= 0){
      const json = JSON.parse(text.slice(jsonStart));
      return json.blocks || [];
    }
    return [];
  }catch(e){
    console.error("AI error", e);
    return [];
  }
}

export async function suggestWithAI(prompt: string) {
    const { text } = await generateText({
        model: google('gemini-2.0-flash'),
        prompt: `You are a helpful assistant that provides concise suggestions. User prompt: ${prompt}`
    });
    return text;
}