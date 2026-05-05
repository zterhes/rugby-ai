import { apiGet, apiSend } from "@/lib/api/client/http";
import {
  scheduleCreateResponseSchema,
  scheduleListResponseSchema,
  type ScheduleCreateRequest,
} from "@/lib/api/contracts/schedule";
import type { ScheduleMatch } from "@/lib/data/schedule";

export const SCHEDULE_MATCHES_QUERY_KEY = ["schedule", "matches"] as const;

export type CreateScheduleMatchInput = ScheduleCreateRequest;

export async function getScheduleMatches(status?: "Final" | "Upcoming"): Promise<ScheduleMatch[]> {
  const res = await apiGet("/api/v1/schedule/matches", scheduleListResponseSchema, {
    status,
    page: 1,
    pageSize: 50,
  });
  return res.data;
}

export async function createScheduleMatch(
  input: CreateScheduleMatchInput,
): Promise<ScheduleMatch> {
  const res = await apiSend("POST", "/api/v1/schedule/matches", input, scheduleCreateResponseSchema);
  return res.data;
}
