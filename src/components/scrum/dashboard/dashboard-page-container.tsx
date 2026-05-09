"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardPageView } from "@/components/scrum/dashboard/dashboard-page-view";
import { DASHBOARD_OVERVIEW_QUERY_KEY, getDashboardOverview } from "@/lib/data/dashboard-query";

export function DashboardPageContainer() {
  const { data, isLoading } = useQuery({
    queryKey: DASHBOARD_OVERVIEW_QUERY_KEY,
    queryFn: getDashboardOverview,
  });

  return (
    <DashboardPageView
      isLoading={isLoading}
      nextMatch={data?.nextMatch ?? null}
      dues={data?.squadHealth}
      recentResults={data?.recentResults ?? []}
      quickActions={data?.quickActions ?? []}
    />
  );
}
