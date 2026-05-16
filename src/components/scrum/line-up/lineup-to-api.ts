import type { LineupPlayer } from "@/components/scrum/line-up/lineup-types";
import type { LineupSlotInput } from "@/lib/api/contracts/lineups";

export function lineupRecordToSlots(
  lineup: Record<number, LineupPlayer>,
): LineupSlotInput[] {
  return Object.entries(lineup).map(([positionKey, player]) => ({
    positionId: Number(positionKey),
    playerId: player.id,
  }));
}
