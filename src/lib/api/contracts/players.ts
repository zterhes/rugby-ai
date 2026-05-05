import { z } from "zod";
import { listQuerySchema, paginationMetaSchema } from "@/lib/api/contracts/common";

export const playerPositionSchema = z.enum([
  "prop",
  "hooker",
  "lock",
  "flanker",
  "number8",
  "scrumhalf",
  "flyhalf",
  "centre",
  "wing",
  "fullback",
]);

export const duesStatusSchema = z.enum(["paid", "pending"]);

export const playerSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: playerPositionSchema,
  positionLabel: z.string(),
  licenseId: z.string(),
  caps: z.number().int().nonnegative(),
  email: z.string().email(),
  phone: z.string(),
  avatarUrl: z.string().url().optional(),
  duesStatus: duesStatusSchema,
});

export const playersListQuerySchema = listQuerySchema.extend({
  search: z.string().optional(),
  position: playerPositionSchema.optional(),
  duesStatus: duesStatusSchema.optional(),
});

export const playerCreateRequestSchema = z.object({
  name: z.string().trim().min(2),
  position: playerPositionSchema,
  licenseId: z.string().trim().min(3),
  caps: z.number().int().nonnegative(),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6),
  avatarUrl: z.string().trim().url().optional(),
  duesStatus: duesStatusSchema,
});

export const playerUpdateRequestSchema = playerCreateRequestSchema;

export const playersListResponseSchema = z.object({
  data: z.array(playerSchema),
  meta: paginationMetaSchema,
});

export const playerResponseSchema = z.object({ data: playerSchema });

export const playerCreateResponseSchema = z.object({
  data: playerSchema.extend({ created: z.literal(false) }),
});

export const playerUpdateResponseSchema = z.object({
  data: playerSchema.extend({ updated: z.literal(false) }),
});

export type Player = z.infer<typeof playerSchema>;
export type PlayersListQuery = z.infer<typeof playersListQuerySchema>;
export type PlayerCreateRequest = z.infer<typeof playerCreateRequestSchema>;
