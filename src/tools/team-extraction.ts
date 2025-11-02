import { TEAM_EXTRACTION_TOOL_PROMPT } from "@/lib/promts/tool-promts";
import { teamExtractionResultSchema } from "@/lib/schemas";
import { tool } from "ai";

export const teamExtractionTool = tool({
  description: TEAM_EXTRACTION_TOOL_PROMPT,
  inputSchema: teamExtractionResultSchema,
  outputSchema: teamExtractionResultSchema,
  execute: async (input) => {
    console.log(input);
    return input;
  },
});
