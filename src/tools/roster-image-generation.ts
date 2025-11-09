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
    if (overrides.length < 23) {
      for (let i = overrides.length; i < 23; i++) {
        overrides.push(
          apiTemplateIoOverrideSchema.parse({
            name: `jersey_number_${i + 1}`,
            text: ``,
          })
        );
        overrides.push(
          apiTemplateIoOverrideSchema.parse({
            name: `fullName_${i + 1}`,
            text: ``,
          })
        );
      }
    }
    overrides.push(
      apiTemplateIoOverrideSchema.parse({
        name: `location`,
        text: input.location,
      })
    );
    overrides.push(
      apiTemplateIoOverrideSchema.parse({
        name: `date`,
        text: input.date,
      })
    );
    overrides.push(
      apiTemplateIoOverrideSchema.parse({
        name: `time`,
        text: input.time,
      })
    );
    const requestBody = apiTemplateIoRequestBodySchema.parse({
      overrides,
    });
    const response = await generateRosterStory(requestBody);
    return response;
  },
});
