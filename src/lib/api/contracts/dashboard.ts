import { z } from "zod";

export const nextMatchSchema = z.object({
  opponent: z.string(),
  kickoffAtUtc: z.string().datetime(),
  venueLabel: z.string(),
});

const squadHealthSchema = z.object({
  totalRoster: z.number().int().nonnegative(),
  duesCollected: z.number().int().nonnegative(),
  duesUncollected: z.number().int().nonnegative(),
  compliancePercent: z.number().min(0).max(100),
});

export const recentResultSchema = z.object({
  id: z.string(),
  status: z.enum(["WON", "LOST", "DRAW"]),
  opponent: z.string(),
  score: z.string(),
});

export const dashboardOverviewSchema = z.object({
  nextMatch: nextMatchSchema.nullable(),
  squadHealth: squadHealthSchema,
  recentResults: z.array(recentResultSchema),
  quickActions: z.array(
    z.object({ id: z.string(), label: z.string(), href: z.string() }),
  ),
});

export const dashboardOverviewResponseSchema = z.object({
  data: dashboardOverviewSchema,
});

export const dashboardUpcomingMatchResponseSchema = z.object({
  data: nextMatchSchema.nullable(),
});

export const dashboardRecentFormResponseSchema = z.object({
  data: z.array(recentResultSchema),
});
