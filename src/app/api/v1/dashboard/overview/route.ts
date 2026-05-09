import { dashboardOverviewResponseSchema } from "@/lib/api/contracts/dashboard";
import { PLAYERS } from "@/lib/data/players-dashboard-mock";
import { badRequest, ok } from "@/lib/api/http";

export async function GET() {
  const totalPlayers = PLAYERS.length;
  const duesCollected = PLAYERS.filter((player) => player.duesStatus === "paid").length;
  const duesUncollected = Math.max(totalPlayers - duesCollected, 0);
  const compliancePercent = totalPlayers > 0 ? Math.round((duesCollected / totalPlayers) * 100) : 0;

  const payload = {
    data: {
      nextMatch: null,
      squadHealth: {
        totalRoster: totalPlayers,
        duesCollected,
        duesUncollected,
        compliancePercent,
      },
      recentResults: [],
      quickActions: [
        { id: "add-player", label: "Add New Player", href: "/roster/new?new=true" },
        { id: "schedule-match", label: "Schedule Match", href: "/schedule" },
      ],
    },
  };

  const checked = dashboardOverviewResponseSchema.safeParse(payload);
  if (!checked.success) return badRequest("Failed to serialize dashboard overview", checked.error);

  return ok(checked.data.data);
}
