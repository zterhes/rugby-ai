import { MdHealthAndSafety } from "react-icons/md";
import type { DashboardDues } from "@/components/scrum/dashboard/dashboard-types";
import { DuesProgressRowCard } from "@/components/scrum/dashboard/dues-progress-row-card";

type DuesCardProps = {
  dues: DashboardDues | undefined;
};

export function DuesCard({ dues }: DuesCardProps) {
  const totalRoster = dues?.totalRoster ?? 0;
  const dueUncollected = dues?.duesUncollected ?? 0;
  const compliancePercent = dues?.compliancePercent ?? 0;

  return (
    <aside className="rounded-xl border border-glass-border/30 shadow-xl backdrop-blur-xl bg-glass-fill/60 p-6 flex flex-col gap-6">
      <h3 className="font-display-title-xs text-on-surface flex items-center gap-2">
        <MdHealthAndSafety className="text-primary text-xl shrink-0" aria-hidden />
        Dues
      </h3>

      <div className="space-y-5">
        <DuesProgressRowCard
          label="Total Roster"
          value={`${totalRoster} Players`}
          progressWidthPercent={100}
          progressClassName="bg-secondary-fixed-dim"
        />

        <div>
          <DuesProgressRowCard
            label="Uncollected Dues"
            value={`${dueUncollected} / ${totalRoster}`}
            progressWidthPercent={100 - compliancePercent}
            progressClassName="bg-primary-container shadow-[0_0_10px_rgba(220,38,38,0.8)]"
          />
          <p className="font-subtitle-xs text-muted-foreground mt-1 text-right">
            {compliancePercent}% Collected
          </p>
        </div>

      </div>
    </aside>
  );
}
