import { apiGet, apiSend } from "@/lib/api/client/http";
import {
  lineupBootstrapResponseSchema,
  lineupCreateResponseSchema,
  type LineupCreateRequest,
} from "@/lib/api/contracts/lineups";

export async function getLineupBootstrap(scheduleId: number) {
  return apiGet("/api/v1/lineups", lineupBootstrapResponseSchema, { scheduleId });
}

export async function createLineup(body: LineupCreateRequest) {
  return apiSend("POST", "/api/v1/lineups", body, lineupCreateResponseSchema);
}
