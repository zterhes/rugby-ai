"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Player } from "@/lib/data/players";
import {
  type PlayerFormDraft,
  type PlayerFormErrors,
  playerFormSchema,
} from "@/lib/data/player-form-schema";
import {
  createPlayer,
  getPlayerById,
  playerQueryKey,
  PLAYERS_QUERY_KEY,
  updatePlayer,
} from "@/lib/data/players-query";
import { PlayerProfilePageView } from "@/components/scrum/roster/player-profile-page-view";

type PlayerProfileMode = "view" | "edit" | "create";

type PlayerProfilePageContainerProps = {
  playerId?: string;
  mode: PlayerProfileMode;
};

function toDraft(player?: Player): PlayerFormDraft {
  return {
    name: player?.name ?? "",
    position: player?.position ?? "prop",
    licenseId: player?.licenseId ?? "",
    caps: player?.caps?.toString() ?? "0",
    email: player?.email ?? "",
    phone: player?.phone ?? "",
    avatarUrl: player?.avatarUrl ?? "",
    duesStatus: player?.duesStatus ?? "pending",
  };
}

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.reduce<PlayerFormErrors>((acc, issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in acc)) {
      acc[field as keyof PlayerFormErrors] = issue.message;
    }
    return acc;
  }, {});
}

export function PlayerProfilePageContainer({
  playerId,
  mode,
}: PlayerProfilePageContainerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<PlayerFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftOverrides, setDraftOverrides] = useState<Partial<PlayerFormDraft>>(
    {},
  );

  const {
    data: player,
    isLoading,
    isError,
  } = useQuery({
    queryKey: playerId ? playerQueryKey(playerId) : [...PLAYERS_QUERY_KEY, "new"],
    queryFn: () => (playerId ? getPlayerById(playerId) : Promise.resolve(null)),
    enabled: Boolean(playerId) && mode !== "create",
  });

  const baseDraft = useMemo(
    () => (mode === "create" ? toDraft(undefined) : toDraft(player ?? undefined)),
    [mode, player],
  );

  const draft: PlayerFormDraft = useMemo(
    () => ({ ...baseDraft, ...draftOverrides }),
    [baseDraft, draftOverrides],
  );

  const createMutation = useMutation({
    mutationFn: createPlayer,
    onSuccess: (createdPlayer) => {
      queryClient.setQueryData<Player[]>(PLAYERS_QUERY_KEY, (previous = []) => {
        if (previous.some((item) => item.id === createdPlayer.id)) return previous;
        return [...previous, createdPlayer];
      });
      queryClient.setQueryData(playerQueryKey(createdPlayer.id), createdPlayer);
      router.push(`/roster/${createdPlayer.id}`);
    },
    onError: () => {
      setSubmitError("Could not create player. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: Parameters<typeof updatePlayer>[1]) =>
      updatePlayer(playerId as string, values),
    onSuccess: (updatedPlayer) => {
      if (!updatedPlayer) {
        setSubmitError("Player not found for update.");
        return;
      }

      queryClient.setQueryData<Player[]>(PLAYERS_QUERY_KEY, (previous = []) =>
        previous.map((item) => (item.id === updatedPlayer.id ? updatedPlayer : item)),
      );
      queryClient.setQueryData(playerQueryKey(updatedPlayer.id), updatedPlayer);
      router.push(`/roster/${updatedPlayer.id}`);
    },
    onError: () => {
      setSubmitError("Could not save changes. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const effectiveMode =
    mode === "create" ? "create" : mode === "edit" ? "edit" : "view";

  const handleFieldChange = <K extends keyof PlayerFormDraft>(
    key: K,
    value: PlayerFormDraft[K],
  ) => {
    setDraftOverrides((previous) => ({ ...previous, [key]: value }));
    if (errors[key]) {
      setErrors((previous) => ({ ...previous, [key]: undefined }));
    }
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleStartEdit = () => {
    if (!playerId) return;
    router.push(`/roster/${playerId}?edit=true`);
  };

  const handleCancelEdit = () => {
    if (effectiveMode === "create") {
      router.push("/roster");
      return;
    }

    if (!playerId) return;
    setDraftOverrides({});
    setErrors({});
    setSubmitError(null);
    router.push(`/roster/${playerId}`);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const parsed = playerFormSchema.safeParse(draft);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error.issues));
      return;
    }

    setErrors({});

    if (effectiveMode === "create") {
      await createMutation.mutateAsync(parsed.data);
      return;
    }

    if (!playerId) return;
    await updateMutation.mutateAsync(parsed.data);
  };

  if (effectiveMode !== "create" && isLoading) {
    return <PlayerProfilePageView state="loading" mode={effectiveMode} />;
  }

  if (effectiveMode !== "create" && isError) {
    return <PlayerProfilePageView state="error" mode={effectiveMode} />;
  }

  if (effectiveMode !== "create" && !player) {
    return <PlayerProfilePageView state="notFound" mode={effectiveMode} />;
  }

  return (
    <PlayerProfilePageView
      state="ready"
      mode={effectiveMode}
      player={player ?? undefined}
      form={draft}
      errors={errors}
      submitError={submitError}
      isSubmitting={isSubmitting}
      onFieldChange={handleFieldChange}
      onStartEdit={handleStartEdit}
      onCancelEdit={handleCancelEdit}
      onSave={handleSubmit}
    />
  );
}
