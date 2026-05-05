import { nanoid } from "nanoid";
import { PLAYERS } from "@/lib/data/players";
import {
  playerCreateRequestSchema,
  playersListQuerySchema,
  playersListResponseSchema,
  playerCreateResponseSchema,
} from "@/lib/api/contracts/players";
import { badRequest, created, okList, parseJson, parseSearchParams } from "@/lib/api/http";

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

export async function GET(req: Request) {
  const parsedQuery = parseSearchParams(req, playersListQuerySchema);
  if (!parsedQuery.success) return parsedQuery.response;

  const { search, position, duesStatus, page, pageSize } = parsedQuery.data;

  const filtered = PLAYERS.filter((player) => {
    if (position && player.position !== position) return false;
    if (duesStatus && player.duesStatus !== duesStatus) return false;
    if (search) {
      const term = search.trim().toLowerCase();
      if (term.length > 0) {
        const haystack = `${player.name} ${player.email} ${player.licenseId} ${player.positionLabel}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
    }
    return true;
  });

  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  const payload = { data: paginated, meta: { total: filtered.length, page, pageSize } };
  const checked = playersListResponseSchema.safeParse(payload);
  if (!checked.success) return badRequest("Failed to serialize players response", checked.error);

  return okList(checked.data.data, checked.data.meta);
}

export async function POST(req: Request) {
  const parsedBody = await parseJson(req, playerCreateRequestSchema);
  if (!parsedBody.success) return parsedBody.response;

  const body = parsedBody.data;

  console.log("[API STUB] POST /api/v1/players", body);

  const normalized = {
    id: `p-${nanoid(6)}`,
    name: body.name.trim(),
    position: body.position,
    positionLabel: POSITION_LABELS[body.position],
    licenseId: body.licenseId.trim(),
    caps: body.caps,
    email: body.email.trim(),
    phone: body.phone.trim(),
    avatarUrl: body.avatarUrl?.trim() || undefined,
    duesStatus: body.duesStatus,
    created: false as const,
  };

  const checked = playerCreateResponseSchema.safeParse({ data: normalized });
  if (!checked.success) return badRequest("Failed to serialize player create response", checked.error);

  return created(checked.data.data);
}
