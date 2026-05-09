import {
  dashboardOverviewResponseSchema,
  dashboardRecentFormResponseSchema,
  dashboardUpcomingMatchResponseSchema,
} from "@/lib/api/contracts/dashboard";
import { apiGet } from "@/lib/api/client/http";

export const DASHBOARD_OVERVIEW_QUERY_KEY = ["dashboard", "overview"] as const;
export const DASHBOARD_UPCOMING_MATCHES_QUERY_KEY = ["dashboard", "upcoming-matches"] as const;
export const DASHBOARD_RECENT_FORM_QUERY_KEY = ["dashboard", "recent-form"] as const;

export async function getDashboardOverview() {
  const res = await apiGet("/api/v1/dashboard/overview", dashboardOverviewResponseSchema);
  return res.data;
}

export async function getDashboardUpcomingMatches() {
  const res = await apiGet(
    "/api/v1/dashboard/upcoming-matches",
    dashboardUpcomingMatchResponseSchema,
  );
  return res.data;
}

export async function getDashboardRecentForm() {
  const res = await apiGet("/api/v1/dashboard/recent-form", dashboardRecentFormResponseSchema);
  return res.data;
}
