"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardPageView } from "@/components/scrum/dashboard/dashboard-page-view";
import {
  DASHBOARD_OVERVIEW_QUERY_KEY,
  DASHBOARD_RECENT_FORM_QUERY_KEY,
  DASHBOARD_UPCOMING_MATCHES_QUERY_KEY,
  getDashboardOverview,
  getDashboardRecentForm,
  getDashboardUpcomingMatches,
} from "@/lib/data/dashboard-query";

export function DashboardPageContainer() {
  const { data: overviewData } = useQuery({
    queryKey: DASHBOARD_OVERVIEW_QUERY_KEY,
    queryFn: getDashboardOverview,
  });
  const { data: upcomingMatches, isLoading: isUpcomingLoading } = useQuery({
    queryKey: DASHBOARD_UPCOMING_MATCHES_QUERY_KEY,
    queryFn: getDashboardUpcomingMatches,
  });
  const { data: recentForm } = useQuery({
    queryKey: DASHBOARD_RECENT_FORM_QUERY_KEY,
    queryFn: getDashboardRecentForm,
  });

  return (
    <DashboardPageView
      isUpcomingLoading={isUpcomingLoading}
      upcomingMatch={upcomingMatches ?? null}
      dues={overviewData?.squadHealth}
      recentResults={recentForm ?? []}
      quickActions={overviewData?.quickActions ?? []}
    />
  );
}
