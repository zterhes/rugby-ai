import { MdBolt, MdEditCalendar, MdPersonAdd } from "react-icons/md";
import type { IconType } from "react-icons";
import type { DashboardQuickAction } from "@/components/scrum/dashboard/dashboard-types";
import { QuickActionLinkCard } from "@/components/scrum/dashboard/quick-action-link-card";

type QuickActionsCardProps = {
  quickActions: DashboardQuickAction[];
};

const ACTION_ICONS: Record<string, IconType> = {
  "add-player": MdPersonAdd,
  "schedule-match": MdEditCalendar,
};

export function QuickActionsCard({ quickActions }: QuickActionsCardProps) {
  return (
    <section className="rounded-xl border border-glass-border/30 shadow-xl backdrop-blur-xl bg-glass-fill/40 p-6">
      <h3 className="font-display-title-xs text-on-surface flex items-center gap-2 mb-6">
        <MdBolt className="text-secondary text-xl shrink-0" aria-hidden />
        Quick Actions
      </h3>

      <div className="flex flex-col gap-3">
        {quickActions.map((action) => {
          const icon = ACTION_ICONS[action.id] ?? MdBolt;
          return <QuickActionLinkCard key={action.id} href={action.href} label={action.label} icon={icon} />;
        })}
      </div>
    </section>
  );
}
