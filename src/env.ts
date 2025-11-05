import { z } from "zod";

const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string(),
  TEAM_NAME: z.string(),
  API_TEMPLATE_IO_URL: z.string(),
  API_TEMPLATE_IO_API_KEY: z.string(),
  API_TEMPLATE_IO_ROSTER_STORY_ID: z.string(),
});

const env = envSchema.parse(process.env);

console.log("process.env", process.env);

export { env };
