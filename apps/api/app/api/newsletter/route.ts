import { NewsletterRequestSchema, type NewsletterResponse } from '@flower/shared';
import { json, readJson, validationError } from '@/lib/http';
import { store } from '@/lib/store';

/** POST /api/newsletter — idempotent signup (re-subscribing is not an error). */
export async function POST(req: Request) {
  const parsed = NewsletterRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return validationError(parsed.error);

  const email = parsed.data.email.toLowerCase();
  const already = store.subscribers.has(email);
  if (!already) {
    store.subscribers.set(email, { email, firstName: parsed.data.firstName || undefined, createdAt: new Date().toISOString() });
  }
  const body: NewsletterResponse = {
    ok: true,
    message: already ? 'You’re already on the list — see you in the gardens.' : 'You’re in. First news arrives with the spring buds.',
  };
  return json(body, { status: already ? 200 : 201, cache: 'none' });
}
