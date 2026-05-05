import { asc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { teams } from "@/db/schema";
import type { Team, TeamCreateRequest } from "@/lib/api/contracts/teams";

function toTeam(row: typeof teams.$inferSelect): Team {
  return {
    id: row.id,
    name: row.name,
    logo: row.logo,
    venueMapUrl: row.venueMapUrl,
  };
}

export async function listTeams(search?: string): Promise<Team[]> {
  const term = search?.trim();
  const rows = term
    ? await db
        .select()
        .from(teams)
        .where(ilike(teams.name, `%${term}%`))
        .orderBy(asc(teams.name))
    : await db.select().from(teams).orderBy(asc(teams.name));

  return rows.map(toTeam);
}

export async function getTeamById(id: string): Promise<Team | null> {
  const [row] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return row ? toTeam(row) : null;
}

export async function createTeam(input: TeamCreateRequest): Promise<Team> {
  const [created] = await db
    .insert(teams)
    .values({
      name: input.name.trim(),
      logo: input.logo.trim(),
      venueMapUrl: input.venueMapUrl.trim(),
    })
    .returning();

  return toTeam(created);
}
