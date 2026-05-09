import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ScheduleLineupStatusBadgeProps = {
  isLineUpCreated: boolean;
  className?: string;
};

export function ScheduleLineupStatusBadge({
  isLineUpCreated,
  className,
}: ScheduleLineupStatusBadgeProps) {
  if (isLineUpCreated) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "shrink-0 border-emerald-500/40 bg-emerald-500/15 text-[10px] font-bold text-emerald-400 uppercase tracking-wide",
          className,
        )}
      >
        Done
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className={cn("shrink-0 text-[10px] font-bold uppercase tracking-wide", className)}>
      Not done
    </Badge>
  );
}
