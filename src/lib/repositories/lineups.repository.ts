import { count, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { matchLineupSlots, players } from "@/db/schema";
import type { LineupCreateRequest } from "@/lib/api/contracts/lineups";
import type { Player } from "@/lib/api/contracts/players";
import { playerRowToContractPlayer } from "@/lib/repositories/players.repository";

export type ReplaceLineupResult =
  | { ok: true; slotCount: number }
  | { ok: false; error: "MISSING_PLAYERS"; missingPlayerIds: string[] };

export async function replaceLineupForMatch(
  scheduleMatchId: number,
  slots: LineupCreateRequest["slots"],
): Promise<ReplaceLineupResult> {
  const playerIds = [...new Set(slots.map((s) => s.playerId))];

  if (playerIds.length > 0) {
    const foundRows = await db
      .select({ id: players.id })
      .from(players)
      .where(inArray(players.id, playerIds));

    const found = new Set(foundRows.map((r) => r.id));
    const missingPlayerIds = playerIds.filter((id) => !found.has(id));
    if (missingPlayerIds.length > 0) {
      return { ok: false, error: "MISSING_PLAYERS", missingPlayerIds };
    }
  }

  const now = new Date();

  await db
    .delete(matchLineupSlots)
    .where(eq(matchLineupSlots.scheduleMatchId, scheduleMatchId));

  if (slots.length > 0) {
    await db.insert(matchLineupSlots).values(
      slots.map((s) => ({
        scheduleMatchId,
        pitchPosition: s.positionId,
        playerId: s.playerId,
        createdAt: now,
        updatedAt: now,
      })),
    );
  }

  return { ok: true, slotCount: slots.length };
}

export type LineupSlotWithPlayer = {
  positionId: number;
  player: Player;
};

export const LINEUP_COMPLETE_MIN_SLOTS = 15;

export async function getLineupSlotCountsByScheduleMatchIds(
  scheduleMatchIds: number[],
): Promise<Map<number, number>> {
  if (scheduleMatchIds.length === 0) {
    return new Map();
  }

  const rows = await db
    .select({
      scheduleMatchId: matchLineupSlots.scheduleMatchId,
      slotCount: count(),
    })
    .from(matchLineupSlots)
    .where(inArray(matchLineupSlots.scheduleMatchId, scheduleMatchIds))
    .groupBy(matchLineupSlots.scheduleMatchId);

  return new Map(rows.map((r) => [r.scheduleMatchId, Number(r.slotCount)]));
}

export async function listLineupSlotsForSchedule(
  scheduleMatchId: number,
): Promise<LineupSlotWithPlayer[]> {
  const rows = await db
    .select({
      pitchPosition: matchLineupSlots.pitchPosition,
      playerRow: players,
    })
    .from(matchLineupSlots)
    .innerJoin(players, eq(matchLineupSlots.playerId, players.id))
    .where(eq(matchLineupSlots.scheduleMatchId, scheduleMatchId));

  return rows.map((r) => ({
    positionId: r.pitchPosition,
    player: playerRowToContractPlayer(r.playerRow),
  }));
}
