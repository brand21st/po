import { useRef } from 'react';
import { formatPrice, SHOW } from '@flower/shared';
import { Arrow, ButtonLink } from '@/components/Button';
import { useTicketTypes } from '@/hooks/queries';
import { useRefreshOnChange } from '@/hooks/useRefreshOnChange';
import { gsap, MQ, useGSAP } from '@/lib/gsap';

/** 8 · Tickets: curtains part to reveal the passes. Primary conversion point on the page. */
export function TicketsCta() {
  const root = useRef<HTMLElement>(null);
  const { data: tickets } = useTicketTypes();
  const count = tickets?.length ?? 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 25%', scrub: 0.8 } });
        tl.fromTo(q('.curtain-l'), { xPercent: 0 }, { xPercent: -101, ease: 'power2.inOut' }, 0).fromTo(q('.curtain-r'), { xPercent: 0 }, { xPercent: 101, ease: 'power2.inOut' }, 0);
        if (count) {
          gsap.from(q('.ticket-card'), { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: q('.ticket-grid')[0], start: 'top 80%', once: true } });
        }
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [count], revertOnUpdate: true },
  );

  useRefreshOnChange(count);

  return (
    <section ref={root} id="tickets" aria-labelledby="tickets-title" className="relative overflow-hidden bg-petal-soft py-section">
      {/* Curtains (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden motion-safe:block">
        <div className="curtain-l absolute inset-y-0 left-0 w-1/2 bg-botanic" />
        <div className="curtain-r absolute inset-y-0 right-0 w-1/2 bg-botanic" />
      </div>

      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-petal-deep">Tickets · {SHOW.datesLabel}</p>
            <h2 id="tickets-title" className="mt-4 text-step-4 text-balance">
              Choose your way into the gardens.
            </h2>
          </div>
          <ButtonLink to="/tickets" variant="primary">
            Book tickets <Arrow />
          </ButtonLink>
        </div>

        <ul className="ticket-grid mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {(tickets ?? []).map((t) => (
            <li
              key={t.id}
              className={`ticket-card relative flex flex-col rounded-[2rem] p-8 ${t.highlight ? 'bg-botanic text-cream' : 'bg-cream text-ink ring-1 ring-ink/5'}`}
            >
              {t.highlight && <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-step--1 font-semibold text-ink">Most loved</span>}
              <h3 className="font-display text-step-2">{t.name}</h3>
              <p className={`mt-2 text-step--1 ${t.highlight ? 'text-cream/80' : 'text-ink-soft'}`}>{t.description}</p>
              <p className="mt-6 font-display text-step-4 font-light">{formatPrice(t.price, t.currency)}</p>
              <ul className={`mt-6 space-y-2 text-step--1 ${t.highlight ? 'text-cream/85' : 'text-ink-soft'}`}>
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span aria-hidden="true" className={t.highlight ? 'text-petal' : 'text-petal-deep'}>✿</span>
                    {p}
                  </li>
                ))}
              </ul>
              <ButtonLink to={`/tickets?type=${t.id}`} variant={t.highlight ? 'petal' : 'ghost'} className="mt-8 self-start">
                Select <span className="sr-only">{t.name}</span>
              </ButtonLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
