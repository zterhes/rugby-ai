import { rosterSummaryResponseSchema } from "@/lib/api/contracts/roster";
import { PLAYERS } from "@/lib/data/players";
import { badRequest, ok } from "@/lib/api/http";

export async function GET() {
  const totalPlayers = PLAYERS.length;
  const duesPaidCount = PLAYERS.filter((player) => player.duesStatus === "paid").length;
  const duesPendingCount = PLAYERS.filter((player) => player.duesStatus === "pending").length;
  const compliancePercent = totalPlayers > 0 ? Math.round((duesPaidCount / totalPlayers) * 100) : 0;

  const payload = {
    data: {
      totalPlayers,
      duesPaidCount,
      duesPendingCount,
      compliancePercent,
    },
  };

  const checked = rosterSummaryResponseSchema.safeParse(payload);
  if (!checked.success) return badRequest("Failed to serialize roster summary", checked.error);

  return ok(checked.data.data);
}
