import { ShowDaySchema } from '@flower/shared';
import { events } from '@/lib/data';
import { error, json } from '@/lib/http';

export const dynamic = 'force-dynamic';

/** GET /api/events?day=2027-05-13 (day optional) */
export function GET(req: Request) {
  const day = new URL(req.url).searchParams.get('day');
  if (day === null) return json(events, { cache: 'short' });
  const parsed = ShowDaySchema.safeParse(day);
  if (!parsed.success) return error(400, 'Unknown show day');
  return json(events.filter((e) => e.day === parsed.data), { cache: 'short' });
}
