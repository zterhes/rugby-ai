import { SCHEDULE_MATCHES, type ScheduleMatch } from "@/lib/data/schedule";
import type { Team } from "@/lib/data/teams";

export const SCHEDULE_MATCHES_QUERY_KEY = ["schedule", "matches"] as const;

export type CreateScheduleMatchInput = {
  fixtureType: "home" | "away";
  opponentTeam: Team;
  dateIso: string;
  kickoffTime: string;
  roundLabel: string;
  meetTime: string;
  kitPrimary: string;
  kitSecondary: string;
  teamName: string;
};

function formatDateLabel(dateIso: string) {
  const date = new Date(`${dateIso}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(date);
}

function formatMonthLabel(dateIso: string) {
  const date = new Date(`${dateIso}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function getScheduleMatches(): Promise<ScheduleMatch[]> {
  // TODO: Replace this mock response with real backend API call when available.
  return Promise.resolve(SCHEDULE_MATCHES);
}

export async function createScheduleMatch(
  input: CreateScheduleMatchInput,
): Promise<ScheduleMatch> {
  // TODO: Replace this mock mutation with a real backend API call.
  const maxId = SCHEDULE_MATCHES.reduce((max, item) => Math.max(max, item.id), 0);
  const isHomeFixture = input.fixtureType === "home";

  const created: ScheduleMatch = {
    id: maxId + 1,
    opponent: input.opponentTeam.name,
    date: formatDateLabel(input.dateIso),
    monthLabel: formatMonthLabel(input.dateIso),
    venue: `${isHomeFixture ? "Home" : "Away"} • ${isHomeFixture ? "Home Ground" : input.opponentTeam.name}`,
    status: "Upcoming",
    logo: input.opponentTeam.logo,
    isActive: true,
    time: input.kickoffTime || "TBD",
    isHomeFixture,
    roundLabel: input.roundLabel || "Round",
    meetTime: input.meetTime || "TBD",
    meetLocation: isHomeFixture ? "Locker Room A" : "Team Bus",
    kitPrimary: input.kitPrimary || "Primary Red",
    kitSecondary: input.kitSecondary || "Black Shorts",
    venueName: isHomeFixture ? "Home Ground" : input.opponentTeam.name,
    venueAddress: input.opponentTeam.venueMapUrl,
    bannerImage: input.opponentTeam.logo.replace("w=100", "w=1200"),
  };

  SCHEDULE_MATCHES.forEach((match) => {
    if (match.isActive) {
      match.isActive = false;
    }
  });

  SCHEDULE_MATCHES.push(created);
  return Promise.resolve(created);
}
