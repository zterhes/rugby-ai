import { z } from "zod";

const serverEnvSchema = z.object({
  GOOGLE_AI_API_KEY: z.string(),
  TEAM_NAME: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string(),
  DATABASE_URL: z.url(),
});

const serverEnv = serverEnvSchema.parse({
  ...process.env,
});

export { serverEnv };
