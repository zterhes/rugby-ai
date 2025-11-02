import { ROSTER_IMAGE_GENERATION_TOOL_PROMPT } from "@/lib/promts/tool-promts";
import {
  apiTemplateIoOverrideSchema,
  ApiTemplateIoOverride,
  teamExtractionOutputSchema,
  apiTemplateIoRequestBodySchema,
  apiTemplateIoResponseSchema,
} from "@/lib/schemas";
import { tool } from "ai";
import { generateRosterStory } from "@/tools/clients/api-template-io.client";

//TODO: Find the way to separate data extraction and image generation
export const rosterImageGeneratorTool = tool({
  description: ROSTER_IMAGE_GENERATION_TOOL_PROMPT,
  inputSchema: teamExtractionOutputSchema,
  outputSchema: apiTemplateIoResponseSchema,
  execute: async (input) => {
    let overrides: ApiTemplateIoOverride[] = [];
    input.team.map((team) => {
      overrides.push(
        apiTemplateIoOverrideSchema.parse({
          name: `fullName_${team.jerseyNumber}`,
          text: `${team.lastName} ::${team.firstName}::`,
        })
      );
    });
    const requestBody = apiTemplateIoRequestBodySchema.parse({
      overrides,
    });
    const response = await generateRosterStory(requestBody);
    console.log(response);
    return response;
  },
});
