"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { mapApiPlayersToLineup } from "@/components/scrum/line-up/map-api-player-to-lineup";
import type { LineupPlayer } from "@/components/scrum/line-up/lineup-types";
import {
  LineupBuilderProvider,
} from "@/components/scrum/line-up/lineup-builder-context";
import { LineupBuilderView } from "@/components/scrum/line-up/lineup-builder-view";
import { getLineupBootstrap } from "@/lib/data/lineups-query";
import { getPlayers, PLAYERS_QUERY_KEY } from "@/lib/data/players-query";

type LineupBuilderContainerProps = {
  matchId: string;
};

export function LineupBuilderContainer({ matchId }: LineupBuilderContainerProps) {
  const numericId = Number(matchId);
  const scheduleIdValid = Number.isInteger(numericId) && numericId > 0;

  const rosterQuery = useQuery({
    queryKey: [...PLAYERS_QUERY_KEY, "lineup-builder"],
    queryFn: () => getPlayers({ page: 1, pageSize: 100 }),
  });

  const bootstrapQuery = useQuery({
    queryKey: ["lineups", "bootstrap", matchId],
    queryFn: () => getLineupBootstrap(numericId),
    enabled: scheduleIdValid,
  });

  const rosterPlayers = rosterQuery.data ? mapApiPlayersToLineup(rosterQuery.data) : [];

  const rosterError =
    rosterQuery.isError && rosterQuery.error instanceof Error
      ? rosterQuery.error
      : rosterQuery.isError
        ? new Error("Failed to load players")
        : null;

  const bootstrapError =
    bootstrapQuery.isError && bootstrapQuery.error instanceof Error
      ? bootstrapQuery.error
      : bootstrapQuery.isError
        ? new Error("Failed to load lineup")
        : null;

  const initialLineup = useMemo((): Record<number, LineupPlayer> => {
    if (!bootstrapQuery.isSuccess || !bootstrapQuery.data) return {};
    const d = bootstrapQuery.data.data;
    if (d.scheduleId !== numericId) return {};
    return Object.fromEntries(
      d.slots.map((s) => [s.positionId, s.player] as const),
    );
  }, [bootstrapQuery.isSuccess, numericId, bootstrapQuery.data]);

  const providerKey = `lineup-${matchId}-${
    bootstrapQuery.isSuccess ? String(bootstrapQuery.dataUpdatedAt) : "bootstrap-pending"
  }`;

  const opponentTeamName =
    bootstrapQuery.isSuccess && bootstrapQuery.data?.data.scheduleId === numericId
      ? bootstrapQuery.data.data.opponentTeamName
      : "";

  return (
    <LineupBuilderProvider
      key={providerKey}
      matchId={matchId}
      initialLineup={initialLineup}
      rosterPlayers={rosterPlayers}
      rosterLoading={rosterQuery.isPending}
      rosterError={rosterError}
      opponentTeamName={opponentTeamName}
      lineupBootstrapLoading={bootstrapQuery.isPending}
      lineupBootstrapError={bootstrapError}
    >
      <LineupBuilderView />
    </LineupBuilderProvider>
  );
}
