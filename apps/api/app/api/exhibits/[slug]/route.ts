import { exhibits } from '@/lib/data';
import { error, json } from '@/lib/http';

export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const exhibit = exhibits.find((e) => e.slug === params.slug);
  if (!exhibit) return error(404, 'Exhibit not found');
  return json(exhibit, { cache: 'short' });
}

export function generateStaticParams() {
  return exhibits.map((e) => ({ slug: e.slug }));
}
