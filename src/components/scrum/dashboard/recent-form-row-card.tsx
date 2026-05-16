import { MdChevronRight } from "react-icons/md";
import type { DashboardRecentResult } from "@/components/scrum/dashboard/dashboard-types";

type RecentFormRowCardProps = {
  result: DashboardRecentResult;
};

export function RecentFormRowCard({ result }: RecentFormRowCardProps) {
  const won = result.status === "WON";

  return (
    <button
      type="button"
      className="w-full flex items-center justify-between p-4 rounded-lg bg-surface-elevated/50 border border-white/5 hover:bg-surface-elevated transition-colors group cursor-pointer text-left"
    >
      <span className="flex items-center gap-4">
        <span className={`w-1.5 h-10 rounded-full ${won ? "bg-emerald-500" : "bg-red-500"}`} />
        <span>
          <span className={`block font-label mb-0.5 ${won ? "text-emerald-400" : "text-error"}`}>
            {result.status}
          </span>
          <span className="block font-body-ui text-on-surface">{result.opponent}</span>
        </span>
      </span>
      <span className="flex items-center gap-6">
        <span className="font-display-title-sm text-on-surface">{result.score}</span>
        <MdChevronRight
          className="text-muted-foreground group-hover:text-on-surface transition-colors text-xl shrink-0"
          aria-hidden
        />
      </span>
    </button>
  );
}
