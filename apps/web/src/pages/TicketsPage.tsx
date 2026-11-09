import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import { formatDay, formatPrice, OrderRequestSchema, SHOW, type OrderConfirmation, type OrderRequest } from '@flower/shared';
import { Button } from '@/components/Button';
import { useCreateOrder, useTicketTypes } from '@/hooks/queries';
import { useReveal } from '@/hooks/useReveal';
import { ApiRequestError } from '@/lib/api';

export default function TicketsPage() {
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const [params] = useSearchParams();
  const preselect = params.get('type');
  const { data: tickets, isLoading, isError } = useTicketTypes();
  const order = useCreateOrder();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<OrderRequest>({
    resolver: zodResolver(OrderRequestSchema),
    defaultValues: { name: '', email: '', visitDate: SHOW.days[0], items: [] },
  });

  useEffect(() => {
    document.title = `Tickets · ${SHOW.fullName}`;
  }, []);

  useEffect(() => {
    if (!tickets) return;
    reset((prev) => ({
      ...prev,
      items: tickets.map((t) => ({ ticketTypeId: t.id, quantity: t.id === (preselect ?? 'day') ? 1 : 0 })),
    }));
  }, [tickets, preselect, reset]);

  useReveal(root, [tickets?.length]);

  const items = watch('items');
  const total = (tickets ?? []).reduce((sum, t, i) => sum + t.price * (Number(items[i]?.quantity) || 0), 0);
  const ticketCount = items.reduce((n, i) => n + (Number(i.quantity) || 0), 0);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await order.mutateAsync(values);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError('root', { message: err instanceof ApiRequestError ? err.message : 'We couldn’t place your order. Please try again.' });
    }
  });

  if (order.isSuccess) return <Confirmation order={order.data} />;

  return (
    <div ref={root} className="bg-cream pb-section pt-[calc(var(--nav-h)+4rem)]">
      <div className="container-x">
        <header data-reveal-group className="max-w-3xl">
          <p data-reveal className="eyebrow text-petal-deep">
            Tickets · {SHOW.datesLabel}
          </p>
          <h1 data-reveal className="mt-4 text-step-5 text-balance">
            Book your visit
          </h1>
          <p data-reveal className="mt-6 text-step-1 text-ink-soft">
            Choose a day, pick your passes and you’re in. Under 5s go free.
          </p>
        </header>

        {isLoading && <p className="mt-12 text-ink-soft">Loading tickets…</p>}
        {isError && <p className="mt-12 text-ink-soft" role="alert">Tickets couldn’t load right now. Please refresh.</p>}

        {tickets && (
          <form noValidate onSubmit={onSubmit} className="mt-14 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-12">
              <fieldset data-reveal-group>
                <legend data-reveal className="font-display text-step-2">
                  1. Choose a day
                </legend>
                <div data-reveal className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {SHOW.days.map((d) => (
                    <label key={d} className="cursor-pointer">
                      <input type="radio" value={d} className="peer sr-only" {...register('visitDate')} />
                      <span className="flex min-h-[64px] flex-col items-center justify-center rounded-2xl border border-ink/15 px-3 py-3 text-center transition-colors duration-300 peer-checked:border-botanic peer-checked:bg-botanic peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-petal-deep peer-focus-visible:ring-offset-2">
                        <span className="text-step--1 font-semibold">{formatDay(d, { weekday: 'short' })}</span>
                        <span className="font-display text-step-1">{formatDay(d, { month: 'short', day: 'numeric' })}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset data-reveal-group aria-describedby={errors.items ? `${id}-items-err` : undefined}>
                <legend data-reveal className="font-display text-step-2">
                  2. Choose tickets
                </legend>
                <ul data-reveal className="mt-6 divide-y divide-ink/10 rounded-3xl bg-white/60 ring-1 ring-ink/5">
                  {tickets.map((t, i) => {
                    const qty = Number(items[i]?.quantity) || 0;
                    const set = (n: number) => setValue(`items.${i}.quantity`, Math.max(0, Math.min(t.maxPerOrder, n)), { shouldValidate: !!errors.items });
                    return (
                      <li key={t.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-display text-step-1">
                            {t.name} <span className="ml-2 font-sans text-step-0 text-ink-soft">{formatPrice(t.price, t.currency)}</span>
                          </p>
                          <p className="mt-1 text-step--1 text-ink-soft">{t.description}</p>
                        </div>
                        <div className="flex items-center gap-2" role="group" aria-label={`${t.name} quantity`}>
                          <button type="button" onClick={() => set(qty - 1)} disabled={qty === 0} aria-label={`Remove one ${t.name}`} className="h-11 w-11 rounded-full border border-ink/20 text-step-1 disabled:opacity-40">
                            −
                          </button>
                          <input type="hidden" {...register(`items.${i}.ticketTypeId`)} />
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={t.maxPerOrder}
                            aria-label={`${t.name} tickets`}
                            className="h-11 w-14 rounded-xl border border-ink/15 bg-transparent text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                            {...register(`items.${i}.quantity`, { valueAsNumber: true })}
                          />
                          <button type="button" onClick={() => set(qty + 1)} disabled={qty >= t.maxPerOrder} aria-label={`Add one ${t.name}`} className="h-11 w-11 rounded-full border border-ink/20 text-step-1 disabled:opacity-40">
                            +
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {errors.items && (
                  <p id={`${id}-items-err`} role="alert" className="mt-3 text-step--1 text-petal-deep">
                    {errors.items.message ?? errors.items.root?.message ?? 'Check your ticket quantities'}
                  </p>
                )}
              </fieldset>

              <fieldset data-reveal-group>
                <legend data-reveal className="font-display text-step-2">
                  3. Your details
                </legend>
                <div data-reveal className="mt-6 grid gap-6 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name?.message} id={`${id}-name`}>
                    <input id={`${id}-name`} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} className="input" {...register('name')} />
                  </Field>
                  <Field label="Email for your e-tickets" error={errors.email?.message} id={`${id}-email`}>
                    <input id={`${id}-email`} type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${id}-email-err` : undefined} className="input" {...register('email')} />
                  </Field>
                </div>
              </fieldset>
            </div>

            <aside className="lg:sticky lg:top-30 lg:self-start">
              <div className="rounded-[2rem] bg-botanic p-8 text-cream">
                <h2 className="font-display text-step-2">Your order</h2>
                <p className="mt-2 text-step--1 text-cream/80">{formatDay(watch('visitDate'))}</p>
                <ul className="mt-6 space-y-2 text-step--1">
                  {tickets.map((t, i) => {
                    const q = Number(items[i]?.quantity) || 0;
                    return q > 0 ? (
                      <li key={t.id} className="flex justify-between gap-4">
                        <span>
                          {q} × {t.name}
                        </span>
                        <span className="tabular-nums">{formatPrice(t.price * q, t.currency)}</span>
                      </li>
                    ) : null;
                  })}
                  {ticketCount === 0 && <li className="text-cream/70">No tickets selected yet.</li>}
                </ul>
                <div className="mt-6 flex items-baseline justify-between border-t border-cream/15 pt-6">
                  <span>Total</span>
                  <span className="font-display text-step-3 tabular-nums" aria-live="polite">
                    {formatPrice(total)}
                  </span>
                </div>
                {errors.root && (
                  <p role="alert" className="mt-4 text-step--1 text-petal">
                    {errors.root.message}
                  </p>
                )}
                <Button type="submit" variant="petal" disabled={isSubmitting} className="mt-6 w-full">
                  {isSubmitting ? 'Placing order…' : 'Confirm booking'}
                </Button>
                <p className="mt-4 text-step--1 text-cream/70">Demo checkout: no payment is taken.</p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, error, id, children }: { label: string; error?: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-step--1 font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-2 text-step--1 text-petal-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function Confirmation({ order }: { order: OrderConfirmation }) {
  return (
    <div className="flex min-h-[80svh] items-center bg-cream pb-section pt-[calc(var(--nav-h)+4rem)]">
      <AnimatePresence>
        <motion.div
          className="container-x max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          role="status"
        >
          <p className="eyebrow text-petal-deep">Booking confirmed · {order.orderId}</p>
          <h1 className="mt-4 text-step-5 text-balance">See you in the gardens, {order.name.split(' ')[0]}.</h1>
          <p className="mt-6 text-step-1 text-ink-soft">
            Your e-tickets for {formatDay(order.visitDate)} are on their way to {order.email}.
          </p>
          <ul className="mt-10 space-y-2 rounded-3xl bg-white/60 p-6 ring-1 ring-ink/5">
            {order.lines.map((l) => (
              <li key={l.ticketTypeId} className="flex justify-between">
                <span>
                  {l.quantity} × {l.name}
                </span>
                <span className="tabular-nums">{formatPrice(l.subtotal, order.currency)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-ink/10 pt-3 font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(order.total, order.currency)}</span>
            </li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/visit" className="inline-flex min-h-[44px] items-center rounded-full bg-botanic px-6 py-3 font-semibold text-cream">
              Plan your visit
            </Link>
            <Link to="/#schedule" className="inline-flex min-h-[44px] items-center rounded-full border border-ink/30 px-6 py-3 font-semibold">
              See the schedule
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
