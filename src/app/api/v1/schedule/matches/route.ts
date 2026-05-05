import { SCHEDULE_MATCHES } from "@/lib/data/schedule";
import { TEAMS } from "@/lib/data/teams";
import {
  scheduleCreateRequestSchema,
  scheduleCreateResponseSchema,
  scheduleListQuerySchema,
  scheduleListResponseSchema,
} from "@/lib/api/contracts/schedule";
import { badRequest, created, okList, parseJson, parseSearchParams } from "@/lib/api/http";

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

export async function GET(req: Request) {
  const parsedQuery = parseSearchParams(req, scheduleListQuerySchema);
  if (!parsedQuery.success) return parsedQuery.response;

  const { status, page, pageSize } = parsedQuery.data;
  const filtered = status
    ? SCHEDULE_MATCHES.filter((match) => match.status === status)
    : SCHEDULE_MATCHES;

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  const payload = {
    data: paginated,
    meta: { total: filtered.length, page, pageSize },
  };

  const checked = scheduleListResponseSchema.safeParse(payload);
  if (!checked.success) return badRequest("Failed to serialize schedule response", checked.error);

  return okList(checked.data.data, checked.data.meta);
}

export async function POST(req: Request) {
  const parsedBody = await parseJson(req, scheduleCreateRequestSchema);
  if (!parsedBody.success) return parsedBody.response;

  const body = parsedBody.data;

  const opponent = TEAMS.find((team) => team.id === body.opponentTeamId);
  if (!opponent) {
    return badRequest(`Invalid opponentTeamId: ${body.opponentTeamId}`);
  }

  console.log("[API STUB] POST /api/v1/schedule/matches", body);

  const isHomeFixture = body.fixtureType === "home";
  const mockId = SCHEDULE_MATCHES.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  const payload = {
    id: mockId,
    opponent: opponent.name,
    date: formatDateLabel(body.dateIso),
    monthLabel: formatMonthLabel(body.dateIso),
    venue: `${isHomeFixture ? "Home" : "Away"} • ${isHomeFixture ? "Home Ground" : opponent.name}`,
    status: "Upcoming" as const,
    logo: opponent.logo,
    isActive: true,
    time: body.kickoffTime || "TBD",
    isHomeFixture,
    roundLabel: body.roundLabel || "Round",
    meetTime: body.meetTime || "TBD",
    meetLocation: isHomeFixture ? "Locker Room A" : "Team Bus",
    kitPrimary: body.kitPrimary || "Primary Red",
    kitSecondary: body.kitSecondary || "Black Shorts",
    venueName: body.venueName || (isHomeFixture ? "Home Ground" : opponent.name),
    venueAddress: body.venueAddress || opponent.venueMapUrl,
    bannerImage: opponent.logo.replace("w=100", "w=1200"),
    created: false as const,
  };

  const checked = scheduleCreateResponseSchema.safeParse({ data: payload });
  if (!checked.success) return badRequest("Failed to serialize schedule create response", checked.error);

  return created(checked.data.data);
}
