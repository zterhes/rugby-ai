"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLineupBuilder } from "@/components/scrum/line-up/lineup-builder-context";
import { LineupPitchCard } from "@/components/scrum/line-up/lineup-pitch-card";
import { lineupRecordToSlots } from "@/components/scrum/line-up/lineup-to-api";
import { LineupUnassignedCard } from "@/components/scrum/line-up/lineup-unassigned-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiClientError } from "@/lib/api/client/http";
import { createLineup } from "@/lib/data/lineups-query";
import { SCHEDULE_MATCHES_QUERY_KEY } from "@/lib/data/schedule-query";

export function LineupBuilderView() {
  const queryClient = useQueryClient();
  const {
    matchId,
    lineup,
    rosterLoading,
    opponentTeamName,
    lineupBootstrapLoading,
  } = useLineupBuilder();
  const [isSaving, setIsSaving] = useState(false);

  const numericMatchId = Number(matchId);
  const matchIdValid = Number.isInteger(numericMatchId) && numericMatchId > 0;

  async function handleSaveLineup() {
    if (!matchIdValid) {
      toast.error("Invalid match id");
      return;
    }

    setIsSaving(true);
    try {
      const slots = lineupRecordToSlots(lineup);
      const res = await createLineup({ matchId: numericMatchId, slots });
      toast.success(`Lineup saved (${res.data.slotCount} players)`);
      await queryClient.invalidateQueries({ queryKey: ["lineups", "bootstrap", matchId] });
      await queryClient.invalidateQueries({ queryKey: SCHEDULE_MATCHES_QUERY_KEY });
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error(err.message);
      } else {
        toast.error("Could not save lineup");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden font-sans text-foreground selection:bg-primary-container/30">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl md:px-10">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Lineup Builder</h1>
          <p className="mt-0.5 font-bold text-[10px] text-muted-foreground uppercase tracking-widest">
            Match {matchId}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            size="sm"
            className="font-bold"
            disabled={
              isSaving || rosterLoading || lineupBootstrapLoading || !matchIdValid
            }
            onClick={() => void handleSaveLineup()}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                Saving…
              </>
            ) : (
              "Save lineup"
            )}
          </Button>
          <Badge
            variant="outline"
            className="hidden h-auto gap-2 rounded-xl border-border bg-surface px-4 py-1.5 font-bold sm:inline-flex"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Match vs
            </span>
            <span className="text-xs font-bold text-foreground">
              {opponentTeamName.trim() ? opponentTeamName : "—"}
            </span>
          </Badge>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden p-6 md:gap-8 md:p-8 xl:grid-cols-12">
        <LineupPitchCard />

        <aside className="flex min-h-0 flex-col gap-6 overflow-hidden xl:col-span-4">
          <LineupUnassignedCard />
        </aside>
      </div>
    </div>
  );
}
