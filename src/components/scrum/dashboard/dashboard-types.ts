import type { z } from "zod";
import type { dashboardOverviewSchema } from "@/lib/api/contracts/dashboard";

type DashboardOverview = z.infer<typeof dashboardOverviewSchema>;

export type DashboardNextMatch = DashboardOverview["nextMatch"];
export type DashboardDues = DashboardOverview["squadHealth"];
export type DashboardRecentResult = DashboardOverview["recentResults"][number];
export type DashboardQuickAction = DashboardOverview["quickActions"][number];
