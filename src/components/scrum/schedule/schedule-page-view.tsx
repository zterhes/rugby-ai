import { MdAdd, MdSportsRugby } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScheduleMatchDetails } from "@/components/scrum/schedule/schedule-match-details";
import { ScheduleMatchList } from "@/components/scrum/schedule/schedule-match-list";
import type {
  MatchDraft,
  TeamDraft,
} from "@/components/scrum/schedule/schedule-page-container";
import type { ScheduleMatch } from "@/lib/data/schedule";
import type { Team } from "@/lib/data/teams";

type GroupedMatches = Record<string, ScheduleMatch[]>;

type SchedulePageViewProps = {
  groupedMatches: GroupedMatches;
  activeMatch: ScheduleMatch | null;
  selectedMatchId: number | null;
  isLoading: boolean;
  isError: boolean;
  onSelectMatch: (matchId: number) => void;
  teamName: string;
  teams: Team[];
  isTeamsLoading: boolean;
  isTeamsError: boolean;
  matchDraft: MatchDraft;
  teamDraft: TeamDraft;
  selectedOpponent: Team | null;
  isCreateMatchOpen: boolean;
  isCreateTeamOpen: boolean;
  matchFormError: string | null;
  teamFormError: string | null;
  isCreatingMatch: boolean;
  isCreatingTeam: boolean;
  onOpenCreateMatch: () => void;
  onCreateMatchOpenChange: (open: boolean) => void;
  onCreateTeamOpenChange: (open: boolean) => void;
  onMatchDraftChange: <K extends keyof MatchDraft>(
    key: K,
    value: MatchDraft[K],
  ) => void;
  onTeamDraftChange: <K extends keyof TeamDraft>(
    key: K,
    value: TeamDraft[K],
  ) => void;
  onCreateMatch: () => Promise<void>;
  onCreateTeam: () => Promise<void>;
};

