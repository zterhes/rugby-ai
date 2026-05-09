import Link from "next/link";
import { MdHistory } from "react-icons/md";
import type { DashboardRecentResult } from "@/components/scrum/dashboard/dashboard-types";
import { RecentFormRowCard } from "@/components/scrum/dashboard/recent-form-row-card";

type RecentFormCardProps = {
  results: DashboardRecentResult[];
};

export function RecentFormCard({ results }: RecentFormCardProps) {
  return (
    <section className="lg:col-span-2 rounded-xl border border-glass-border/30 shadow-xl backdrop-blur-xl bg-glass-fill/40 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display-title-xs text-on-surface flex items-center gap-2">
          <MdHistory className="text-secondary text-xl shrink-0" aria-hidden />
          Recent Form
        </h3>
        <Link
          href="/schedule"
          className="font-label text-primary hover:text-primary-fixed transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <RecentFormRowCard key={result.id} result={result} />
        ))}
      </div>
    </section>
  );
}
