import type { ZodType } from 'zod';
import { ApiErrorSchema, type ApiError } from '@flower/shared';

/** Empty in dev → same-origin requests through the Vite proxy. */
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public body: ApiError,
  ) {
    super(body.error);
  }
}

/** Resolve an API-relative asset path (e.g. `/api/art/x`) to a full URL. */
export const assetUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${API_URL}${path}`);

async function handle<T>(res: Response, schema: ZodType<T>): Promise<T> {
  const data: unknown = await res.json().catch(() => undefined);
  if (!res.ok) {
    const parsed = ApiErrorSchema.safeParse(data);
    throw new ApiRequestError(res.status, parsed.success ? parsed.data : { error: `Request failed (${res.status})` });
  }
  // Validate responses against the shared contract.
  return schema.parse(data);
}

export async function getJson<T>(path: string, schema: ZodType<T>, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' }, signal });
  return handle(res, schema);
}

export async function postJson<T>(path: string, body: unknown, schema: ZodType<T>): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  return handle(res, schema);
}
