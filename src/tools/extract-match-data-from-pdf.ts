import { tool, generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { serverEnv } from "@/env";
import { EXTRACT_MATCH_DATA_FROM_PDF_TOOL_PROMPT } from "@/lib/promts/tool-promts";
import {
  extractMatchDataInputSchema,
  extractMatchDataOutputSchema,
  ExtractMatchDataOutput,
} from "@/lib/schemas";

const normalizeExtracted = (
  data: ExtractMatchDataOutput,
): ExtractMatchDataOutput => {
  const players = (data.players || []).map((player) => ({
    firstName: player.firstName.trim(),
    lastName: player.lastName.trim(),
    jerseyNumber: Number(player.jerseyNumber),
  }));

  return extractMatchDataOutputSchema.parse({
    ...data,
    players,
    date: data.date?.trim(),
    time: data.time?.trim(),
    location: data.location?.trim(),
    homeTeam: data.homeTeam?.trim(),
    awayTeam: data.awayTeam?.trim(),
    confidence: Math.max(0, Math.min(1, data.confidence)),
    missingFields: Array.from(new Set(data.missingFields.map((f) => f.trim()))),
  });
};

export const extractMatchDataFromPdfTool = tool({
  description: EXTRACT_MATCH_DATA_FROM_PDF_TOOL_PROMPT,
  inputSchema: extractMatchDataInputSchema,
  outputSchema: extractMatchDataOutputSchema,
  execute: async ({ flow, sourceText }) => {
    const google = createGoogleGenerativeAI({
      apiKey: serverEnv.GOOGLE_AI_API_KEY,
    });

    const extractionPrompt = `
Extract structured rugby match data from the following text.
Flow: ${flow}
Default team to prioritize: ${serverEnv.TEAM_NAME}

Rules:
- Return players only for lineup flows.
- Return score/team data when present.
- jerseyNumber must be integer.
- missingFields must list only truly missing required fields for the selected flow.
- confidence should be between 0 and 1.

Text:
${sourceText}
`;

    const extraction = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: extractMatchDataOutputSchema,
      prompt: extractionPrompt,
    });

    return normalizeExtracted({
      ...extraction.object,
      flow,
    });
  },
});
