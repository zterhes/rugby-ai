import type { Player } from "@/lib/api/contracts/players";
import type { LineupPlayer } from "@/components/scrum/line-up/lineup-types";

export function mapApiPlayerToLineupPlayer(player: Player): LineupPlayer {
  return {
    id: player.id,
    name: player.name,
    avatarUrl: player.avatarUrl,
    positionLabel: player.positionLabel,
  };
}

export function mapApiPlayersToLineup(players: Player[]): LineupPlayer[] {
  return players.map(mapApiPlayerToLineupPlayer);
}
