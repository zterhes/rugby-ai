import { playerResponseSchema, playerUpdateRequestSchema, playerUpdateResponseSchema } from "@/lib/api/contracts/players";
import { badRequest, internalError, notFound, ok, parseJson } from "@/lib/api/http";
import { getPlayerById, updatePlayer as updatePlayerRecord } from "@/lib/repositories/players.repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const player = await getPlayerById(id);
    if (!player) {
      return notFound(`Player not found for id: ${id}`);
    }

    const checked = playerResponseSchema.safeParse({ data: player });
    if (!checked.success) return badRequest("Failed to serialize player", checked.error);

    return ok(checked.data.data);
  } catch (error) {
    console.error("[API] GET /api/v1/players/[id] failed", error);
    return internalError("Could not fetch player.");
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const parsedBody = await parseJson(req, playerUpdateRequestSchema);
    if (!parsedBody.success) return parsedBody.response;

    const updated = await updatePlayerRecord(id, parsedBody.data);
    if (!updated) {
      return notFound(`Player not found for id: ${id}`);
    }

    const checked = playerUpdateResponseSchema.safeParse({
      data: { ...updated, updated: false as const },
    });

    if (!checked.success) return badRequest("Failed to serialize player update response", checked.error);
    return ok(checked.data.data);
  } catch (error) {
    console.error("[API] PATCH /api/v1/players/[id] failed", error);
    return internalError("Could not update player.");
  }
}
