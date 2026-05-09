import { and, asc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { scheduleMatches, teams } from "@/db/schema";
import { dashboardUpcomingMatchResponseSchema } from "@/lib/api/contracts/dashboard";
import { badRequest, ok } from "@/lib/api/http";

export async function GET() {
  const now = new Date();

  const match = await db
    .select({
      kickoffAt: scheduleMatches.kickoffAt,
      fixtureType: scheduleMatches.fixtureType,
      venueName: scheduleMatches.venueName,
      opponentName: teams.name,
    })
    .from(scheduleMatches)
    .innerJoin(teams, eq(scheduleMatches.opponentTeamId, teams.id))
    .where(and(eq(scheduleMatches.status, "Upcoming"), gt(scheduleMatches.kickoffAt, now)))
    .orderBy(asc(scheduleMatches.kickoffAt), asc(scheduleMatches.id))
    .limit(1);

  const row = match[0];
  const data = row
    ? {
        opponent: row.opponentName,
        kickoffAtUtc: row.kickoffAt.toISOString(),
        venueLabel:
          row.fixtureType === "home"
            ? `Home • ${row.venueName ?? "Home Ground"}`
            : `Away • ${row.venueName ?? row.opponentName}`,
      }
    : null;

  const checked = dashboardUpcomingMatchResponseSchema.safeParse({ data });
  if (!checked.success)
    return badRequest("Failed to serialize upcoming matches", checked.error);
  return ok(checked.data.data);
}
