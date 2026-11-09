import { ticketTypes } from '@/lib/data';
import { json } from '@/lib/http';

export function GET() {
  return json(ticketTypes, { cache: 'short' });
}
