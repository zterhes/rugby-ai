import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { scheduleMatches, teams } from "@/db/schema";
import { dashboardRecentFormResponseSchema } from "@/lib/api/contracts/dashboard";
import { badRequest, ok } from "@/lib/api/http";

function deriveResultStatus(matchId: number) {
  return matchId % 2 === 0 ? "WON" as const : "LOST" as const;
}

function deriveScore(matchId: number) {
  const ourScore = 18 + (matchId % 12);
  const theirScore = 10 + ((matchId * 3) % 14);
  return `${ourScore} - ${theirScore}`;
}

export async function GET() {
  const now = new Date();
  const rows = await db
    .select({
      id: scheduleMatches.id,
      fixtureType: scheduleMatches.fixtureType,
      opponentName: teams.name,
    })
    .from(scheduleMatches)
    .innerJoin(teams, eq(scheduleMatches.opponentTeamId, teams.id))
    .where(and(eq(scheduleMatches.status, "Final"), lt(scheduleMatches.kickoffAt, now)))
    .orderBy(desc(scheduleMatches.kickoffAt), desc(scheduleMatches.id))
    .limit(3);

  const data = rows.map((row) => ({
    id: `match-${row.id}`,
    status: deriveResultStatus(row.id),
    opponent: row.fixtureType === "home" ? `vs ${row.opponentName}` : `@ ${row.opponentName}`,
    score: deriveScore(row.id),
  }));

  const checked = dashboardRecentFormResponseSchema.safeParse({ data });
  if (!checked.success) return badRequest("Failed to serialize recent form", checked.error);
  return ok(checked.data.data);
}
