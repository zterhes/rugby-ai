import { mapApiPlayerToLineupPlayer } from "@/components/scrum/line-up/map-api-player-to-lineup";
import {
  lineupBootstrapDataSchema,
  lineupCreateRequestSchema,
  lineupCreateResponseSchema,
  lineupListQuerySchema,
} from "@/lib/api/contracts/lineups";
import {
  badRequest,
  created,
  internalError,
  notFound,
  ok,
  parseJson,
  parseSearchParams,
} from "@/lib/api/http";
import {
  listLineupSlotsForSchedule,
  replaceLineupForMatch,
} from "@/lib/repositories/lineups.repository";
import {
  getScheduleMatchById,
  matchExistsById,
} from "@/lib/repositories/schedule.repository";

export async function GET(req: Request) {
  try {
    const parsedQuery = parseSearchParams(req, lineupListQuerySchema);
    if (!parsedQuery.success) return parsedQuery.response;

    const { scheduleId } = parsedQuery.data;
    const schedule = await getScheduleMatchById(scheduleId);
    if (!schedule) {
      return notFound("Match not found");
    }

    const lineupRows = await listLineupSlotsForSchedule(scheduleId);
    const slots = lineupRows.map(({ positionId, player }) => ({
      positionId,
      player: mapApiPlayerToLineupPlayer(player),
    }));

    const payload = {
      scheduleId,
      opponentTeamName: schedule.opponent,
      schedule,
      slots,
    };

    const checked = lineupBootstrapDataSchema.safeParse(payload);
    if (!checked.success) {
      return badRequest("Failed to serialize lineup bootstrap", checked.error);
    }

    return ok(checked.data);
  } catch (error) {
    console.error("[API] GET /api/v1/lineups failed", error);
    return internalError("Could not load lineup.");
  }
}

export async function POST(req: Request) {
  try {
    const parsedBody = await parseJson(req, lineupCreateRequestSchema);
    if (!parsedBody.success) return parsedBody.response;

    const { matchId, slots } = parsedBody.data;

    const matchExists = await matchExistsById(matchId);
    if (!matchExists) {
      return notFound("Match not found");
    }

    const result = await replaceLineupForMatch(matchId, slots);
    if (!result.ok) {
      return badRequest(
        `Unknown player id(s): ${result.missingPlayerIds.join(", ")}`,
      );
    }

    const payload = { data: { matchId, slotCount: result.slotCount } };
    const checked = lineupCreateResponseSchema.safeParse(payload);
    if (!checked.success) {
      return badRequest(
        "Failed to serialize lineup create response",
        checked.error,
      );
    }

    return created(checked.data.data);
  } catch (error) {
    console.error("[API] POST /api/v1/lineups failed", error);
    return internalError("Could not save lineup.");
  }
}
