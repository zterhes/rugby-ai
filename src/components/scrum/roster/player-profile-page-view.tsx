import Image from "next/image";
import Link from "next/link";
import { useRef, type ChangeEvent } from "react";
import {
  MdArrowBack,
  MdBadge,
  MdCall,
  MdCloudUpload,
  MdEdit,
  MdEmail,
  MdOutlineDelete,
  MdSave,
} from "react-icons/md";
import type { Player } from "@/lib/data/players";
import type {
  PlayerFormDraft,
  PlayerFormErrors,
} from "@/lib/data/player-form-schema";

type PlayerProfilePageViewProps = {
  state: "loading" | "error" | "notFound" | "ready";
  mode: "view" | "edit" | "create";
  player?: Player;
  form?: PlayerFormDraft;
  errors?: PlayerFormErrors;
  submitError?: string | null;
  isSubmitting?: boolean;
  onFieldChange?: <K extends keyof PlayerFormDraft>(
    key: K,
    value: PlayerFormDraft[K],
  ) => void;
  onAvatarSelected?: (file: File) => void;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
  onSave?: () => void;
};

const DUES_OPTIONS: Array<{ value: PlayerFormDraft["duesStatus"]; label: string }> = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
];

const INPUT_CLASSES =
  "w-full rounded-lg border border-glass-border/50 bg-glass-fill/40 px-3 py-2 text-sm text-on-background placeholder:text-muted-foreground focus:border-primary-container/50 focus:outline-none";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function resolveAvatarSrc(playerId: string | undefined, avatarUrl: string | undefined) {
  if (!avatarUrl) return undefined;
  if (avatarUrl.includes(".private.blob.vercel-storage.com") && playerId) {
    return `/api/v1/players/${playerId}/avatar`;
  }
  return avatarUrl;
}

