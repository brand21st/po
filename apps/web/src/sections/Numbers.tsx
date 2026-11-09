import { useRef } from 'react';
import { SHOW } from '@flower/shared';
import { gsap, MQ, useGSAP } from '@/lib/gsap';

const fmt = new Intl.NumberFormat('en-US');

/** 5 · Numbers that bloom: counters animate once on enter; screen readers get the final value. */
export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        q<HTMLElement>('[data-count]').forEach((el, i) => {
          const target = Number(el.dataset.count);
          const obj = { v: 0 };
          el.textContent = '0';
          gsap.to(obj, {
            v: target,
            duration: 2.2,
            delay: i * 0.12,
            ease: 'expo.out',
            onUpdate: () => {
              el.textContent = fmt.format(Math.round(obj.v));
            },
            scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
          });
        });
        gsap.from(q('.stat'), {
          y: 40,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
        });
        gsap.from(q('.stat-rule'), { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } });
        // On revert (unmount / motion preference change) show final values again.
        return () => q<HTMLElement>('[data-count]').forEach((el) => (el.textContent = fmt.format(Number(el.dataset.count))));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="numbers-title" className="bg-botanic py-section text-cream">
      <div className="container-x">
        <p className="eyebrow text-petal">In numbers</p>
        <h2 id="numbers-title" className="mt-4 max-w-2xl text-step-4 text-balance">
          A show that grows every year.
        </h2>
        <dl className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {SHOW.stats.map((s) => (
            <div key={s.id} className="stat">
              <div className="stat-rule h-px w-full bg-cream/25" />
              <dt className="mt-6 text-step--1 text-cream/80">{s.label}</dt>
              <dd className="mt-2 font-display text-step-5 font-light tabular-nums text-petal">
                <span className="sr-only">
                  {fmt.format(s.value)}
                  {s.suffix}
                </span>
                <span aria-hidden="true">
                  <span data-count={s.value}>{fmt.format(s.value)}</span>
                  {s.suffix}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
