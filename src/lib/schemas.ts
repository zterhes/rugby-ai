import z from "zod";

const teamSchema = z.object({
  name: z.string(),
  starting15: z.array(z.string()),
  substitutes: z.array(z.string()),
  staff: z.array(z.string()),
});

export const teamExtractionResultSchema = z.object({
  home: teamSchema,
  away: teamSchema,
  date: z.string(),
  time: z.string(),
  location: z.string(),
});
