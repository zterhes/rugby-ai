import { playerResponseSchema, playerUpdateRequestSchema, playerUpdateResponseSchema } from "@/lib/api/contracts/players";
import { PLAYERS } from "@/lib/data/players";
import { badRequest, notFound, ok, parseJson } from "@/lib/api/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const POSITION_LABELS: Record<string, string> = {
  prop: "Prop",
  hooker: "Hooker",
  lock: "Lock",
  flanker: "Flanker",
  number8: "Number 8",
  scrumhalf: "Scrum-half",
  flyhalf: "Fly-half",
  centre: "Centre",
  wing: "Wing",
  fullback: "Fullback",
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const player = PLAYERS.find((item) => item.id === id);
  if (!player) {
    return notFound(`Player not found for id: ${id}`);
  }

  const checked = playerResponseSchema.safeParse({ data: player });
  if (!checked.success) return badRequest("Failed to serialize player", checked.error);

  return ok(checked.data.data);
}

export async function PATCH(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const player = PLAYERS.find((item) => item.id === id);
  if (!player) {
    return notFound(`Player not found for id: ${id}`);
  }

  const parsedBody = await parseJson(req, playerUpdateRequestSchema);
  if (!parsedBody.success) return parsedBody.response;

  const body = parsedBody.data;
  console.log(`[API STUB] PATCH /api/v1/players/${id}`, body);

  const checked = playerUpdateResponseSchema.safeParse({
    data: {
      ...player,
      ...body,
      positionLabel: POSITION_LABELS[body.position],
      updated: false as const,
    },
  });

  if (!checked.success) return badRequest("Failed to serialize player update response", checked.error);

  return ok(checked.data.data);
}
