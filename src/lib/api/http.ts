import { NextResponse } from "next/server";
import type { z } from "zod";
import { ZodError } from "zod";
import { apiErrorSchema } from "@/lib/api/contracts/common";

function mapZodFieldErrors(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 200, ...init });
}

export function created<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, { status: 201, ...init });
}

export function okList<T>(data: T, meta: { total: number; page: number; pageSize: number }) {
  return NextResponse.json({ data, meta }, { status: 200 });
}

export function badRequest(message: string, error?: ZodError) {
  const payload = apiErrorSchema.parse({
    code: "BAD_REQUEST",
    message,
    fieldErrors: error ? mapZodFieldErrors(error) : undefined,
  });
  return NextResponse.json(payload, { status: 400 });
}

export function notFound(message: string) {
  const payload = apiErrorSchema.parse({ code: "NOT_FOUND", message });
  return NextResponse.json(payload, { status: 404 });
}

export async function parseJson<T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<{ success: true; data: z.infer<T> } | { success: false; response: NextResponse }> {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return { success: false, response: badRequest("Invalid request body", parsed.error) };
  }
  return { success: true, data: parsed.data };
}

export function parseSearchParams<T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): { success: true; data: z.infer<T> } | { success: false; response: NextResponse } {
  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, response: badRequest("Invalid query parameters", parsed.error) };
  }
  return { success: true, data: parsed.data };
}
