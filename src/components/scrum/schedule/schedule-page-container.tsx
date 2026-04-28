"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SchedulePageView } from "@/components/scrum/schedule/schedule-page-view";
import {
  createScheduleMatch,
  getScheduleMatches,
  SCHEDULE_MATCHES_QUERY_KEY,
  type CreateScheduleMatchInput,
} from "@/lib/data/schedule-query";
import {
  createTeam,
  getTeams,
  TEAMS_QUERY_KEY,
  type CreateTeamInput,
} from "@/lib/data/teams-query";
import type { Team } from "@/lib/data/teams";

export type MatchDraft = {
  fixtureType: "home" | "away";
  opponentTeamId: string;
  dateIso: string;
  kickoffTime: string;
  roundLabel: string;
  meetTime: string;
  kitPrimary: string;
  kitSecondary: string;
};

export type TeamDraft = {
  name: string;
  logo: string;
  venueMapUrl: string;
};

const DEFAULT_MATCH_DRAFT: MatchDraft = {
  fixtureType: "home",
  opponentTeamId: "",
  dateIso: "",
  kickoffTime: "",
  roundLabel: "",
  meetTime: "",
  kitPrimary: "Primary Red",
  kitSecondary: "Black Shorts",
};

const DEFAULT_TEAM_DRAFT: TeamDraft = {
  name: "",
  logo: "",
  venueMapUrl: "",
};

const TEAM_NAME = process.env.NEXT_PUBLIC_TEAM_NAME ?? "First XV";

