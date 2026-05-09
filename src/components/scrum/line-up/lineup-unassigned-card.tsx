"use client";

import { useDraggable, useDroppable } from "@dnd-kit/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  lineupPlayerDragId,
  lineupUnassignedDropId,
  useLineupBuilder,
} from "@/components/scrum/line-up/lineup-builder-context";
import { LineupPlayerCard } from "@/components/scrum/line-up/lineup-player-card";
import type { LineupPlayer } from "@/components/scrum/line-up/lineup-types";
import { cn } from "@/lib/utils";

function DraggableUnassignedPlayer({ player }: { player: LineupPlayer }) {
  const { ref, isDragging } = useDraggable({
    id: lineupPlayerDragId(player.id),
  });

  return (
    <div
      ref={ref}
      className={cn(
        "touch-none",
        isDragging && "opacity-60",
        !isDragging && "cursor-grab active:cursor-grabbing",
      )}
    >
      <LineupPlayerCard player={player} />
    </div>
  );
}

export function LineupUnassignedCard() {
  const { unassigned, rosterLoading, rosterError } = useLineupBuilder();
  const { ref: poolRef, isDropTarget } = useDroppable({
    id: lineupUnassignedDropId(),
  });

  return (
    <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden border-border bg-surface py-0 shadow-xl">
      <CardHeader className="shrink-0 border-b border-white/5 px-6 py-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold uppercase tracking-wider">
            Unassigned
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div
          ref={poolRef}
          className={cn(
            "min-h-0 flex-1 space-y-3 overflow-y-auto p-6 scrollbar-thin",
            isDropTarget && "bg-primary-container/5 ring-2 ring-inset ring-primary-container/40",
          )}
        >
          {rosterLoading ? (
            <p className="py-4 text-center text-xs font-bold text-muted-foreground">
              Loading squad…
            </p>
          ) : null}
          {rosterError && !rosterLoading ? (
            <p className="py-4 text-center text-xs font-bold text-destructive">
              {rosterError.message}
            </p>
          ) : null}
          {!rosterLoading && !rosterError && unassigned.length === 0 ? (
            <p className="py-4 text-center text-xs font-bold text-muted-foreground">
              Drop players here to unassign
            </p>
          ) : null}
          {unassigned.map((player) => (
            <DraggableUnassignedPlayer key={player.id} player={player} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
