import { useRef } from 'react';
import { SHOW } from '@flower/shared';
import { Arrow, ButtonLink } from '@/components/Button';
import { BloomSvg } from '@/components/BloomSvg';
import { PetalField } from '@/components/PetalField';
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * 1 · "The Bloom" — pinned hero.
 * Scroll scrubs: bud → open flower, light glow blooms, title drifts away,
 * then a cream wash grows from the flower's heart into the next section.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const letters = SHOW.name.split('');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);

        // Load-in: title letter by letter, then supporting copy.
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          .from(q('.hero-letter'), { yPercent: 115, rotate: 8, autoAlpha: 0, duration: 1.2, stagger: 0.07 }, 0.15)
          .from(q('[data-hero-fade]'), { y: 24, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.6)
          .from(q('.hero-cue'), { autoAlpha: 0, duration: 0.8 }, 1.1);

        // Closed bud state.
        const petals = q<SVGPathElement>('.bloom-petal');
        petals.forEach((p) => {
          const a = Number(p.dataset.angle);
          gsap.set(p, { rotation: a * 0.08, scale: 0.14, transformOrigin: '50% 100%' });
        });
        gsap.set(q('.bloom-rotor'), { rotation: -20, svgOrigin: '0 0' });
        gsap.set(q('.bloom-center'), { scale: 0.3, svgOrigin: '0 0' });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 1,
            refreshPriority: 10,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
          },
        });

        tl.to(q('.hero-copy'), { yPercent: -35, autoAlpha: 0, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' }, 0)
          .to(q('.bloom-rotor'), { rotation: 0, duration: 0.8, ease: 'power2.out' }, 0)
          .to(q('.bloom-center'), { scale: 1, duration: 0.5, ease: 'power2.out' }, 0.1)
          .to(q('.hero-glow'), { scale: 1.35, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0);

        q<SVGGElement>('.bloom-layer').forEach((layer, li) => {
          const lp = layer.querySelectorAll<SVGPathElement>('.bloom-petal');
          lp.forEach((p) => {
            tl.to(p, { rotation: Number(p.dataset.angle), scale: 1, duration: 0.5, ease: 'expo.out' }, 0.06 + li * 0.07);
          });
        });

        tl.to(q('.hero-bloom'), { scale: 1.15, duration: 0.3, ease: 'power1.in' }, 0.62).fromTo(
          q('.hero-wash'),
          { scale: 0 },
          { scale: 1, duration: 0.3, ease: 'power2.in' },
          0.7,
        );

        // Scroll cue fades out on first scroll.
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top-=8',
          once: true,
          onEnter: () => gsap.to(q('.hero-cue'), { autoAlpha: 0, y: 12, duration: 0.6 }),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-botanic text-cream">
      {/* Centring wrappers carry the CSS translate; GSAP animates the inner nodes only. */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[42%] h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2">
        <div
          className="hero-glow h-full w-full scale-[0.45] opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(255,236,214,0.42) 0%, rgba(235,169,183,0.18) 32%, rgba(31,61,43,0) 62%)' }}
        />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[42%] w-[min(118vmin,1100px)] -translate-x-1/2 -translate-y-1/2">
        <div className="hero-bloom">
          <BloomSvg className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      <PetalField progress={progress} />

      {/* Cream wash that hands off to the Story section */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[42%] h-[190vmax] w-[190vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="hero-wash h-full w-full scale-0 rounded-full bg-cream" />
      </div>

      <div className="hero-copy container-x relative flex h-full flex-col items-center justify-end pb-[14svh] text-center">
        <p data-hero-fade className="eyebrow text-petal">
          {SHOW.edition} · {SHOW.datesLabel}
        </p>
        <h1 id="hero-title" className="mt-4 text-step-6 font-light leading-none tracking-[-0.04em]">
          <span className="sr-only">{SHOW.fullName}</span>
          <span aria-hidden="true" className="inline-flex overflow-clip pb-[0.12em] pt-[0.04em]">
            {letters.map((l, i) => (
              <span key={i} className="hero-letter inline-block will-change-transform">
                {l === ' ' ? ' ' : l}
              </span>
            ))}
          </span>
        </h1>
        <p data-hero-fade className="mt-2 max-w-xl text-step-1 text-cream/85 text-balance">
          {SHOW.tagline} {SHOW.venue.name}, {SHOW.venue.city}.
        </p>
        <div data-hero-fade className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/tickets" variant="petal">
            Buy tickets <Arrow />
          </ButtonLink>
          <ButtonLink to="/#gardens" variant="ghost" className="text-cream">
            Explore the gardens
          </ButtonLink>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center" aria-hidden="true">
        <div className="hero-cue flex flex-col items-center gap-2 text-step--1 text-cream/75">
          <span>Scroll to explore</span>
          <span className="relative block h-10 w-px overflow-hidden bg-cream/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_2.2s_ease-in-out_infinite] bg-cream" />
          </span>
        </div>
      </div>
    </section>
  );
}
