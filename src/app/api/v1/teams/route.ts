import { nanoid } from "nanoid";
import { teamCreateRequestSchema, teamCreateResponseSchema, teamsListQuerySchema, teamsListResponseSchema } from "@/lib/api/contracts/teams";
import { TEAMS } from "@/lib/data/teams";
import { badRequest, created, ok, parseJson, parseSearchParams } from "@/lib/api/http";

export async function GET(req: Request) {
  const parsedQuery = parseSearchParams(req, teamsListQuerySchema);
  if (!parsedQuery.success) return parsedQuery.response;

  const search = parsedQuery.data.search?.trim().toLowerCase();
  const data = search
    ? TEAMS.filter((team) => team.name.toLowerCase().includes(search))
    : TEAMS;

  const checked = teamsListResponseSchema.safeParse({ data });
  if (!checked.success) return badRequest("Failed to serialize teams response", checked.error);

  return ok(checked.data.data);
}

export async function POST(req: Request) {
  const parsedBody = await parseJson(req, teamCreateRequestSchema);
  if (!parsedBody.success) return parsedBody.response;

  const body = parsedBody.data;
  console.log("[API STUB] POST /api/v1/teams", body);

  const checked = teamCreateResponseSchema.safeParse({
    data: {
      id: `t-${nanoid(6)}`,
      name: body.name.trim(),
      logo: body.logo.trim(),
      venueMapUrl: body.venueMapUrl.trim(),
      created: false as const,
    },
  });

  if (!checked.success) return badRequest("Failed to serialize team create response", checked.error);

  return created(checked.data.data);
}
