import { teamCreateRequestSchema, teamCreateResponseSchema, teamsListQuerySchema, teamsListResponseSchema } from "@/lib/api/contracts/teams";
import { badRequest, created, internalError, ok, parseJson, parseSearchParams } from "@/lib/api/http";
import { createTeam as createTeamRecord, listTeams } from "@/lib/repositories/teams.repository";

export async function GET(req: Request) {
  try {
    const parsedQuery = parseSearchParams(req, teamsListQuerySchema);
    if (!parsedQuery.success) return parsedQuery.response;

    const data = await listTeams(parsedQuery.data.search);
    const checked = teamsListResponseSchema.safeParse({ data });
    if (!checked.success) return badRequest("Failed to serialize teams response", checked.error);

    return ok(checked.data.data);
  } catch (error) {
    console.error("[API] GET /api/v1/teams failed", error);
    return internalError("Could not fetch teams.");
  }
}

export async function POST(req: Request) {
  try {
    const parsedBody = await parseJson(req, teamCreateRequestSchema);
    if (!parsedBody.success) return parsedBody.response;

    const createdTeam = await createTeamRecord(parsedBody.data);
    const checked = teamCreateResponseSchema.safeParse({
      data: { ...createdTeam, created: false as const },
    });

    if (!checked.success) return badRequest("Failed to serialize team create response", checked.error);
    return created(checked.data.data);
  } catch (error) {
    console.error("[API] POST /api/v1/teams failed", error);
    return internalError("Could not create team.");
  }
}
