"use client";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LineupPlayer } from "@/components/scrum/line-up/lineup-types";

const PLAYER_PREFIX = "player:";
const PITCH_PREFIX = "pitch:";
const UNASSIGNED_POOL_ID = "pool:unassigned";

function parsePlayerDragId(id: string | number): string | null {
  const s = String(id);
  if (!s.startsWith(PLAYER_PREFIX)) return null;
  return s.slice(PLAYER_PREFIX.length);
}

function parsePitchDropId(id: string | number): number | null {
  const s = String(id);
  if (!s.startsWith(PITCH_PREFIX)) return null;
  const n = Number(s.slice(PITCH_PREFIX.length));
  return Number.isFinite(n) ? n : null;
}

function isUnassignedDropTarget(id: string | number): boolean {
  return String(id) === UNASSIGNED_POOL_ID;
}

type LineupBuilderContextValue = {
  matchId: string;
  lineup: Record<number, LineupPlayer>;
  unassigned: LineupPlayer[];
  selectedCount: number;
  rosterLoading: boolean;
  rosterError: Error | null;
  opponentTeamName: string;
  lineupBootstrapLoading: boolean;
  lineupBootstrapError: Error | null;
};

const LineupBuilderContext = createContext<LineupBuilderContextValue | null>(null);

type LineupBuilderProviderProps = {
  matchId: string;
  rosterPlayers: LineupPlayer[];
  /** Initial pitch assignment from GET /api/v1/lineups (remount provider when this source changes). */
  initialLineup?: Record<number, LineupPlayer>;
  rosterLoading?: boolean;
  rosterError?: Error | null;
  opponentTeamName?: string;
  lineupBootstrapLoading?: boolean;
  lineupBootstrapError?: Error | null;
  children: ReactNode;
};

export function LineupBuilderProvider({
  matchId,
  rosterPlayers,
  initialLineup = {},
  rosterLoading = false,
  rosterError = null,
  opponentTeamName: opponentTeamNameProp = "",
  lineupBootstrapLoading = false,
  lineupBootstrapError = null,
  children,
}: LineupBuilderProviderProps) {
  const [lineup, setLineup] = useState<Record<number, LineupPlayer>>(() => initialLineup);

  const unassigned = useMemo(() => {
    const onPitch = new Set(Object.values(lineup).map((p) => p.id));
    return rosterPlayers.filter((p) => !onPitch.has(p.id));
  }, [rosterPlayers, lineup]);

  const selectedCount = useMemo(() => Object.keys(lineup).length, [lineup]);

  useEffect(() => {
    console.log("[lineup-builder]", {
      lineup,
      unassigned,
      positionToPlayerId: Object.fromEntries(
        Object.entries(lineup).map(([k, p]) => [k, p.id]),
      ),
      unassignedIds: unassigned.map((p) => p.id),
    });
  }, [lineup, unassigned]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) return;

      const sourceId = event.operation.source?.id;
      const targetId = event.operation.target?.id;
      if (
        sourceId === undefined ||
        sourceId === null ||
        targetId === undefined ||
        targetId === null
      ) {
        return;
      }

      const playerId = parsePlayerDragId(sourceId);
      if (playerId === null) return;

      if (isUnassignedDropTarget(targetId)) {
        setLineup((prev) => {
          let slot: number | null = null;
          for (const [key, p] of Object.entries(prev)) {
            if (p.id === playerId) {
              slot = Number(key);
              break;
            }
          }
          if (slot === null) return prev;
          const nextLineup = { ...prev };
          delete nextLineup[slot];
          return nextLineup;
        });
        return;
      }

      const positionId = parsePitchDropId(targetId);
      if (positionId === null) return;

      setLineup((prev) => {
        const player =
          rosterPlayers.find((p) => p.id === playerId) ??
          Object.values(prev).find((p) => p.id === playerId);
        if (!player) return prev;

        const next: Record<number, LineupPlayer> = { ...prev };

        for (const key of Object.keys(next)) {
          const num = Number(key);
          if (next[num]?.id === playerId) {
            delete next[num];
          }
        }

        next[positionId] = player;
        return next;
      });
    },
    [rosterPlayers],
  );

  const contextValue = useMemo<LineupBuilderContextValue>(
    () => ({
      matchId,
      lineup,
      unassigned,
      selectedCount,
      rosterLoading,
      rosterError,
      opponentTeamName: opponentTeamNameProp,
      lineupBootstrapLoading,
      lineupBootstrapError,
    }),
    [
      matchId,
      lineup,
      unassigned,
      selectedCount,
      rosterLoading,
      rosterError,
      opponentTeamNameProp,
      lineupBootstrapLoading,
      lineupBootstrapError,
    ],
  );

  return (
    <LineupBuilderContext.Provider value={contextValue}>
      <DragDropProvider onDragEnd={handleDragEnd}>{children}</DragDropProvider>
    </LineupBuilderContext.Provider>
  );
}

export function lineupPlayerDragId(playerId: string) {
  return `${PLAYER_PREFIX}${playerId}` as const;
}

export function lineupPitchDropId(positionId: number) {
  return `${PITCH_PREFIX}${positionId}` as const;
}

export function lineupUnassignedDropId() {
  return UNASSIGNED_POOL_ID;
}

export function useLineupBuilder() {
  const ctx = useContext(LineupBuilderContext);
  if (!ctx) {
    throw new Error("useLineupBuilder must be used within LineupBuilderProvider");
  }
  return ctx;
}
