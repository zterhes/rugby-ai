import { MdCalendarToday, MdLocationOn, MdSportsRugby } from "react-icons/md";
import type { DashboardNextMatch } from "@/components/scrum/dashboard/dashboard-types";

type NextMatchCardProps = {
  isLoading: boolean;
  nextMatch: DashboardNextMatch;
};

export function NextMatchCard({ isLoading, nextMatch }: NextMatchCardProps) {
  return (
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
            <MdCalendarToday className="text-base shrink-0" aria-hidden />
            {isLoading ? "Loading..." : nextMatch?.dateTimeLabel ?? "No upcoming match"}
          </span>
        </div>

        <div>
          <p className="font-subtitle text-secondary mb-2 flex items-center gap-1">
            <MdLocationOn className="text-base shrink-0" aria-hidden />
            {nextMatch?.venueLabel ?? "Venue TBD"}
          </p>
          <h2 className="font-display-title text-4xl md:text-5xl text-on-surface mb-6 leading-tight">
            {nextMatch?.opponent ?? "TBD"}
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
  );
}
