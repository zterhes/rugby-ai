import { nanoid } from "nanoid";
import { TEAMS, type Team } from "@/lib/data/teams";

export const TEAMS_QUERY_KEY = ["teams"] as const;

export type CreateTeamInput = {
  name: string;
  logo: string;
  venueMapUrl: string;
};

export async function getTeams(): Promise<Team[]> {
  // TODO: Replace this mock response with a real backend API call.
  return Promise.resolve(TEAMS);
}

export async function createTeam(input: CreateTeamInput): Promise<Team> {
  // TODO: Replace this mock mutation with a real backend API call.
  const created: Team = {
    id: `t-${nanoid(6)}`,
    name: input.name.trim(),
    logo: input.logo.trim(),
    venueMapUrl: input.venueMapUrl.trim(),
  };

  TEAMS.push(created);
  return Promise.resolve(created);
}
