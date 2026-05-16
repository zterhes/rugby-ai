import { MdAdd, MdSearch, MdSearchOff } from "react-icons/md";
import { PlayerCard } from "@/components/scrum/player-card";
import type { DuesStatus, Player, PlayerPosition } from "@/lib/data/players";

const SELECT_CLASSES = [
  "py-2 pl-3 pr-8",
  "bg-glass-fill/40 border border-glass-border/50 rounded-lg",
  "text-sm text-on-background",
  "focus:border-primary-container/50 focus:bg-glass-fill/80 focus:ring-0 focus:outline-none",
  "transition-all backdrop-blur-sm appearance-none",
  "bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238f96a3%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat",
].join(" ");

type Option<T extends string> = {
  value: "" | T;
  label: string;
};

type RosterPageViewProps = {
  search: string;
  position: "" | PlayerPosition;
  status: "" | DuesStatus;
  filteredPlayers: Player[];
  positionOptions: Option<PlayerPosition>[];
  statusOptions: Option<DuesStatus>[];
  isLoading: boolean;
  isError: boolean;
  onSearchChange: (value: string) => void;
  onPositionChange: (value: "" | PlayerPosition) => void;
  onStatusChange: (value: "" | DuesStatus) => void;
  onViewProfile: (player: Player) => void;
  onEditProfile: (player: Player) => void;
  onAddPlayer: () => void;
};

export function RosterPageView({
  search,
  position,
  status,
  filteredPlayers,
  positionOptions,
  statusOptions,
  isLoading,
  isError,
  onSearchChange,
  onPositionChange,
  onStatusChange,
  onViewProfile,
  onEditProfile,
  onAddPlayer,
}: RosterPageViewProps) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-background to-background" />

      <main className="pb-12 px-4 md:px-page-padding max-w-[1440px] mx-auto min-h-screen flex flex-col gap-8">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack border-b border-glass-border/30 pb-6">
          <div>
            <h1 className="mb-1 font-display-title text-display-title text-on-background drop-shadow-sm">
              Active Roster
            </h1>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Manage player profiles, compliance, and contact details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <MdSearch
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary-container"
                aria-hidden
              />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search players..."
                className="w-full md:w-56 pl-9 pr-4 py-2 bg-glass-fill/40 border border-glass-border/50 rounded-lg text-sm text-on-background placeholder:text-muted-foreground focus:border-primary-container/50 focus:bg-glass-fill/80 focus:ring-0 focus:outline-none transition-all backdrop-blur-sm"
              />
            </div>

            <select
              value={position}
              onChange={(e) => onPositionChange(e.target.value as "" | PlayerPosition)}
              className={SELECT_CLASSES}
              aria-label="Filter by position"
            >
              {positionOptions.map((option) => (
                <option
                  key={option.value || "all-positions"}
                  className="bg-surface"
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value as "" | DuesStatus)}
              className={SELECT_CLASSES}
              aria-label="Filter by dues status"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value || "any-status"}
                  className="bg-surface"
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              aria-label="Add new player"
              onClick={onAddPlayer}
              className="group ml-auto md:ml-2 w-12 h-12 rounded-full bg-primary-container hover:bg-[#b91c1c] text-on-primary-container shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_25px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-offset-2 focus:ring-offset-background"
            >
              <MdAdd
                size={24}
                className="transition-transform duration-300 group-hover:rotate-90"
                aria-hidden
              />
            </button>
          </div>
        </section>

        {isLoading ? (
          <section className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-glass-border/40 bg-glass-fill/10 px-6 py-16 text-center">
            <p className="font-display-title-xs text-display-title-xs text-on-background">
              Loading players...
            </p>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Fetching roster data.
            </p>
          </section>
        ) : isError ? (
          <section className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-error/40 bg-error/10 px-6 py-16 text-center">
            <p className="font-display-title-xs text-display-title-xs text-on-background">
              Could not load roster
            </p>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Please refresh and try again.
            </p>
          </section>
        ) : filteredPlayers.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onView={onViewProfile}
                onEdit={onEditProfile}
              />
            ))}
          </section>
        ) : (
          <section className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-glass-border/40 bg-glass-fill/10 px-6 py-16 text-center">
            <MdSearchOff
              size={32}
              className="text-muted-foreground"
              aria-hidden
            />
            <p className="font-display-title-xs text-display-title-xs text-on-background">
              No players match your filters
            </p>
            <p className="font-subtitle text-subtitle text-muted-foreground">
              Try clearing the search or adjusting the dropdowns above.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
