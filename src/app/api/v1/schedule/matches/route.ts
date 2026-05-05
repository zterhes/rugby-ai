import {
  scheduleCreateRequestSchema,
  scheduleCreateResponseSchema,
  scheduleListQuerySchema,
  scheduleListResponseSchema,
} from "@/lib/api/contracts/schedule";
import { badRequest, created, internalError, okList, parseJson, parseSearchParams } from "@/lib/api/http";
import {
  createScheduleMatch as createScheduleMatchRecord,
  listScheduleMatches,
} from "@/lib/repositories/schedule.repository";

export async function GET(req: Request) {
  try {
    const parsedQuery = parseSearchParams(req, scheduleListQuerySchema);
    if (!parsedQuery.success) return parsedQuery.response;

    const payload = await listScheduleMatches(parsedQuery.data);
    const checked = scheduleListResponseSchema.safeParse(payload);
    if (!checked.success) return badRequest("Failed to serialize schedule response", checked.error);

    return okList(checked.data.data, checked.data.meta);
  } catch (error) {
    console.error("[API] GET /api/v1/schedule/matches failed", error);
    return internalError("Could not fetch schedule.");
  }
}

export async function POST(req: Request) {
  try {
    const parsedBody = await parseJson(req, scheduleCreateRequestSchema);
    if (!parsedBody.success) return parsedBody.response;

    const createdMatch = await createScheduleMatchRecord(parsedBody.data);
    if (!createdMatch) {
      return badRequest(`Invalid opponentTeamId: ${parsedBody.data.opponentTeamId}`);
    }

    const checked = scheduleCreateResponseSchema.safeParse({
      data: { ...createdMatch, created: false as const },
    });
    if (!checked.success) return badRequest("Failed to serialize schedule create response", checked.error);

    return created(checked.data.data);
  } catch (error) {
    console.error("[API] POST /api/v1/schedule/matches failed", error);
    return internalError("Could not create match.");
  }
}
