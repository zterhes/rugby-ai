import type { ScheduleMatch } from "@/lib/data/schedule";

type GroupedMatches = Record<string, ScheduleMatch[]>;

type ScheduleMatchListProps = {
  groupedMatches: GroupedMatches;
  selectedMatchId: number | null;
  onSelectMatch: (matchId: number) => void;
};

export function ScheduleMatchList({
  groupedMatches,
  selectedMatchId,
  onSelectMatch,
}: ScheduleMatchListProps) {
  const monthEntries = Object.entries(groupedMatches);

  return (
    <div className="xl:col-span-4 space-y-6">
      {monthEntries.map(([monthLabel, matches]) => (
        <div key={monthLabel} className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
            {monthLabel}
          </h3>
          {matches.map((match) => (
            <MatchListItem
              key={match.id}
              match={match}
              isSelected={selectedMatchId === match.id}
              onSelect={onSelectMatch}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

type MatchListItemProps = {
  match: ScheduleMatch;
  isSelected: boolean;
  onSelect: (matchId: number) => void;
};

function MatchListItem({ match, isSelected, onSelect }: MatchListItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(match.id)}
      className={`w-full p-4 rounded-2xl border transition-all cursor-pointer text-left ${isSelected ? "bg-primary-container/10 border-primary-container/30" : "bg-glass-fill/30 border-glass-border/40 opacity-80 hover:opacity-100"}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black/20 rounded-xl p-2 border border-white/5 overflow-hidden">
          <img src={match.logo} alt={match.opponent} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold truncate text-on-background">vs {match.opponent}</h4>
            <span className="text-[10px] font-bold text-muted-foreground">{match.date}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-muted-foreground truncate">{match.venue}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${match.status === "Final" ? "bg-white/5 text-muted-foreground" : "bg-primary-container/20 text-primary"}`}
            >
              {match.result ?? match.time ?? "TBD"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