export function SchedulePageContainer() {
  const queryClient = useQueryClient();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [isCreateMatchOpen, setIsCreateMatchOpen] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [matchDraft, setMatchDraft] = useState<MatchDraft>(DEFAULT_MATCH_DRAFT);
  const [teamDraft, setTeamDraft] = useState<TeamDraft>(DEFAULT_TEAM_DRAFT);
  const [matchFormError, setMatchFormError] = useState<string | null>(null);
  const [teamFormError, setTeamFormError] = useState<string | null>(null);

  const {
    data: matchesData,
    isLoading: isMatchesLoading,
    isError: isMatchesError,
  } = useQuery({
    queryKey: SCHEDULE_MATCHES_QUERY_KEY,
    queryFn: getScheduleMatches,
  });

  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: getTeams,
  });

  const createMatchMutation = useMutation({
    mutationFn: createScheduleMatch,
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: SCHEDULE_MATCHES_QUERY_KEY });
      setSelectedMatchId(created.id);
      setIsCreateMatchOpen(false);
      setMatchDraft(DEFAULT_MATCH_DRAFT);
      setMatchFormError(null);
    },
    onError: () => {
      setMatchFormError("Could not create match. Please try again.");
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: TEAMS_QUERY_KEY });
      setMatchDraft((previous) => ({ ...previous, opponentTeamId: created.id }));
      setTeamDraft(DEFAULT_TEAM_DRAFT);
      setTeamFormError(null);
      setIsCreateTeamOpen(false);
    },
    onError: () => {
      setTeamFormError("Could not add team. Please try again.");
    },
  });

  const matches = matchesData ?? [];
  const teams = teamsData ?? [];

  const groupedMatches = useMemo(() => {
    return matches.reduce<Record<string, typeof matches>>((acc, match) => {
      if (!acc[match.monthLabel]) {
        acc[match.monthLabel] = [];
      }
      acc[match.monthLabel].push(match);
      return acc;
    }, {});
  }, [matches]);

  useEffect(() => {
    if (!matches.length) {
      setSelectedMatchId(null);
      return;
    }

    if (selectedMatchId !== null) {
      const exists = matches.some((match) => match.id === selectedMatchId);
      if (exists) return;
    }

    const defaultMatch = matches.find((match) => match.isActive) ?? matches[0];
    setSelectedMatchId(defaultMatch.id);
  }, [matches, selectedMatchId]);

  const activeMatch = useMemo(() => {
    if (!matches.length) return null;
    if (selectedMatchId === null) {
      return matches.find((match) => match.isActive) ?? matches[0];
    }
    return matches.find((match) => match.id === selectedMatchId) ?? matches[0];
  }, [matches, selectedMatchId]);

  const selectedOpponent = useMemo(() => {
    return teams.find((team) => team.id === matchDraft.opponentTeamId) ?? null;
  }, [teams, matchDraft.opponentTeamId]);

  const handleOpenCreateMatch = () => {
    setIsCreateMatchOpen(true);
    setMatchFormError(null);
  };

  const handleMatchDraftChange = <K extends keyof MatchDraft>(
    key: K,
    value: MatchDraft[K],
  ) => {
    setMatchDraft((previous) => ({ ...previous, [key]: value }));
    if (matchFormError) {
      setMatchFormError(null);
    }
  };

  const handleTeamDraftChange = <K extends keyof TeamDraft>(
    key: K,
    value: TeamDraft[K],
  ) => {
    setTeamDraft((previous) => ({ ...previous, [key]: value }));
    if (teamFormError) {
      setTeamFormError(null);
    }
  };

  const handleCreateMatch = async () => {
    if (!matchDraft.opponentTeamId || !matchDraft.dateIso) {
      setMatchFormError("Please select opponent team and date.");
      return;
    }

    const opponentTeam = teams.find((team) => team.id === matchDraft.opponentTeamId);
    if (!opponentTeam) {
      setMatchFormError("Selected opponent team is not available.");
      return;
    }

    const payload: CreateScheduleMatchInput = {
      fixtureType: matchDraft.fixtureType,
      opponentTeam,
      dateIso: matchDraft.dateIso,
      kickoffTime: matchDraft.kickoffTime,
      roundLabel: matchDraft.roundLabel,
      meetTime: matchDraft.meetTime,
      kitPrimary: matchDraft.kitPrimary,
      kitSecondary: matchDraft.kitSecondary,
      teamName: TEAM_NAME,
    };

    await createMatchMutation.mutateAsync(payload);
  };

  const handleCreateTeam = async () => {
    if (!teamDraft.name.trim() || !teamDraft.logo.trim() || !teamDraft.venueMapUrl.trim()) {
      setTeamFormError("Please fill in team name, logo URL, and Google Maps link.");
      return;
    }

    const payload: CreateTeamInput = {
      name: teamDraft.name,
      logo: teamDraft.logo,
      venueMapUrl: teamDraft.venueMapUrl,
    };

    await createTeamMutation.mutateAsync(payload);
  };

  return (
    <SchedulePageView
      groupedMatches={groupedMatches}
      activeMatch={activeMatch}
      selectedMatchId={selectedMatchId}
      isLoading={isMatchesLoading}
      isError={isMatchesError}
      onSelectMatch={setSelectedMatchId}
      teamName={TEAM_NAME}
      teams={teams}
      isTeamsLoading={isTeamsLoading}
      isTeamsError={isTeamsError}
      matchDraft={matchDraft}
      teamDraft={teamDraft}
      selectedOpponent={selectedOpponent}
      isCreateMatchOpen={isCreateMatchOpen}
      isCreateTeamOpen={isCreateTeamOpen}
      matchFormError={matchFormError}
      teamFormError={teamFormError}
      isCreatingMatch={createMatchMutation.isPending}
      isCreatingTeam={createTeamMutation.isPending}
      onOpenCreateMatch={handleOpenCreateMatch}
      onCreateMatchOpenChange={setIsCreateMatchOpen}
      onCreateTeamOpenChange={setIsCreateTeamOpen}
      onMatchDraftChange={handleMatchDraftChange}
      onTeamDraftChange={handleTeamDraftChange}
      onCreateMatch={handleCreateMatch}
      onCreateTeam={handleCreateTeam}
    />
  );
}
