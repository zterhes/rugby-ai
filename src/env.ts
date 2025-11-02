import { z } from "zod";

const envSchema = z.object({
  GOOGLE_AI_API_KEY: z.string(),
  TEAM_NAME: z.string(),
});

const env = envSchema.parse(process.env);

console.log(env);

export { env };
