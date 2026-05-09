import type { z } from "zod";
import type {
  dashboardOverviewSchema,
  dashboardRecentFormResponseSchema,
  dashboardUpcomingMatchResponseSchema,
} from "@/lib/api/contracts/dashboard";

type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;

type DashboardUpcomingMatchResponse = z.infer<typeof dashboardUpcomingMatchResponseSchema>;
type DashboardRecentFormResponse = z.infer<typeof dashboardRecentFormResponseSchema>;

export type DashboardNextMatch = DashboardUpcomingMatchResponse["data"];
export type DashboardDues = DashboardOverview["squadHealth"];
export type DashboardRecentResult = DashboardRecentFormResponse["data"][number];
export type DashboardQuickAction = DashboardOverview["quickActions"][number];
