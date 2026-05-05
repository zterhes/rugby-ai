"use client";

import Image from "next/image";
import { MdCall, MdEdit, MdMail, MdVisibility } from "react-icons/md";
import type { Player } from "@/lib/data/players";

type PlayerCardProps = {
  player: Player;
  onView?: (player: Player) => void;
  onEdit?: (player: Player) => void;
};

/** Builds initials like "JD" from a player's name as an avatar fallback. */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveAvatarSrc(player: Player) {
  if (!player.avatarUrl) return undefined;
  if (player.avatarUrl.includes(".private.blob.vercel-storage.com")) {
    return `/api/v1/players/${player.id}/avatar`;
  }
  return player.avatarUrl;
}

export function PlayerCard({ player, onView, onEdit }: PlayerCardProps) {
  const isPaid = player.duesStatus === "paid";
  const initials = getInitials(player.name);
  const avatarSrc = resolveAvatarSrc(player);

  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-glass-border/40 bg-glass-fill/30 p-glass-padding backdrop-blur-xl transition-all duration-300 hover:border-glass-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
      {/* Subtle top gradient highlight */}
      <div className="pointer-events-none absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-glass-border/30 to-transparent" />

      {/* Header: avatar + name + status pill */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-glass-border/50 bg-surface-elevated shadow-inner">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={`${player.name} profile photo`}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display-title-xs text-display-title-xs text-muted-foreground">
                {initials}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-body-ui text-body-ui text-on-background transition-colors group-hover:text-primary">
              {player.name}
            </h3>
            <span className="mt-0.5 block font-label text-label uppercase tracking-wider text-muted-foreground">
              {player.positionLabel}
            </span>
          </div>
        </div>

        {isPaid ? (
          <div className="flex items-center gap-1 rounded-full border border-tertiary-container/30 bg-tertiary-container/20 px-2 py-0.5 font-label text-[10px] text-tertiary shadow-[0_0_10px_rgba(0,120,178,0.1)]">
            <div className="h-1.5 w-1.5 rounded-full bg-tertiary" />
            Paid
          </div>
        ) : (
          <div className="flex items-center gap-1 rounded-full border border-error-container/30 bg-error-container/20 px-2 py-0.5 font-label text-[10px] text-error shadow-[0_0_10px_rgba(147,0,10,0.15)]">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-error" />
            Pending
          </div>
        )}
      </div>

      {/* Identity details */}
      <div className="space-y-2 rounded-lg border border-white/5 bg-surface-elevated/40 p-3">
        <div className="flex items-center justify-between">
          <span className="font-subtitle-xs text-subtitle-xs text-muted-foreground">
            License ID
          </span>
          <span className="font-code text-code tracking-widest text-on-surface/80">
            {player.licenseId}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-subtitle-xs text-subtitle-xs text-muted-foreground">
            Caps
          </span>
          <span className="font-body-ui text-body-ui text-on-surface">
            {player.caps}
          </span>
        </div>
      </div>

      {/* Contact info */}
      <div className="mt-1 flex flex-col gap-1.5">
        <a
          href={`mailto:${player.email}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors group-hover:text-on-surface-variant"
        >
          <MdMail size={16} className="shrink-0" aria-hidden />
          <span className="truncate font-subtitle-xs text-subtitle-xs">
            {player.email}
          </span>
        </a>
        <a
          href={`tel:${player.phone.replace(/\s+/g, "")}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors group-hover:text-on-surface-variant"
        >
          <MdCall size={16} className="shrink-0" aria-hidden />
          <span className="font-subtitle-xs text-subtitle-xs">
            {player.phone}
          </span>
        </a>
      </div>

      {/* Footer actions */}
      <div className="mt-auto flex gap-2 border-t border-glass-border/30 pt-4">
        <button
          type="button"
          onClick={() => onView?.(player)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-glass-border/50 bg-transparent py-2 font-label text-label text-on-background transition-all hover:border-glass-border hover:bg-surface-elevated"
        >
          <MdVisibility size={16} className="shrink-0" aria-hidden />
          Profile
        </button>
        <button
          type="button"
          onClick={() => onEdit?.(player)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-glass-border/50 bg-transparent py-2 font-label text-label text-on-background transition-all hover:border-glass-border hover:bg-surface-elevated"
        >
          <MdEdit size={16} className="shrink-0" aria-hidden />
          Edit
        </button>
      </div>
    </article>
  );
}
