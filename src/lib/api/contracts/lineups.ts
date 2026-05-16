import { z } from "@/lib/api/zod-openapi";
import { scheduleMatchSchema } from "@/lib/api/contracts/schedule";

export const pitchPositionSchema = z.number().int().min(1).max(23);

export const lineupListQuerySchema = z.object({
  scheduleId: z.coerce.number().int().positive(),
});

export const lineupPlayerResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatarUrl: z.string().url().optional(),
  positionLabel: z.string(),
});

export const lineupSlotWithPlayerSchema = z.object({
  positionId: pitchPositionSchema,
  player: lineupPlayerResponseSchema,
});

export const lineupBootstrapDataSchema = z.object({
  scheduleId: z.number().int(),
  opponentTeamName: z.string(),
  schedule: scheduleMatchSchema,
  slots: z.array(lineupSlotWithPlayerSchema),
});

export const lineupBootstrapResponseSchema = z.object({
  data: lineupBootstrapDataSchema,
});

export const lineupSlotSchema = z.object({
  positionId: pitchPositionSchema,
  playerId: z.string().uuid(),
});

export const lineupCreateRequestSchema = z
  .object({
    matchId: z.coerce.number().int().positive(),
    slots: z.array(lineupSlotSchema),
  })
  .superRefine((data, ctx) => {
    const positionIds = data.slots.map((s) => s.positionId);
    if (new Set(positionIds).size !== positionIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate positionId in slots",
        path: ["slots"],
      });
    }
    const playerIds = data.slots.map((s) => s.playerId);
    if (new Set(playerIds).size !== playerIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate playerId in slots",
        path: ["slots"],
      });
    }
  });

export const lineupCreateResponseSchema = z.object({
  data: z.object({
    matchId: z.number().int(),
    slotCount: z.number().int().nonnegative(),
  }),
});

export type LineupCreateRequest = z.infer<typeof lineupCreateRequestSchema>;
export type LineupSlotInput = z.infer<typeof lineupSlotSchema>;
