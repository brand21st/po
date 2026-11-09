import { json } from '@/lib/http';

export const dynamic = 'force-dynamic';

export function GET() {
  return json({ ok: true, time: new Date().toISOString() }, { cache: 'none' });
}
