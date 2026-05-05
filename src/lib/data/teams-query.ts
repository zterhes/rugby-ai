import { teamCreateResponseSchema, teamsListResponseSchema, type Team } from "@/lib/api/contracts/teams";
import { apiGet, apiSend } from "@/lib/api/client/http";

export const TEAMS_QUERY_KEY = ["teams"] as const;

export type CreateTeamInput = {
  name: string;
  logo: string;
  venueMapUrl: string;
};

export async function getTeams(search?: string): Promise<Team[]> {
  const res = await apiGet("/api/v1/teams", teamsListResponseSchema, {
    search,
  });
  return res.data;
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  const res = await apiSend("POST", "/api/v1/teams", input, teamCreateResponseSchema);
  return res.data;
}
