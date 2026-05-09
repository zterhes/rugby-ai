"use client";

import { MoreVertical, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { resolvePlayerAvatarSrc } from "@/lib/players/resolve-avatar-url";
import type { LineupPlayer } from "@/components/scrum/line-up/lineup-types";

type LineupPlayerCardProps = {
  player: LineupPlayer;
};

export function LineupPlayerCard({ player }: LineupPlayerCardProps) {
  const avatarSrc = resolvePlayerAvatarSrc(player);
  return (
    <Card
      className={cn(
        "group gap-0 border-border bg-surface py-0 shadow-none transition-colors",
        "rounded-xl hover:border-primary-container/30",
      )}
    >
      <CardContent className="flex items-center gap-3 p-3">
        <Avatar className="size-10 rounded-lg border border-white/5">
          {avatarSrc ? (
            <AvatarImage
              src={avatarSrc}
              alt={player.name}
              className="rounded-lg object-cover"
            />
          ) : null}
          <AvatarFallback className="rounded-lg bg-red-600/10 text-red-600/50">
            <Users className="size-5" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold leading-tight">
            {player.name}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Player actions"
        >
          <MoreVertical className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
