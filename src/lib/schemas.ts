import z from "zod";

export const matchFlowSchema = z.enum([
  "lineup_story",
  "lineup_post",
  "result_story",
  "result_post",
]);

export type MatchFlow = z.infer<typeof matchFlowSchema>;

export const playerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  jerseyNumber: z.number().int().positive().max(99),
});

export type Player = z.infer<typeof playerSchema>;

export const extractMatchDataInputSchema = z.object({
  flow: matchFlowSchema,
  sourceText: z.string().min(1),
});

export const extractMatchDataOutputSchema = z.object({
  flow: matchFlowSchema,
  players: z.array(playerSchema).optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  homeTeam: z.string().optional(),
  awayTeam: z.string().optional(),
  homeScore: z.number().int().nonnegative().optional(),
  awayScore: z.number().int().nonnegative().optional(),
  homeLogoUrl: z.string().url().optional(),
  awayLogoUrl: z.string().url().optional(),
  confidence: z.number().min(0).max(1),
  missingFields: z.array(z.string()),
});

export type ExtractMatchDataOutput = z.infer<typeof extractMatchDataOutputSchema>;

const lineupPayloadSchema = z.object({
  players: z.array(playerSchema).min(1).max(23),
  date: z.string().min(1),
  time: z.string().min(1),
  location: z.string().min(1),
});

const resultPayloadSchema = z.object({
  homeTeam: z.string().min(1),
  awayTeam: z.string().min(1),
  homeScore: z.number().int().nonnegative(),
  awayScore: z.number().int().nonnegative(),
  homeLogoUrl: z.string().url().optional(),
  awayLogoUrl: z.string().url().optional(),
  date: z.string().optional(),
  location: z.string().optional(),
});

export const renderMatchImageInputSchema = z
  .object({
    flow: matchFlowSchema,
    templateKey: z.string().min(1),
    payload: z.union([lineupPayloadSchema, resultPayloadSchema]),
    branding: z
      .object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((value, ctx) => {
    const isLineupFlow = value.flow.startsWith("lineup_");
    const hasPlayers = "players" in value.payload;
    if (isLineupFlow && !hasPlayers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Lineup flow requires lineup payload",
      });
    }
    if (!isLineupFlow && hasPlayers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Result flow requires result payload",
      });
    }
  });

export type RenderMatchImageInput = z.infer<typeof renderMatchImageInputSchema>;

export const renderMatchImageOutputSchema = z.object({
  imageUrl: z.string().url(),
  imagePath: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  flow: matchFlowSchema,
  provider: z.literal("local"),
});

export type RenderMatchImageOutput = z.infer<typeof renderMatchImageOutputSchema>;
