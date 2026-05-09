import { and, asc, count, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { scheduleMatches } from "@/db/schema";
import type { ScheduleCreateRequest } from "@/lib/api/contracts/schedule";
import type { ListQuery } from "@/lib/api/contracts/common";
import type { MatchStatus, ScheduleMatch } from "@/lib/data/schedule";
import {
  getLineupSlotCountsByScheduleMatchIds,
  LINEUP_COMPLETE_MIN_SLOTS,
} from "@/lib/repositories/lineups.repository";
import { getTeamById } from "@/lib/repositories/teams.repository";

type ListScheduleInput = ListQuery & {
  status?: MatchStatus;
};

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(date);
}

function toUtcDateTime(dateIso: string, kickoffTime: string) {
  return new Date(`${dateIso}T${kickoffTime}:00.000Z`);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function toScheduleMatch(
  row: typeof scheduleMatches.$inferSelect,
  team: { name: string; logo: string; venueMapUrl: string },
  isLineUpCreated: boolean,
): ScheduleMatch {
  const isHomeFixture = row.fixtureType === "home";
  const time = row.kickoffTime?.trim() ? row.kickoffTime : undefined;

  return {
    id: row.id,
    kickoffAtUtc: row.kickoffAt.toISOString(),
    opponent: team.name,
    date: formatDateLabel(row.kickoffAt),
    monthLabel: formatMonthLabel(row.kickoffAt),
    venue: `${isHomeFixture ? "Home" : "Away"} • ${isHomeFixture ? (row.venueName ?? "Home Ground") : team.name}`,
    status: row.status as MatchStatus,
    logo: team.logo,
    isActive: row.isActive,
    time: row.status === "Upcoming" ? (time ?? "TBD") : undefined,
    result: row.status === "Final" ? (time ?? "Final") : undefined,
    isHomeFixture,
    roundLabel: row.roundLabel ?? "Round",
    meetTime: row.meetTime ?? "TBD",
    meetLocation: row.meetLocation ?? undefined,
    kitPrimary: row.kitPrimary ?? "Primary Red",
    kitSecondary: row.kitSecondary ?? "Black Shorts",
    venueName: row.venueName ?? (isHomeFixture ? "Home Ground" : team.name),
    venueAddress: row.venueAddress ?? team.venueMapUrl,
    bannerImage: team.logo.replace("w=100", "w=1200"),
    isLineUpCreated,
  };
}

export async function listScheduleMatches(input: ListScheduleInput) {
  const whereClause = input.status
    ? and(eq(scheduleMatches.status, input.status))
    : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(scheduleMatches)
    .where(whereClause);

  const rows = await db
    .select()
    .from(scheduleMatches)
    .where(whereClause)
    .orderBy(desc(scheduleMatches.kickoffAt), asc(scheduleMatches.id))
    .limit(input.pageSize)
    .offset((input.page - 1) * input.pageSize);

  const teamIds = Array.from(new Set(rows.map((row) => row.opponentTeamId)));
  const teamEntries = await Promise.all(
    teamIds.map(async (id) => [id, await getTeamById(id)] as const),
  );
  const teamsMap = new Map(
    teamEntries.filter((entry) => entry[1]).map(([id, team]) => [id, team]),
  );

  const baseData = rows
    .map((row) => {
      const team = teamsMap.get(row.opponentTeamId);
      if (!team) return null;
      return toScheduleMatch(row, team, false);
    })
    .filter((item): item is ScheduleMatch => item !== null);

  const slotCounts = await getLineupSlotCountsByScheduleMatchIds(baseData.map((m) => m.id));
  const data = baseData.map((match) => ({
    ...match,
    isLineUpCreated: (slotCounts.get(match.id) ?? 0) >= LINEUP_COMPLETE_MIN_SLOTS,
  }));

  return {
    data,
    meta: {
      total: Number(totalRow?.value ?? 0),
      page: input.page,
      pageSize: input.pageSize,
    },
  };
}

export async function createScheduleMatch(input: ScheduleCreateRequest) {
  const team = await getTeamById(input.opponentTeamId);
  if (!team) return null;

  const kickoffAtUtc = toUtcDateTime(input.dateIso, input.kickoffTime);

  const [created] = await db
    .insert(scheduleMatches)
    .values({
      opponentTeamId: input.opponentTeamId,
      fixtureType: input.fixtureType,
      kickoffAt: kickoffAtUtc,
      dateIso: input.dateIso,
      kickoffTime: input.kickoffTime.trim(),
      roundLabel: input.roundLabel?.trim() || null,
      meetTime: input.meetTime?.trim() || null,
      meetLocation: input.meetLocation.trim(),
      kitPrimary: input.kitPrimary?.trim() || null,
      kitSecondary: input.kitSecondary?.trim() || null,
      venueName: input.venueName?.trim() || null,
      venueAddress: input.venueAddress?.trim() || null,
      status: "Upcoming",
      isActive: true,
    })
    .returning();

  await db
    .update(scheduleMatches)
    .set({ isActive: false, updatedAt: new Date() })
    .where(ne(scheduleMatches.id, created.id));

  return toScheduleMatch(created, team, false);
}

export async function matchExistsById(matchId: number): Promise<boolean> {
  const [row] = await db
    .select({ id: scheduleMatches.id })
    .from(scheduleMatches)
    .where(eq(scheduleMatches.id, matchId))
    .limit(1);

  return row !== undefined;
}

export async function getScheduleMatchById(id: number): Promise<ScheduleMatch | null> {
  const [row] = await db.select().from(scheduleMatches).where(eq(scheduleMatches.id, id)).limit(1);
  if (!row) return null;

  const team = await getTeamById(row.opponentTeamId);
  if (!team) return null;

  const slotCounts = await getLineupSlotCountsByScheduleMatchIds([id]);
  const isLineUpCreated = (slotCounts.get(id) ?? 0) >= LINEUP_COMPLETE_MIN_SLOTS;

  return toScheduleMatch(row, team, isLineUpCreated);
}
