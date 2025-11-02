import z from "zod";

const teamSchema = z.object({
  name: z.string(),
  starting15: z.array(z.string()),
  substitutes: z.array(z.string()),
  staff: z.array(z.string()),
});

const playerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jerseyNumber: z.number(),
});

export const teamExtractionOutputSchema = z.object({
  team: z.array(playerSchema),
  location: z.string(),
  date: z.string(),
  time: z.string(),
});

export const apiTemplateIoOverrideSchema = z.object({
  name: z.string(),
  text: z.string(),
});

export type ApiTemplateIoOverride = z.infer<typeof apiTemplateIoOverrideSchema>;

export const apiTemplateIoRequestBodySchema = z.object({
  overrides: z.array(apiTemplateIoOverrideSchema),
});

export const apiTemplateIoResponseSchema = z.object({
  download_url: z.string(),
  download_url_png: z.string(),
  template_id: z.string(),
  transaction_ref: z.string(),
  status: z.string(),
  post_actions: z.array(z.string()),
});

export type ApiTemplateIoResponse = z.infer<typeof apiTemplateIoResponseSchema>;
