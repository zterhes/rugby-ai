import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/env";
import { rosterImageGeneratorTool } from "@/tools/roster-image-generation";
import { RUGBY_AI_SYSTEM_PROMPT } from "@/lib/promts/system-prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const google = createGoogleGenerativeAI({
    apiKey: env.GOOGLE_AI_API_KEY,
  });
  const model = google("gemini-2.5-flash");
  const {
    messages,
  }: {
    messages: UIMessage[];
  } = await req.json();

  const result = streamText({
    model: model,
    messages: convertToModelMessages(messages),
    system: RUGBY_AI_SYSTEM_PROMPT,
    tools: {
      rosterImageGenerator: rosterImageGeneratorTool,
    },
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
