import { randomUUID } from 'node:crypto';
import { OrderRequestSchema, SHOW, type OrderConfirmation } from '@flower/shared';
import { ticketTypes } from '@/lib/data';
import { error, json, readJson, validationError } from '@/lib/http';
import { store } from '@/lib/store';

/**
 * POST /api/orders — creates a demo order. Prices are always computed
 * server-side from the ticket catalogue; the client only sends quantities.
 * No payment is taken: connect a payment provider before launch.
 */
export async function POST(req: Request) {
  const parsed = OrderRequestSchema.safeParse(await readJson(req));
  if (!parsed.success) return validationError(parsed.error);

  const lines: OrderConfirmation['lines'] = [];
  for (const item of parsed.data.items) {
    if (item.quantity === 0) continue;
    const type = ticketTypes.find((t) => t.id === item.ticketTypeId);
    if (!type) return error(422, `Unknown ticket type: ${item.ticketTypeId}`);
    if (item.quantity > type.maxPerOrder) return error(422, `Up to ${type.maxPerOrder} ${type.name} tickets per order`);
    lines.push({ ticketTypeId: type.id, name: type.name, quantity: item.quantity, unitPrice: type.price, subtotal: type.price * item.quantity });
  }

  const order: OrderConfirmation = {
    orderId: `PPL-${randomUUID().slice(0, 8).toUpperCase()}`,
    name: parsed.data.name,
    email: parsed.data.email,
    visitDate: parsed.data.visitDate,
    lines,
    total: lines.reduce((s, l) => s + l.subtotal, 0),
    currency: ticketTypes[0]?.currency ?? SHOW.currency,
    createdAt: new Date().toISOString(),
  };
  store.orders.set(order.orderId, order);
  return json(order, { status: 201, cache: 'none' });
}
