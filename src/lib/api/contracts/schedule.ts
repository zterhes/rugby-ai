import { z } from "zod";
import { dateIsoSchema, listQuerySchema, paginationMetaSchema } from "@/lib/api/contracts/common";

export const matchStatusSchema = z.enum(["Final", "Upcoming"]);

export const scheduleMatchSchema = z.object({
  id: z.number().int().positive(),
  opponent: z.string(),
  date: z.string(),
  monthLabel: z.string(),
  venue: z.string(),
  status: matchStatusSchema,
  logo: z.string().url(),
  isActive: z.boolean().optional(),
  result: z.string().optional(),
  time: z.string().optional(),
  isHomeFixture: z.boolean().optional(),
  roundLabel: z.string().optional(),
  meetTime: z.string().optional(),
  meetLocation: z.string().optional(),
  kitPrimary: z.string().optional(),
  kitSecondary: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
  bannerImage: z.string().url().optional(),
});

export const scheduleListQuerySchema = listQuerySchema.extend({
  status: matchStatusSchema.optional(),
});

export const scheduleCreateRequestSchema = z.object({
  fixtureType: z.enum(["home", "away"]),
  opponentTeamId: z.string().min(1),
  dateIso: dateIsoSchema,
  kickoffTime: z.string().optional(),
  roundLabel: z.string().optional(),
  meetTime: z.string().optional(),
  kitPrimary: z.string().optional(),
  kitSecondary: z.string().optional(),
  venueName: z.string().optional(),
  venueAddress: z.string().optional(),
});

export const scheduleListResponseSchema = z.object({
  data: z.array(scheduleMatchSchema),
  meta: paginationMetaSchema,
});

export const scheduleCreateResponseSchema = z.object({
  data: scheduleMatchSchema.extend({ created: z.literal(false) }),
});

export type ScheduleCreateRequest = z.infer<typeof scheduleCreateRequestSchema>;
