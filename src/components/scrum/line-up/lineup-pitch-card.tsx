"use client";

import { useDraggable, useDroppable } from "@dnd-kit/react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  lineupPitchDropId,
  lineupPlayerDragId,
  useLineupBuilder,
} from "@/components/scrum/line-up/lineup-builder-context";
import { cn } from "@/lib/utils";
import {
  PITCH_POSITIONS,
  type LineupPlayer,
  type PitchPosition,
} from "@/components/scrum/line-up/lineup-types";
import { resolvePlayerAvatarSrc } from "@/lib/players/resolve-avatar-url";

function EmptyPitchSlot({ pos }: { pos: PitchPosition }) {
  const { ref, isDropTarget } = useDroppable({
    id: lineupPitchDropId(pos.id),
  });

  return (
    <div
      ref={ref}
      className={cn(
        "group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 touch-none",
        isDropTarget && "z-10",
      )}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-14 w-14 rounded-full border-2 p-0 shadow-lg pointer-events-none",
            "border-primary-container/20 bg-transparent text-primary-container/30 hover:border-primary-container/50 hover:bg-primary-container/5",
            isDropTarget &&
              "ring-2 ring-primary-container ring-offset-2 ring-offset-background",
          )}
        >
          <span className="text-xl font-black italic tracking-tighter">
            {pos.id}
          </span>
        </Button>
      </div>
      <span className="max-w-[120px] truncate rounded bg-background/80 px-1.5 py-0.5 text-center font-black text-[9px] text-muted-foreground uppercase tracking-[0.2em] backdrop-blur-sm pointer-events-none">
        {pos.label}
      </span>
    </div>
  );
}

function pitchSlotPlayerInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function OccupiedPitchSlot({
  pos,
  player,
}: {
  pos: PitchPosition;
  player: LineupPlayer;
}) {
  const { ref: dropRef, isDropTarget } = useDroppable({
    id: lineupPitchDropId(pos.id),
  });
  const { ref: dragRef, isDragging } = useDraggable({
    id: lineupPlayerDragId(player.id),
  });

  const avatarFallbackText = pitchSlotPlayerInitials(player.name);
  const avatarSrc = resolvePlayerAvatarSrc(player);

  return (
    <div
      ref={dropRef}
      className={cn(
        "group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 touch-none",
        isDropTarget && "z-10",
      )}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="relative">
        <div
          ref={dragRef}
          className={cn(
            "flex items-center gap-1.5 touch-none",
            isDragging && "opacity-60",
            !isDragging && "cursor-grab active:cursor-grabbing",
            isDropTarget &&
              "rounded-full ring-2 ring-primary-container ring-offset-2 ring-offset-background",
          )}
        >
          <Badge
            variant="outline"
            className="flex size-7 shrink-0 items-center justify-center rounded-full border-primary-container bg-primary-container px-0 font-black text-[11px] text-on-primary-container shadow-md tabular-nums"
          >
            {pos.id}
          </Badge>
          <div className="relative shrink-0">
            <Avatar className="size-14 rounded-full border-2 border-primary-container shadow-lg">
              {avatarSrc ? (
                <AvatarImage
                  src={avatarSrc}
                  alt={player.name}
                  className="rounded-full object-cover"
                />
              ) : null}
              <AvatarFallback className="rounded-full bg-red-600/10 text-xs font-black text-red-600/80">
                {avatarFallbackText ? (
                  avatarFallbackText
                ) : (
                  <Users className="size-6 text-red-600/50" />
                )}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <span className="max-w-[140px] truncate rounded bg-background/80 px-1.5 py-0.5 text-center font-black text-[9px] text-muted-foreground uppercase tracking-[0.2em] backdrop-blur-sm pointer-events-none">
        {player.name.split(" ")[1] || player.name}
      </span>
    </div>
  );
}

function PitchSlot({
  pos,
  player,
}: {
  pos: PitchPosition;
  player?: LineupPlayer;
}) {
  if (player) {
    return <OccupiedPitchSlot pos={pos} player={player} />;
  }
  return <EmptyPitchSlot pos={pos} />;
}

export function LineupPitchCard() {
  const { lineup, selectedCount } = useLineupBuilder();

  return (
    <Card
      className={cn(
        "relative min-h-0 gap-0 overflow-hidden border-border bg-surface py-0 shadow-2xl",
        "flex flex-col rounded-3xl xl:col-span-8",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/2 h-full w-px bg-white" />
        <div className="absolute top-1/2 left-0 h-px w-full bg-white" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-64 rounded-full border border-white" />
        </div>
      </div>

      <CardContent className="relative min-h-[280px] flex-1 p-0">
        {PITCH_POSITIONS.map((pos) => (
          <PitchSlot key={pos.id} pos={pos} player={lineup[pos.id]} />
        ))}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 bg-black/20 p-6">
        <div className="flex items-center gap-4">
          <div className="-space-x-2 flex">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="size-8 overflow-hidden rounded-full border-2 border-background bg-slate-800"
              />
            ))}
          </div>
          <span className="text-xs font-bold text-muted-foreground">
            {selectedCount} / 23 Players Selected
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
