import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { players } from "@/db/schema";
import type {
  Player,
  PlayerCreateRequest,
  PlayersListQuery,
} from "@/lib/api/contracts/players";

const POSITION_LABELS: Record<Player["position"], string> = {
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

export function playerRowToContractPlayer(row: typeof players.$inferSelect): Player {
  return {
    id: row.id,
    name: row.name,
    position: row.position as Player["position"],
    positionLabel: POSITION_LABELS[row.position as Player["position"]],
    licenseId: row.licenseId,
    caps: row.caps,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatarUrl ?? undefined,
    duesStatus: row.duesStatus as Player["duesStatus"],
  };
}

export async function listPlayers(query: PlayersListQuery) {
  const filters = [];

  if (query.position) filters.push(eq(players.position, query.position));
  if (query.duesStatus) filters.push(eq(players.duesStatus, query.duesStatus));
  if (query.search?.trim()) {
    const term = `%${query.search.trim()}%`;
    filters.push(
      or(
        ilike(players.name, term),
        ilike(players.email, term),
        ilike(players.licenseId, term),
      ),
    );
  }

  const whereClause = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(players)
    .where(whereClause);

  const data = await db
    .select()
    .from(players)
    .where(whereClause)
    .orderBy(asc(players.createdAt))
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize);

  return {
    data: data.map(playerRowToContractPlayer),
    meta: {
      total: Number(totalRow?.value ?? 0),
      page: query.page,
      pageSize: query.pageSize,
    },
  };
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const [row] = await db.select().from(players).where(eq(players.id, id)).limit(1);
  return row ? playerRowToContractPlayer(row) : null;
}

export async function createPlayer(input: PlayerCreateRequest): Promise<Player> {
  const [created] = await db
    .insert(players)
    .values({
      name: input.name.trim(),
      position: input.position,
      licenseId: input.licenseId.trim(),
      caps: input.caps,
      email: input.email.trim(),
      phone: input.phone.trim(),
      avatarUrl: input.avatarUrl?.trim() || null,
      duesStatus: input.duesStatus,
    })
    .returning();

  return playerRowToContractPlayer(created);
}

export async function updatePlayer(
  id: string,
  input: PlayerCreateRequest,
): Promise<Player | null> {
  const [updated] = await db
    .update(players)
    .set({
      name: input.name.trim(),
      position: input.position,
      licenseId: input.licenseId.trim(),
      caps: input.caps,
      email: input.email.trim(),
      phone: input.phone.trim(),
      avatarUrl: input.avatarUrl?.trim() || null,
      duesStatus: input.duesStatus,
      updatedAt: new Date(),
    })
    .where(eq(players.id, id))
    .returning();

  return updated ? playerRowToContractPlayer(updated) : null;
}

export async function setPlayerAvatar(id: string, avatarUrl: string): Promise<Player | null> {
  const [updated] = await db
    .update(players)
    .set({
      avatarUrl,
      updatedAt: new Date(),
    })
    .where(eq(players.id, id))
    .returning();

  return updated ? playerRowToContractPlayer(updated) : null;
}
