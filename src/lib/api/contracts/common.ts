import { z } from "@/lib/api/zod-openapi";

export const apiErrorCodeSchema = z.enum([
  "BAD_REQUEST",
  "NOT_FOUND",
  "METHOD_NOT_ALLOWED",
  "INTERNAL_ERROR",
]);

export const apiFieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

export const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string(),
  fieldErrors: z.array(apiFieldErrorSchema).optional(),
  requestId: z.string().optional(),
});

export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const dateIsoSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD date string");

export type ApiError = z.infer<typeof apiErrorSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;
