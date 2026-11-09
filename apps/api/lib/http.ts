import { NextResponse } from 'next/server';
import type { ZodError } from 'zod';
import type { ApiError } from '@flower/shared';

export function json<T>(data: T, init?: ResponseInit & { cache?: 'short' | 'none' }) {
  const headers = new Headers(init?.headers);
  if (init?.cache === 'short') headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  if (init?.cache === 'none') headers.set('Cache-Control', 'no-store');
  return NextResponse.json(data, { ...init, headers });
}

export function error(status: number, message: string, issues?: ApiError['issues']) {
  const body: ApiError = issues ? { error: message, issues } : { error: message };
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function validationError(err: ZodError) {
  const flat = err.flatten();
  const issues: Record<string, string[]> = { ...flat.fieldErrors } as Record<string, string[]>;
  if (flat.formErrors.length) issues._form = flat.formErrors;
  return error(422, 'Validation failed', issues);
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}
