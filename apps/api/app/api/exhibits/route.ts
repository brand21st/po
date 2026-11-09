import { exhibits } from '@/lib/data';
import { json } from '@/lib/http';

export const dynamic = 'force-dynamic';

/** GET /api/exhibits?featured=true */
export function GET(req: Request) {
  const featured = new URL(req.url).searchParams.get('featured');
  const list = featured === 'true' ? exhibits.filter((e) => e.featured) : exhibits;
  return json(list, { cache: 'short' });
}
