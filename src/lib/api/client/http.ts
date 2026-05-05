import { z } from "zod";
import { apiErrorSchema, type ApiError } from "@/lib/api/contracts/common";

export class ApiClientError extends Error {
  status: number;
  payload?: ApiError;

  constructor(message: string, status: number, payload?: ApiError) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.payload = payload;
  }
}

function withQuery(path: string, query?: Record<string, string | number | undefined>) {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

async function parseError(res: Response): Promise<ApiError | undefined> {
  const json = await res.json().catch(() => null);
  const parsed = apiErrorSchema.safeParse(json);
  return parsed.success ? parsed.data : undefined;
}

export async function apiGet<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
  query?: Record<string, string | number | undefined>,
): Promise<z.infer<T>> {
  const res = await fetch(withQuery(path, query), { method: "GET" });
  if (!res.ok) {
    const payload = await parseError(res);
    throw new ApiClientError(payload?.message ?? "Request failed", res.status, payload);
  }
  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiClientError("Invalid API response", 500);
  }
  return parsed.data;
}

export async function apiSend<TReq, TRes extends z.ZodTypeAny>(
  method: "POST" | "PATCH",
  path: string,
  body: TReq,
  schema: TRes,
): Promise<z.infer<TRes>> {
  const res = await fetch(path, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const payload = await parseError(res);
    throw new ApiClientError(payload?.message ?? "Request failed", res.status, payload);
  }

  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiClientError("Invalid API response", 500);
  }
  return parsed.data;
}
