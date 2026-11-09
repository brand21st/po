import { useMemo, useRef } from 'react';
import { formatDay, type EventItem } from '@flower/shared';
import { SectionHeading } from '@/components/SectionHeading';
import { useEvents } from '@/hooks/queries';
import { useRefreshOnChange } from '@/hooks/useRefreshOnChange';
import { useReveal } from '@/hooks/useReveal';
import { gsap, MQ, useGSAP } from '@/lib/gsap';

const CATEGORY_LABEL: Record<EventItem['category'], string> = {
  ceremony: 'Ceremony',
  talk: 'Talk',
  workshop: 'Workshop',
  tour: 'Guided walk',
  performance: 'Performance',
};

/** 6 · Schedule: a vine grows down the timeline (stroke-dashoffset scrubbed to scroll). */
export function Schedule() {
  const root = useRef<HTMLElement>(null);
  const { data: events, isLoading, isError, refetch } = useEvents();

  const days = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const e of events ?? []) map.set(e.day, [...(map.get(e.day) ?? []), e]);
    return [...map.entries()];
  }, [events]);

  useReveal(root);

  useGSAP(
    () => {
      if (!days.length) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const list = q('.timeline')[0] as HTMLElement;

        gsap.fromTo(q('.vine-path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 } });

        q<HTMLElement>('.timeline-item').forEach((item) => {
          gsap.from(item, { x: 40, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 85%', once: true } });
          const bud = item.querySelector('.timeline-bud');
          if (bud) gsap.from(bud, { scale: 0, rotate: -90, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: item, start: 'top 75%', once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [days.length], revertOnUpdate: true },
  );

  useRefreshOnChange(days.length);

  return (
    <section ref={root} id="schedule" aria-labelledby="schedule-title" className="bg-cream py-section">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.5fr]">
        <div className="lg:sticky lg:top-30 lg:self-start">
          <SectionHeading id="schedule-title" eyebrow="Schedule" title="Five days of talks, walks and wonder." intro="Every event is included with your ticket unless marked otherwise. Workshops have limited places: arrive early." />
        </div>

        <div className="timeline relative">
          {/* Vine */}
          <svg aria-hidden="true" className="absolute left-[11px] top-0 h-full w-6 overflow-visible" viewBox="0 0 24 1000" preserveAspectRatio="none">
            <path d="M12 0 C 24 120, 0 220, 12 340 S 24 560, 12 680 S 0 880, 12 1000" fill="none" stroke="rgb(var(--c-botanic) / 0.12)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path
              className="vine-path"
              d="M12 0 C 24 120, 0 220, 12 340 S 24 560, 12 680 S 0 880, 12 1000"
              fill="none"
              stroke="rgb(var(--c-botanic-soft))"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {isLoading && <p className="pl-14 text-ink-soft" aria-live="polite">Loading the programme…</p>}
          {isError && (
            <p className="pl-14 text-ink-soft" role="alert">
              We couldn’t load the schedule.{' '}
              <button type="button" className="font-semibold text-petal-deep underline" onClick={() => refetch()}>
                Try again
              </button>
            </p>
          )}

          <ol className="space-y-16">
            {days.map(([day, items]) => (
              <li key={day}>
                <h3 className="timeline-item pl-14 font-display text-step-2">{formatDay(day)}</h3>
                <ol className="mt-6 space-y-6">
                  {items.map((e) => (
                    <li key={e.id} className="timeline-item relative pl-14">
                      <span aria-hidden="true" className="timeline-bud absolute left-[3px] top-6 block h-6 w-6 rounded-full border-2 border-cream bg-petal shadow-[0_0_0_4px_rgb(var(--c-petal)/0.25)]" />
                      <article className="rounded-3xl bg-white/60 p-6 ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_20px_50px_-30px_rgb(var(--c-botanic)/0.5)]">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-step--1">
                          <time className="font-semibold tabular-nums text-botanic" dateTime={`${e.day}T${e.start}`}>
                            {e.start} – {e.end}
                          </time>
                          <span className="rounded-full bg-petal-soft px-3 py-0.5 font-medium text-petal-deep">{CATEGORY_LABEL[e.category]}</span>
                          <span className="text-ink-soft">{e.location}</span>
                        </div>
                        <h4 className="mt-3 font-display text-step-1">{e.title}</h4>
                        <p className="mt-2 text-ink-soft">{e.description}</p>
                        {e.host && <p className="mt-3 text-step--1 text-ink-soft">With {e.host}</p>}
                      </article>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
