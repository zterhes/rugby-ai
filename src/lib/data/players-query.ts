import type { PlayerFormValues } from "@/lib/data/player-form-schema";
import {
  playerCreateResponseSchema,
  playerResponseSchema,
  playersListQuerySchema,
  playersListResponseSchema,
  playerUpdateResponseSchema,
  type Player,
} from "@/lib/api/contracts/players";
import { apiGet, apiSend } from "@/lib/api/client/http";

export const PLAYERS_QUERY_KEY = ["players"] as const;
export const playerQueryKey = (id: string) => [...PLAYERS_QUERY_KEY, id] as const;

export type GetPlayersInput = {
  search?: string;
  position?: Player["position"] | "";
  duesStatus?: Player["duesStatus"] | "";
  page?: number;
  pageSize?: number;
};

export async function getPlayers(input?: GetPlayersInput): Promise<Player[]> {
  const query = playersListQuerySchema.parse({
    page: input?.page ?? 1,
    pageSize: input?.pageSize ?? 50,
    search: input?.search || undefined,
    position: input?.position || undefined,
    duesStatus: input?.duesStatus || undefined,
  });

  const res = await apiGet("/api/v1/players", playersListResponseSchema, query);
  return res.data;
}

export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const res = await apiGet(`/api/v1/players/${id}`, playerResponseSchema);
    return res.data;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 404
    ) {
      return null;
    }
    throw error;
  }
}

export async function createPlayer(values: PlayerFormValues): Promise<Player> {
  const payload = {
    ...values,
    avatarUrl: values.avatarUrl?.trim() ? values.avatarUrl.trim() : undefined,
  };
  const res = await apiSend("POST", "/api/v1/players", payload, playerCreateResponseSchema);
  return res.data;
}

export async function updatePlayer(
  id: string,
  values: PlayerFormValues,
): Promise<Player | null> {
  try {
    const payload = {
      ...values,
      avatarUrl: values.avatarUrl?.trim() ? values.avatarUrl.trim() : undefined,
    };
    const res = await apiSend("PATCH", `/api/v1/players/${id}`, payload, playerUpdateResponseSchema);
    return res.data;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 404
    ) {
      return null;
    }
    throw error;
  }
}
