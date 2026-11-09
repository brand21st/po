import type { OrderConfirmation } from '@flower/shared';

/**
 * Process-local storage for demo purposes. Data resets when the server restarts.
 * Replace with a real database (and a payment provider) before going live.
 */
type Store = {
  subscribers: Map<string, { email: string; firstName?: string; createdAt: string }>;
  orders: Map<string, OrderConfirmation>;
};

const g = globalThis as unknown as { __flowerStore?: Store };
export const store: Store = (g.__flowerStore ??= { subscribers: new Map(), orders: new Map() });