export function PlayerProfilePageView({
  state,
  mode,
  player,
  form,
  errors,
  submitError,
  isSubmitting = false,
  onFieldChange,
  onAvatarSelected,
  onStartEdit,
  onCancelEdit,
  onSave,
}: PlayerProfilePageViewProps) {
  const isFormMode = mode === "edit" || mode === "create";
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (state === "loading") {
    return (
      <main className="pb-12 px-4 md:px-page-padding max-w-[1100px] mx-auto min-h-screen flex items-center justify-center">
        <section className="rounded-xl border border-dashed border-glass-border/40 bg-glass-fill/10 px-6 py-12 text-center">
          <p className="font-display-title-xs text-display-title-xs text-on-background">
            Loading player...
          </p>
        </section>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="pb-12 px-4 md:px-page-padding max-w-[1100px] mx-auto min-h-screen flex items-center justify-center">
        <section className="rounded-xl border border-dashed border-error/40 bg-error/10 px-6 py-12 text-center">
          <p className="font-display-title-xs text-display-title-xs text-on-background">
            Could not load player profile
          </p>
          <p className="mt-1 font-subtitle text-subtitle text-muted-foreground">
            Please refresh and try again.
          </p>
        </section>
      </main>
    );
  }

  if (state === "notFound") {
    return (
      <main className="pb-12 px-4 md:px-page-padding max-w-[1100px] mx-auto min-h-screen flex items-center justify-center">
        <section className="rounded-xl border border-dashed border-glass-border/40 bg-glass-fill/10 px-6 py-12 text-center">
          <p className="font-display-title-xs text-display-title-xs text-on-background">
            Player not found
          </p>
          <Link
            href="/roster"
            className="mt-3 inline-flex items-center gap-2 text-primary hover:text-primary-fixed transition-colors"
          >
            <MdArrowBack className="text-lg shrink-0" aria-hidden />
            Back to Roster
          </Link>
        </section>
      </main>
    );
  }

  const playerName = form?.name || player?.name || "New Player";
  const playerAvatar = form?.avatarUrl || player?.avatarUrl;
  const avatarSrc = resolveAvatarSrc(player?.id, playerAvatar);
  const isPaid = (form?.duesStatus ?? player?.duesStatus ?? "pending") === "paid";
  const initials = getInitials(playerName);

  const handleUploadClick = () => {
    if (!isFormMode || isSubmitting) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onAvatarSelected?.(file);
    event.target.value = "";
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-variant/30 via-background to-background" />

      <main className="pb-12 px-4 md:px-page-padding max-w-[1100px] mx-auto min-h-screen flex flex-col gap-6">
        <section className="flex items-center justify-between gap-4">
          <Link
            href="/roster"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-on-background transition-colors"
          >
            <MdArrowBack className="text-lg shrink-0" aria-hidden />
            <span className="font-body-ui">Back to Roster</span>
          </Link>

          {isFormMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancelEdit}
                className="inline-flex items-center gap-2 rounded-lg border border-glass-border/50 bg-surface-elevated/40 px-4 py-2 font-label text-on-background transition-all hover:border-glass-border hover:bg-surface-elevated"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onSave}
                className="inline-flex items-center gap-2 rounded-lg border border-primary-container/40 bg-primary-container px-4 py-2 font-label text-on-primary-container transition-all hover:bg-primary-container/90 disabled:opacity-60"
              >
                <MdSave className="text-base shrink-0" aria-hidden />
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex items-center gap-2 rounded-lg border border-glass-border/50 bg-surface-elevated/40 px-4 py-2 font-label text-on-background transition-all hover:border-glass-border hover:bg-surface-elevated"
            >
              <MdEdit className="text-base shrink-0" aria-hidden />
              Edit Profile
            </button>
          )}
        </section>

        {submitError ? (
          <section className="rounded-lg border border-error/40 bg-error/10 px-4 py-3 text-sm text-on-background">
            {submitError}
          </section>
        ) : null}

        <section className="rounded-xl border border-glass-border/30 bg-glass-fill/40 backdrop-blur-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-glass-border/50 bg-surface-elevated">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={`${playerName} profile photo`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center font-display-title text-display-title text-muted-foreground">
                  {initials}
                </span>
              )}
              {isFormMode ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={isSubmitting}
                    className="absolute inset-0 flex items-end justify-center bg-black/35 pb-2 text-xs font-semibold text-white transition hover:bg-black/45 disabled:cursor-not-allowed"
                  >
                    <span className="inline-flex items-center gap-1">
                      <MdCloudUpload className="text-base" aria-hidden />
                      {isSubmitting ? "Saving..." : "Upload"}
                    </span>
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                {isFormMode ? (
                  <div className="w-full md:max-w-md">
                    <input
                      value={form?.name ?? ""}
                      onChange={(e) => onFieldChange?.("name", e.target.value)}
                      placeholder="Player Name"
                      className={INPUT_CLASSES}
                    />
                    {errors?.name ? (
                      <p className="mt-1 text-xs text-error">{errors.name}</p>
                    ) : null}
                  </div>
                ) : (
                  <h1 className="font-display-title text-display-title text-on-background">
                    {playerName}
                  </h1>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-label text-[10px] ${isPaid ? "border border-tertiary-container/30 bg-tertiary-container/20 text-tertiary" : "border border-error-container/30 bg-error-container/20 text-error"}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isPaid ? "bg-tertiary" : "bg-error animate-pulse"}`}
                  />
                  {isPaid ? "Paid" : "Pending"}
                </span>
              </div>

              {isFormMode ? (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2 md:max-w-xs">
                    <select
                      value={form?.duesStatus ?? "pending"}
                      onChange={(e) =>
                        onFieldChange?.("duesStatus", e.target.value as PlayerFormDraft["duesStatus"])
                      }
                      className={INPUT_CLASSES}
                    >
                      {DUES_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors?.duesStatus ? (
                      <p className="mt-1 text-xs text-error">{errors.duesStatus}</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-1 font-subtitle text-subtitle text-muted-foreground">
                  Player profile
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                {isFormMode ? (
                  <>
                    <div>
                      <input
                        value={form?.email ?? ""}
                        onChange={(e) => onFieldChange?.("email", e.target.value)}
                        placeholder="Email"
                        className={INPUT_CLASSES}
                      />
                      {errors?.email ? (
                        <p className="mt-1 text-xs text-error">{errors.email}</p>
                      ) : null}
                    </div>
                    <div>
                      <input
                        value={form?.phone ?? ""}
                        onChange={(e) => onFieldChange?.("phone", e.target.value)}
                        placeholder="Phone"
                        className={INPUT_CLASSES}
                      />
                      {errors?.phone ? (
                        <p className="mt-1 text-xs text-error">{errors.phone}</p>
                      ) : null}
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          value={form?.avatarUrl ?? ""}
                          onChange={(e) => onFieldChange?.("avatarUrl", e.target.value)}
                          placeholder="Avatar URL (optional)"
                          className={`${INPUT_CLASSES} flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => onFieldChange?.("avatarUrl", "")}
                          className="inline-flex items-center gap-1 rounded-md border border-glass-border/50 px-3 py-2 text-xs text-muted-foreground hover:text-on-background"
                        >
                          <MdOutlineDelete className="text-sm" aria-hidden />
                          Remove
                        </button>
                      </div>
                      {errors?.avatarUrl ? (
                        <p className="mt-1 text-xs text-error">{errors.avatarUrl}</p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={`mailto:${player?.email ?? ""}`}
                      className="inline-flex items-center gap-2 hover:text-on-background transition-colors"
                    >
                      <MdEmail className="text-base shrink-0" aria-hidden />
                      <span className="font-subtitle-xs">{player?.email}</span>
                    </a>
                    <a
                      href={`tel:${(player?.phone ?? "").replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 hover:text-on-background transition-colors"
                    >
                      <MdCall className="text-base shrink-0" aria-hidden />
                      <span className="font-subtitle-xs">{player?.phone}</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="rounded-xl border border-glass-border/30 bg-glass-fill/30 backdrop-blur-xl p-4">
            <p className="font-subtitle-xs text-muted-foreground">License ID</p>
            {isFormMode ? (
              <>
                <input
                  value={form?.licenseId ?? ""}
                  onChange={(e) => onFieldChange?.("licenseId", e.target.value)}
                  placeholder="License ID"
                  className={`${INPUT_CLASSES} mt-1`}
                />
                {errors?.licenseId ? (
                  <p className="mt-1 text-xs text-error">{errors.licenseId}</p>
                ) : null}
              </>
            ) : (
              <p className="mt-1 font-code text-code text-on-background tracking-widest">
                {player?.licenseId}
              </p>
            )}
          </article>
          <article className="rounded-xl border border-glass-border/30 bg-glass-fill/30 backdrop-blur-xl p-4">
            <p className="font-subtitle-xs text-muted-foreground">Caps</p>
            {isFormMode ? (
              <>
                <input
                  type="number"
                  min={0}
                  value={form?.caps ?? "0"}
                  onChange={(e) => onFieldChange?.("caps", e.target.value)}
                  placeholder="Caps"
                  className={`${INPUT_CLASSES} mt-1`}
                />
                {errors?.caps ? (
                  <p className="mt-1 text-xs text-error">{errors.caps}</p>
                ) : null}
              </>
            ) : (
              <p className="mt-1 font-display-title-sm text-display-title-sm text-on-background">
                {player?.caps}
              </p>
            )}
          </article>
        </section>

        <section className="rounded-xl border border-glass-border/30 bg-glass-fill/30 backdrop-blur-xl p-6">
          <h2 className="font-display-title-xs text-display-title-xs text-on-background inline-flex items-center gap-2">
            <MdBadge className="text-xl shrink-0 text-primary" aria-hidden />
            Player Summary
          </h2>
          <p className="mt-3 font-subtitle text-subtitle text-muted-foreground">
            {mode === "create"
              ? "Create a new player profile and save to add it to the current roster session."
              : "Detailed finance and match history sections can be layered here after backend integration."}
          </p>
        </section>
      </main>
    </>
  );
}
