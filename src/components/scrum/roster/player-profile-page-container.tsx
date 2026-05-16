"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Player } from "@/lib/data/players";
import {
  type PlayerFormDraft,
  type PlayerFormErrors,
  type PlayerFormValues,
  playerFormSchema,
} from "@/lib/data/player-form-schema";
import {
  createPlayer,
  getPlayerById,
  playerQueryKey,
  PLAYERS_QUERY_KEY,
  uploadPlayerAvatar,
  updatePlayer,
} from "@/lib/data/players-query";
import { PlayerProfilePageView } from "@/components/scrum/roster/player-profile-page-view";
import { ApiClientError } from "@/lib/api/client/http";

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

function applyApiFieldErrors(error: unknown, setErrors: (errors: PlayerFormErrors) => void) {
  if (!(error instanceof ApiClientError) || !error.payload?.fieldErrors) return false;

  const mapped = error.payload.fieldErrors.reduce<PlayerFormErrors>((acc, item) => {
    const field = item.field as keyof PlayerFormErrors;
    if (!acc[field]) {
      acc[field] = item.message;
    }
    return acc;
  }, {});

  setErrors(mapped);
  return true;
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
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);

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
    mutationFn: async ({
      values,
      avatarFile,
    }: {
      values: PlayerFormValues;
      avatarFile?: File | null;
    }) => {
      const created = await createPlayer({
        ...values,
        avatarUrl: "",
      });

      if (!avatarFile) return created;

      const avatarUrl = await uploadPlayerAvatar(created.id, avatarFile);
      const updated = await updatePlayer(created.id, { ...values, avatarUrl });
      return updated ?? { ...created, avatarUrl };
    },
    onSuccess: (createdPlayer) => {
      toast.success("Player created successfully.");
      setPendingAvatarFile(null);
      queryClient.setQueryData<Player[]>(PLAYERS_QUERY_KEY, (previous = []) => {
        if (previous.some((item) => item.id === createdPlayer.id)) return previous;
        return [...previous, createdPlayer];
      });
      queryClient.setQueryData(playerQueryKey(createdPlayer.id), createdPlayer);
      router.push(`/roster/${createdPlayer.id}`);
    },
    onError: (error) => {
      if (applyApiFieldErrors(error, setErrors)) {
        setSubmitError("Please fix the highlighted fields.");
        toast.error("Could not create player.");
        return;
      }
      setSubmitError("Could not create player. Please try again.");
      toast.error("Could not create player.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      values,
      avatarFile,
    }: {
      values: PlayerFormValues;
      avatarFile?: File | null;
    }) => {
      if (!playerId) return null;
      if (!avatarFile) return updatePlayer(playerId, values);

      const avatarUrl = await uploadPlayerAvatar(playerId, avatarFile);
      return updatePlayer(playerId, { ...values, avatarUrl });
    },
    onSuccess: (updatedPlayer) => {
      if (!updatedPlayer) {
        setSubmitError("Player not found for update.");
        toast.error("Could not update player.");
        return;
      }

      toast.success("Player updated successfully.");
      setPendingAvatarFile(null);
      queryClient.setQueryData<Player[]>(PLAYERS_QUERY_KEY, (previous = []) =>
        previous.map((item) => (item.id === updatedPlayer.id ? updatedPlayer : item)),
      );
      queryClient.setQueryData(playerQueryKey(updatedPlayer.id), updatedPlayer);
      router.push(`/roster/${updatedPlayer.id}`);
    },
    onError: (error) => {
      if (applyApiFieldErrors(error, setErrors)) {
        setSubmitError("Please fix the highlighted fields.");
        toast.error("Could not update player.");
        return;
      }
      setSubmitError("Could not save changes. Please try again.");
      toast.error("Could not update player.");
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
    const parseTarget =
      pendingAvatarFile !== null ? { ...draft, avatarUrl: "" } : draft;
    const parsed = playerFormSchema.safeParse(parseTarget);

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error.issues));
      return;
    }

    setErrors({});

    if (effectiveMode === "create") {
      await createMutation.mutateAsync({
        values: parsed.data,
        avatarFile: pendingAvatarFile,
      });
      return;
    }

    if (!playerId) return;
    await updateMutation.mutateAsync({
      values: parsed.data,
      avatarFile: pendingAvatarFile,
    });
  };

  const handleAvatarSelected = (file: File) => {
    setPendingAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setDraftOverrides((previous) => ({ ...previous, avatarUrl: previewUrl }));
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
      onAvatarSelected={handleAvatarSelected}
      onStartEdit={handleStartEdit}
      onCancelEdit={handleCancelEdit}
      onSave={handleSubmit}
    />
  );
}
