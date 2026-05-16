import { z } from "@/lib/api/zod-openapi";

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().url(),
  venueMapUrl: z.string().url(),
});

export const teamsListQuerySchema = z.object({
  search: z.string().optional(),
});

export const teamCreateRequestSchema = z.object({
  name: z.string().trim().min(2),
  logo: z.string().trim().url(),
  venueMapUrl: z.string().trim().url(),
});

export const teamsListResponseSchema = z.object({
  data: z.array(teamSchema),
});

export const teamCreateResponseSchema = z.object({
  data: teamSchema.extend({ created: z.literal(false) }),
});

export type Team = z.infer<typeof teamSchema>;
export type TeamCreateRequest = z.infer<typeof teamCreateRequestSchema>;
