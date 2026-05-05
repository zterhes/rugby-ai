import { dashboardOverviewResponseSchema } from "@/lib/api/contracts/dashboard";
import { apiGet } from "@/lib/api/client/http";

export const DASHBOARD_OVERVIEW_QUERY_KEY = ["dashboard", "overview"] as const;

export async function getDashboardOverview() {
  const res = await apiGet("/api/v1/dashboard/overview", dashboardOverviewResponseSchema);
  return res.data;
}
