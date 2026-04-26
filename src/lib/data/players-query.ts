import { nanoid } from "nanoid";
import {
  PLAYERS,
  type Player,
  type PlayerPosition,
} from "@/lib/data/players";
import type { PlayerFormValues } from "@/lib/data/player-form-schema";

export const PLAYERS_QUERY_KEY = ["players"] as const;
export const playerQueryKey = (id: string) => [...PLAYERS_QUERY_KEY, id] as const;

const POSITION_LABELS: Record<PlayerPosition, string> = {
  prop: "Prop",
  hooker: "Hooker",
  lock: "Lock",
  flanker: "Flanker",
  number8: "Number 8",
  scrumhalf: "Scrum-half",
  flyhalf: "Fly-half",
  centre: "Centre",
  wing: "Wing",
  fullback: "Fullback",
};

function toPlayerRecord(
  id: string,
  values: PlayerFormValues,
): Player {
  return {
    id,
    name: values.name,
    position: values.position,
    positionLabel: POSITION_LABELS[values.position],
    licenseId: values.licenseId,
    caps: values.caps,
    email: values.email,
    phone: values.phone,
    avatarUrl: values.avatarUrl || undefined,
    duesStatus: values.duesStatus,
  };
}

export async function getPlayers(): Promise<Player[]> {
  return Promise.resolve(PLAYERS);
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const player = PLAYERS.find((item) => item.id === id) ?? null;
  return Promise.resolve(player);
}

export async function createPlayer(values: PlayerFormValues): Promise<Player> {
  const id = `p-${nanoid(6)}`;
  const player = toPlayerRecord(id, values);
  PLAYERS.push(player);
  return Promise.resolve(player);
}

export async function updatePlayer(
  id: string,
  values: PlayerFormValues,
): Promise<Player | null> {
  const index = PLAYERS.findIndex((item) => item.id === id);
  if (index < 0) {
    return Promise.resolve(null);
  }

  const updated = toPlayerRecord(id, values);
  PLAYERS[index] = updated;

  return Promise.resolve(updated);
}
