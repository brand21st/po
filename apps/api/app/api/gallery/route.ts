import { gallery } from '@/lib/data';
import { json } from '@/lib/http';

export function GET() {
  return json(gallery, { cache: 'short' });
}
