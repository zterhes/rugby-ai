import type {
  DashboardDues,
  DashboardNextMatch,
  DashboardQuickAction,
  DashboardRecentResult,
} from "@/components/scrum/dashboard/dashboard-types";
import { DuesCard } from "@/components/scrum/dashboard/dues-card";
import { NextMatchCard } from "@/components/scrum/dashboard/next-match-card";
import { OverviewHeaderCard } from "@/components/scrum/dashboard/overview-header-card";
import { QuickActionsCard } from "@/components/scrum/dashboard/quick-actions-card";
import { RecentFormCard } from "@/components/scrum/dashboard/recent-form-card";

type DashboardPageViewProps = {
  isUpcomingLoading: boolean;
  upcomingMatch: DashboardNextMatch;
  dues: DashboardDues | undefined;
  recentResults: DashboardRecentResult[];
  quickActions: DashboardQuickAction[];
};

export function DashboardPageView({
  isUpcomingLoading,
  upcomingMatch,
  dues,
  recentResults,
  quickActions,
}: DashboardPageViewProps) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-background to-background" />

      <main className="px-6 pb-12 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col gap-8">
          <OverviewHeaderCard
            title="Overview"
            subtitle="Current season status and upcoming priorities."
          />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <NextMatchCard isLoading={isUpcomingLoading} upcomingMatch={upcomingMatch} />
            <DuesCard dues={dues} />
            <RecentFormCard results={recentResults} />
            <QuickActionsCard quickActions={quickActions} />
          </section>
        </div>
      </main>
    </>
  );
}
