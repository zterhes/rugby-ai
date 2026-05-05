import {
  playerCreateRequestSchema,
  playersListQuerySchema,
  playersListResponseSchema,
  playerCreateResponseSchema,
} from "@/lib/api/contracts/players";
import {
  badRequest,
  created,
  internalError,
  okList,
  parseJson,
  parseSearchParams,
} from "@/lib/api/http";
import {
  createPlayer as createPlayerRecord,
  listPlayers,
} from "@/lib/repositories/players.repository";

export async function GET(req: Request) {
  try {
    const parsedQuery = parseSearchParams(req, playersListQuerySchema);
    if (!parsedQuery.success) return parsedQuery.response;

    const payload = await listPlayers(parsedQuery.data);
    const checked = playersListResponseSchema.safeParse(payload);
    if (!checked.success) return badRequest("Failed to serialize players response", checked.error);

    return okList(checked.data.data, checked.data.meta);
  } catch (error) {
    console.error("[API] GET /api/v1/players failed", error);
    return internalError("Could not fetch players.");
  }
}

export async function POST(req: Request) {
  try {
    const parsedBody = await parseJson(req, playerCreateRequestSchema);
    if (!parsedBody.success) return parsedBody.response;

    const createdPlayer = await createPlayerRecord(parsedBody.data);
    const checked = playerCreateResponseSchema.safeParse({
      data: { ...createdPlayer, created: false as const },
    });
    if (!checked.success) return badRequest("Failed to serialize player create response", checked.error);

    return created(checked.data.data);
  } catch (error) {
    console.error("[API] POST /api/v1/players failed", error);
    return internalError("Could not create player.");
  }
}
