import { z } from "zod";

export const rosterSummarySchema = z.object({
  totalPlayers: z.number().int().nonnegative(),
  duesPaidCount: z.number().int().nonnegative(),
  duesPendingCount: z.number().int().nonnegative(),
  compliancePercent: z.number().min(0).max(100),
});

export const rosterSummaryResponseSchema = z.object({
  data: rosterSummarySchema,
});
