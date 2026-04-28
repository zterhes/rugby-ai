import { streamText, UIMessage, convertToModelMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { serverEnv } from "@/env";
import { RUGBY_AI_SYSTEM_PROMPT } from "@/lib/promts/system-prompts";
import { extractMatchDataFromPdfTool } from "@/tools/extract-match-data-from-pdf";
import { renderMatchImageTool } from "@/tools/render-match-image";

export const maxDuration = 30;

export async function POST(req: Request) {
  const google = createGoogleGenerativeAI({
    apiKey: serverEnv.GOOGLE_AI_API_KEY,
  });

  const orchestratorModel = google("gemini-2.5-flash");

  const {
    messages,
  }: {
    messages: UIMessage[];
  } = await req.json();

  const result = streamText({
    model: orchestratorModel,
    messages: convertToModelMessages(messages),
    system: RUGBY_AI_SYSTEM_PROMPT,
    tools: {
      extractMatchDataFromPdf: extractMatchDataFromPdfTool,
      renderMatchImage: renderMatchImageTool,
    },
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