export function SchedulePageView({
  groupedMatches,
  activeMatch,
  selectedMatchId,
  isLoading,
  isError,
  onSelectMatch,
  teamName,
  teams,
  isTeamsLoading,
  isTeamsError,
  matchDraft,
  teamDraft,
  selectedOpponent,
  isCreateMatchOpen,
  isCreateTeamOpen,
  matchFormError,
  teamFormError,
  isCreatingMatch,
  isCreatingTeam,
  onOpenCreateMatch,
  onCreateMatchOpenChange,
  onCreateTeamOpenChange,
  onMatchDraftChange,
  onTeamDraftChange,
  onCreateMatch,
  onCreateTeam,
}: SchedulePageViewProps) {
  const isHome = matchDraft.fixtureType === "home";

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-background to-background" />

      <main className="pb-12 px-4 md:px-page-padding max-w-[1440px] mx-auto min-h-screen flex flex-col gap-8">
        <section className="flex items-end justify-between border-b border-glass-border/30 pb-6">
          <div>
            <h1 className="mb-1 font-display-title text-display-title text-on-background drop-shadow-sm">
              Match Schedule
            </h1>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Manage upcoming fixtures and past results.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCreateMatch}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 text-sm font-label text-on-primary-container shadow-[0_0_16px_rgba(220,38,38,0.35)] transition-all hover:bg-primary-container/90"
          >
            <MdAdd className="text-lg" aria-hidden />
            Add New Match
          </button>
        </section>

        <Dialog open={isCreateMatchOpen} onOpenChange={onCreateMatchOpenChange}>
          <DialogContent className="max-w-2xl border-glass-border/40 bg-surface text-on-background">
            <DialogHeader>
              <DialogTitle>Create New Match</DialogTitle>
              <DialogDescription>
                Set match details and choose the opponent.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Fixture Type
                </label>
                <Select
                  value={matchDraft.fixtureType}
                  onValueChange={(value) =>
                    onMatchDraftChange("fixtureType", value as "home" | "away")
                  }
                >
                  <SelectTrigger className="w-full mt-1 border-glass-border/50">
                    <SelectValue placeholder="Select fixture type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="away">Away</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Opponent Team
                </label>
                <div className="flex gap-2 mt-1">
                  <Select
                    value={matchDraft.opponentTeamId}
                    onValueChange={(value) =>
                      onMatchDraftChange("opponentTeamId", value)
                    }
                    disabled={isTeamsLoading || isTeamsError}
                  >
                    <SelectTrigger className="w-full border-glass-border/50">
                      <SelectValue
                        placeholder={
                          isTeamsLoading
                            ? "Loading teams..."
                            : isTeamsError
                              ? "Could not load teams"
                              : "Select opponent"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => onCreateTeamOpenChange(true)}
                    className="px-3 rounded-md border border-glass-border/50 bg-glass-fill/30 text-sm font-medium hover:bg-glass-fill/50"
                  >
                    Add Team
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date
                </label>
                <Input
                  type="date"
                  value={matchDraft.dateIso}
                  onChange={(event) =>
                    onMatchDraftChange("dateIso", event.target.value)
                  }
                  className="mt-1 border-glass-border/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Kick-off
                </label>
                <Input
                  type="time"
                  value={matchDraft.kickoffTime}
                  onChange={(event) =>
                    onMatchDraftChange("kickoffTime", event.target.value)
                  }
                  className="mt-1 border-glass-border/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Round
                </label>
                <Input
                  type="text"
                  value={matchDraft.roundLabel}
                  onChange={(event) =>
                    onMatchDraftChange("roundLabel", event.target.value)
                  }
                  placeholder="Round 4"
                  className="mt-1 border-glass-border/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Meet Time
                </label>
                <Input
                  type="text"
                  value={matchDraft.meetTime}
                  onChange={(event) =>
                    onMatchDraftChange("meetTime", event.target.value)
                  }
                  placeholder="13:30"
                  className="mt-1 border-glass-border/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Meet Location
                </label>
                <Input
                  type="text"
                  value={matchDraft.meetLocation}
                  onChange={(event) =>
                    onMatchDraftChange("meetLocation", event.target.value)
                  }
                  placeholder="Locker room, team bus, …"
                  className="mt-1 border-glass-border/50"
                />
              </div>
            </div>

            <div className="rounded-lg border border-glass-border/50 bg-glass-fill/20 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Fixed Team Sides
              </p>
              <div className="grid grid-cols-2 gap-3 items-center">
                <TeamSideCard
                  label="Left Side"
                  teamName={
                    isHome
                      ? teamName
                      : (selectedOpponent?.name ?? "Select Opponent")
                  }
                  logo={isHome ? undefined : selectedOpponent?.logo}
                />
                <TeamSideCard
                  label="Right Side"
                  teamName={
                    isHome
                      ? (selectedOpponent?.name ?? "Select Opponent")
                      : teamName
                  }
                  logo={isHome ? selectedOpponent?.logo : undefined}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {isHome
                  ? "Home fixture: your team is fixed on the left side."
                  : "Away fixture: your team is fixed on the right side."}
              </p>
            </div>

            {matchFormError ? (
              <p className="text-sm text-error">{matchFormError}</p>
            ) : null}

            <DialogFooter>
              <button
                type="button"
                onClick={() => onCreateMatchOpenChange(false)}
                className="rounded-md border border-glass-border/50 px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void onCreateMatch()}
                disabled={isCreatingMatch}
                className="rounded-md bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container disabled:opacity-60"
              >
                {isCreatingMatch ? "Creating..." : "Create Match"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreateTeamOpen} onOpenChange={onCreateTeamOpenChange}>
          <DialogContent className="max-w-xl border-glass-border/40 bg-surface text-on-background">
            <DialogHeader>
              <DialogTitle>Add Opponent Team</DialogTitle>
              <DialogDescription>
                Add a team for the match dropdown. This currently saves as mock
                backend data.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Team Name
                </label>
                <Input
                  type="text"
                  value={teamDraft.name}
                  onChange={(event) =>
                    onTeamDraftChange("name", event.target.value)
                  }
                  placeholder="Southern Sharks"
                  className="mt-1 border-glass-border/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Logo URL
                </label>
                <Input
                  type="url"
                  value={teamDraft.logo}
                  onChange={(event) =>
                    onTeamDraftChange("logo", event.target.value)
                  }
                  placeholder="https://..."
                  className="mt-1 border-glass-border/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Google Maps Link
                </label>
                <Input
                  type="url"
                  value={teamDraft.venueMapUrl}
                  onChange={(event) =>
                    onTeamDraftChange("venueMapUrl", event.target.value)
                  }
                  placeholder="https://maps.google.com/..."
                  className="mt-1 border-glass-border/50"
                />
              </div>
            </div>

            {teamFormError ? (
              <p className="text-sm text-error">{teamFormError}</p>
            ) : null}

            <DialogFooter>
              <button
                type="button"
                onClick={() => onCreateTeamOpenChange(false)}
                className="rounded-md border border-glass-border/50 px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void onCreateTeam()}
                disabled={isCreatingTeam}
                className="rounded-md bg-primary-container px-4 py-2 text-sm font-bold text-on-primary-container disabled:opacity-60"
              >
                {isCreatingTeam ? "Adding..." : "Add Team"}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <section className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-glass-border/40 bg-glass-fill/10 px-6 py-16 text-center">
            <p className="font-display-title-xs text-display-title-xs text-on-background">
              Loading schedule...
            </p>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Fetching fixtures and results.
            </p>
          </section>
        ) : isError ? (
          <section className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-error/40 bg-error/10 px-6 py-16 text-center">
            <p className="font-display-title-xs text-display-title-xs text-on-background">
              Could not load schedule
            </p>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Please refresh and try again.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <ScheduleMatchList
              groupedMatches={groupedMatches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={onSelectMatch}
            />
            <ScheduleMatchDetails activeMatch={activeMatch} />
          </section>
        )}
      </main>
    </>
  );
}

function TeamSideCard({
  label,
  teamName,
  logo,
}: {
  label: string;
  teamName: string;
  logo?: string;
}) {
  return (
    <div className="rounded-lg border border-glass-border/50 bg-background/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-md border border-white/10 bg-surface-elevated overflow-hidden flex items-center justify-center">
          {logo ? (
            <img
              src={logo}
              alt={teamName}
              className="h-full w-full object-contain"
            />
          ) : (
            <MdSportsRugby className="text-primary" aria-hidden />
          )}
        </div>
        <p className="text-sm font-semibold text-on-background">{teamName}</p>
      </div>
    </div>
  );
}
