import Link from "next/link";
import {
  MdBolt,
  MdCalendarToday,
  MdCampaign,
  MdChevronRight,
  MdEditCalendar,
  MdHealthAndSafety,
  MdHistory,
  MdLocalHospital,
  MdLocationOn,
  MdPersonAdd,
  MdSportsRugby,
} from "react-icons/md";

const RECENT_RESULTS = [
  {
    id: "match-1",
    status: "WON",
    statusClass: "text-emerald-400",
    sideBarClass: "bg-emerald-500",
    opponent: "vs Northern Tigers",
    score: "24 - 12",
  },
  {
    id: "match-2",
    status: "WON",
    statusClass: "text-emerald-400",
    sideBarClass: "bg-emerald-500",
    opponent: "@ Eastern Blues",
    score: "18 - 15",
  },
  {
    id: "match-3",
    status: "LOST",
    statusClass: "text-error",
    sideBarClass: "bg-red-500",
    opponent: "vs Southside Chiefs",
    score: "7 - 21",
  },
];

export default function DashboardPage() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-background to-background" />

      <main className="px-6 pb-12 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col gap-8">
          <section className="flex justify-between items-end">
            <div>
              <h1 className="font-display-title text-on-surface">Overview</h1>
              <p className="font-subtitle text-muted-foreground mt-1">
                Current season status and upcoming priorities.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="lg:col-span-2 relative overflow-hidden rounded-xl border border-glass-border/30 shadow-2xl backdrop-blur-xl bg-glass-fill/40 flex flex-col group">
              <div className="absolute inset-0 z-0">
                <div
                  aria-hidden
                  className="w-full h-full opacity-20 mix-blend-luminosity bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDuTIqNFoPFa5cBHXmykzh-otjJeBQzwYGlcVlnsdW63oWrCZMW_Dv1BsPRas-lrSAVTcor2z0g5icVFpeeW-6rjAsN6tldhnHga6z4jEWlJXJxIyeoSwl2B1lTYAoODHrml9Ka6YijtLHnEP-0Yw-9i1n-EYsmYcRXfARSjJtx7TP9_j06R7l92FQoCwS-umMeO5iIeqvHHv5Ufmm4l5HHdtYOKX7N-fUy_aLZUC9IUw_rlO3RWhMte5XoIzx0SAQcyTX1yVL4lteq)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>

              <div className="relative z-10 p-6 md:p-8 flex-1 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-12 gap-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-label bg-red-600/20 text-primary border border-red-600/30 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                    Next Match
                  </span>
                  <span className="font-body-ui text-muted-foreground flex items-center gap-1">
                    <MdCalendarToday
                      className="text-base shrink-0"
                      aria-hidden
                    />
                    Sat, Oct 28 - 14:00
                  </span>
                </div>

                <div>
                  <p className="font-subtitle text-secondary mb-2 flex items-center gap-1">
                    <MdLocationOn className="text-base shrink-0" aria-hidden />
                    Away @ Memorial Stadium
                  </p>
                  <h2 className="font-display-title text-4xl md:text-5xl text-on-surface mb-6 leading-tight">
                    West Coast Raiders
                  </h2>
                  <button
                    type="button"
                    className="bg-primary-container text-on-primary-container hover:bg-primary-container/80 transition-all duration-300 active:scale-95 py-3 px-6 rounded-full font-label flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                  >
                    <MdSportsRugby className="text-lg shrink-0" aria-hidden />
                    Build Lineup
                  </button>
                </div>
              </div>
            </article>

            <aside className="rounded-xl border border-glass-border/30 shadow-xl backdrop-blur-xl bg-glass-fill/60 p-6 flex flex-col gap-6">
              <h3 className="font-display-title-xs text-on-surface flex items-center gap-2">
                <MdHealthAndSafety
                  className="text-primary text-xl shrink-0"
                  aria-hidden
                />
                Squad Health
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between font-body-ui text-secondary mb-2">
                    <span>Total Roster</span>
                    <span className="text-on-surface font-bold">
                      28 Players
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed-dim rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-body-ui text-secondary mb-2">
                    <span>Dues Collected</span>
                    <span className="text-on-surface font-bold">22 / 28</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-primary-container rounded-full w-[78%] shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  </div>
                  <p className="font-subtitle-xs text-muted-foreground mt-1 text-right">
                    78% Compliant
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-900/40 flex items-center justify-center text-error">
                      <MdLocalHospital
                        className="text-xl shrink-0"
                        aria-hidden
                      />
                    </div>
                    <div>
                      <div className="font-body-ui text-on-surface">
                        Active Injuries
                      </div>
                      <div className="font-subtitle-xs text-muted-foreground">
                        Requires medical clearance
                      </div>
                    </div>
                  </div>
                  <span className="font-display-title-sm text-error">3</span>
                </div>
              </div>
            </aside>

            <section className="lg:col-span-2 rounded-xl border border-glass-border/30 shadow-xl backdrop-blur-xl bg-glass-fill/40 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display-title-xs text-on-surface flex items-center gap-2">
                  <MdHistory
                    className="text-secondary text-xl shrink-0"
                    aria-hidden
                  />
                  Recent Form
                </h3>
                <Link
                  href="/roster"
                  className="font-label text-primary hover:text-primary-fixed transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {RECENT_RESULTS.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-surface-elevated/50 border border-white/5 hover:bg-surface-elevated transition-colors group cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`w-1.5 h-10 rounded-full ${result.sideBarClass}`}
                      />
                      <span>
                        <span
                          className={`block font-label mb-0.5 ${result.statusClass}`}
                        >
                          {result.status}
                        </span>
                        <span className="block font-body-ui text-on-surface">
                          {result.opponent}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-6">
                      <span className="font-display-title-sm text-on-surface">
                        {result.score}
                      </span>
                      <MdChevronRight
                        className="text-muted-foreground group-hover:text-on-surface transition-colors text-xl shrink-0"
                        aria-hidden
                      />
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-glass-border/30 shadow-xl backdrop-blur-xl bg-glass-fill/40 p-6">
              <h3 className="font-display-title-xs text-on-surface flex items-center gap-2 mb-6">
                <MdBolt
                  className="text-secondary text-xl shrink-0"
                  aria-hidden
                />
                Quick Actions
              </h3>

              <div className="flex flex-col gap-3">
                <Link
                  href="/roster/new?new=true"
                  className="w-full flex items-center gap-3 p-4 rounded-lg bg-surface-elevated/40 border border-white/5 hover:bg-white/5 transition-colors text-left group"
                >
                  <span className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                    <MdPersonAdd className="text-lg shrink-0" aria-hidden />
                  </span>
                  <span className="font-body-ui text-secondary group-hover:text-on-surface transition-colors">
                    Add New Player
                  </span>
                </Link>

                {/* TODO: replace with /schedule once schedule page exists */}
                <Link
                  href="#"
                  className="w-full flex items-center gap-3 p-4 rounded-lg bg-surface-elevated/40 border border-white/5 hover:bg-white/5 transition-colors text-left group"
                >
                  <span className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                    <MdEditCalendar className="text-lg shrink-0" aria-hidden />
                  </span>
                  <span className="font-body-ui text-secondary group-hover:text-on-surface transition-colors">
                    Schedule Match
                  </span>
                </Link>

                {/* TODO: replace with /assetLibrary once asset library page exists */}
                <Link
                  href="#"
                  className="w-full flex items-center gap-3 p-4 rounded-lg bg-surface-elevated/40 border border-white/5 hover:bg-white/5 transition-colors text-left group"
                >
                  <span className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center text-secondary group-hover:text-primary transition-colors">
                    <MdCampaign className="text-lg shrink-0" aria-hidden />
                  </span>
                  <span className="font-body-ui text-secondary group-hover:text-on-surface transition-colors">
                    Generate Social Post
                  </span>
                </Link>
              </div>
            </section>
          </section>
        </div>
      </main>
    </>
  );
}
