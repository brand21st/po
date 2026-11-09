import { useRef, type CSSProperties } from 'react';
import type { Exhibit } from '@flower/shared';
import { ArtImage } from '@/components/ArtImage';
import { useExhibits } from '@/hooks/queries';
import { gsap, MQ, useGSAP } from '@/lib/gsap';
import { useLocomotiveParallax } from '@/providers/SmoothScroll';

const SEASONS: Array<{ id: Exhibit['bloomSeason']; name: string; title: string; copy: string; bg: string; accent: string }> = [
  {
    id: 'spring',
    name: 'Spring',
    title: 'Blush, bud and first light.',
    copy: 'Peonies and irises open in soft pinks and lilacs: the show begins where the year does.',
    bg: '#F8E1E6',
    accent: '#A83D56',
  },
  {
    id: 'summer',
    name: 'Summer',
    title: 'Gold, roses and long evenings.',
    copy: 'Climbing roses, prairie gold and a meadow planted for moonlight. Stay late; it gets better.',
    bg: '#F5E7BE',
    accent: '#7A5A1E',
  },
  {
    id: 'autumn',
    name: 'Autumn',
    title: 'Copper, ember and dark velvet.',
    copy: 'A preview of the season’s finale: dahlias in flame tones and a conservatory lit low and warm.',
    bg: '#EFD2BC',
    accent: '#8A3B1F',
  },
];

/** 4 · Colour journey: the section background tweens between season palettes via CSS variables. */
export function Seasons() {
  const root = useRef<HTMLElement>(null);
  const { data: exhibits } = useExhibits();
  useLocomotiveParallax(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const panels = q<HTMLElement>('.season-panel');

        panels.forEach((panel, i) => {
          if (i === 0) return;
          const s = SEASONS[i]!;
          const prev = SEASONS[i - 1]!;
          gsap.fromTo(
            root.current,
            { '--season-bg': prev.bg, '--season-accent': prev.accent },
            {
              '--season-bg': s.bg,
              '--season-accent': s.accent,
              ease: 'none',
              immediateRender: false,
              scrollTrigger: { trigger: panel, start: 'top 75%', end: 'top 25%', scrub: true },
            },
          );
        });

        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll('[data-season-text]'), {
            y: 40,
            autoAlpha: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.1,
            scrollTrigger: { trigger: panel, start: 'top 65%', once: true },
          });
          // Vertical drift comes from Locomotive (data-scroll-speed); GSAP adds a gentle tilt.
          const media = panel.querySelector('.season-media');
          if (media) {
            gsap.fromTo(media, { rotate: -2 }, { rotate: 2, ease: 'none', scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true } });
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="seasons-title"
      className="relative bg-[var(--season-bg)] text-ink"
      style={{ '--season-bg': SEASONS[0]!.bg, '--season-accent': SEASONS[0]!.accent } as CSSProperties}
    >
      <h2 id="seasons-title" className="sr-only">
        A journey through the seasons
      </h2>
      {SEASONS.map((s, i) => {
        const img = exhibits?.find((e) => e.bloomSeason === s.id)?.image;
        return (
          <article
            key={s.id}
            aria-labelledby={`season-${s.id}`}
            // Reduced motion: each panel carries its own colour instead of the tween.
            className="season-panel flex min-h-[90svh] items-center py-section motion-reduce:bg-[var(--panel-bg)]"
            style={{ '--panel-bg': s.bg } as CSSProperties}
          >
            <div className={`container-x grid items-center gap-12 md:grid-cols-2 md:gap-20 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <p data-season-text className="eyebrow text-[var(--season-accent)] motion-reduce:text-[color:var(--panel-accent)]" style={{ '--panel-accent': s.accent } as CSSProperties}>
                  {String(i + 1).padStart(2, '0')} · Season
                </p>
                <h3 id={`season-${s.id}`} data-season-text className="mt-3 font-display text-step-6 font-light italic text-[var(--season-accent)] motion-reduce:text-[color:var(--panel-accent)]" style={{ '--panel-accent': s.accent } as CSSProperties}>
                  {s.name}
                </h3>
                <p data-season-text className="mt-6 font-display text-step-3">
                  {s.title}
                </p>
                <p data-season-text className="mt-4 max-w-md text-step-1 text-ink-soft">
                  {s.copy}
                </p>
              </div>
              <div className="mx-auto w-full max-w-md" data-scroll data-scroll-speed={i % 2 ? 0.08 : 0.14}>
              <div className="season-media will-change-transform">
                {img ? (
                  <ArtImage image={img} className="aspect-[4/5] rounded-full shadow-[0_40px_80px_-40px_rgb(var(--c-ink)/0.45)]" />
                ) : (
                  <div className="aspect-[4/5] rounded-full bg-ink/5" />
                )}
              </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
