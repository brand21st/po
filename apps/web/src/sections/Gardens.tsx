import { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Exhibit } from '@flower/shared';
import { ArtImage } from '@/components/ArtImage';
import { Arrow } from '@/components/Button';
import { useExhibits } from '@/hooks/queries';
import { useRefreshOnChange } from '@/hooks/useRefreshOnChange';
import { gsap, MQ, useGSAP } from '@/lib/gsap';
import { useLenis } from '@/providers/SmoothScroll';

/**
 * 3 · Featured gardens.
 * Desktop + motion: pinned, vertical scroll drives horizontal travel.
 * Mobile or reduced motion: native CSS scroll-snap carousel, no pinning.
 */
export function Gardens() {
  const root = useRef<HTMLElement>(null);
  const { data: exhibits, isLoading, isError } = useExhibits();
  const lenis = useLenis();
  const count = exhibits?.length ?? 0;

  useGSAP(
    () => {
      if (!count) return;
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const section = root.current!;
        const q = gsap.utils.selector(section);
        const pinEl = q('.gardens-pin')[0] as HTMLElement;
        const viewport = q('.gardens-viewport')[0] as HTMLElement;
        const track = q('.gardens-track')[0] as HTMLElement;
        section.dataset.mode = 'pin';

        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: 5,
            anticipatePin: 1,
          },
        });

        gsap.fromTo(q('.gardens-progress'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: pinEl, start: 'top top', end: () => `+=${distance()}`, scrub: true } });

        q<HTMLElement>('.garden-card').forEach((card) => {
          const st = { trigger: card, containerAnimation: travel, start: 'left 95%', end: 'left 45%', scrub: true };
          gsap.fromTo(card.querySelector('.garden-media'), { clipPath: 'inset(18% 12% 18% 12% round 2rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 2rem)', ease: 'power2.out', scrollTrigger: st });
          gsap.fromTo(card.querySelector('.garden-img'), { scale: 1.3 }, { scale: 1, ease: 'power2.out', scrollTrigger: st });
          gsap.from(card.querySelectorAll('[data-card-text]'), { y: 30, autoAlpha: 0, stagger: 0.05, ease: 'power2.out', scrollTrigger: { ...st, end: 'left 55%' } });
        });

        // Keyboard: focusing an off-screen card scrolls the page to the matching point.
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>('.garden-card');
          const st = travel.scrollTrigger;
          if (!card || !st) return;
          viewport.scrollLeft = 0;
          const ratio = Math.min(1, Math.max(0, (card.offsetLeft - viewport.clientWidth * 0.2) / distance()));
          const y = st.start + (st.end - st.start) * ratio;
          if (lenis) lenis.scrollTo(y, { immediate: true });
          else window.scrollTo(0, y);
        };
        track.addEventListener('focusin', onFocus);

        return () => {
          track.removeEventListener('focusin', onFocus);
          delete section.dataset.mode;
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [count, lenis], revertOnUpdate: true },
  );

  useRefreshOnChange(count);

  return (
    <section ref={root} id="gardens" aria-labelledby="gardens-title" className="group/gardens relative bg-botanic text-cream">
      <div className="gardens-pin flex flex-col justify-center py-section group-data-[mode=pin]/gardens:h-screen group-data-[mode=pin]/gardens:py-0">
        <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-petal">Featured gardens</p>
            <h2 id="gardens-title" className="mt-4 text-step-4 text-balance">
              Seven worlds, grown for five days only.
            </h2>
          </div>
          <p className="max-w-sm text-step-0 text-cream/80">
            From a cathedral of roses to a meadow made for moonlight. <span className="md:hidden">Swipe to explore.</span>
          </p>
        </div>

        <div className="gardens-viewport no-scrollbar mt-12 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth group-data-[mode=pin]/gardens:snap-none group-data-[mode=pin]/gardens:overflow-hidden">
          <ul className="gardens-track flex w-max gap-6 px-6 pb-4 md:gap-10 md:px-10" role="list" aria-busy={isLoading}>
            {isLoading &&
              Array.from({ length: 4 }, (_, i) => (
                <li key={i} className="w-[78vw] max-w-[24rem] md:w-[30vw]">
                  <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-cream/10" />
                </li>
              ))}
            {isError && <li className="w-[78vw] text-cream/80">The gardens are taking a moment to load. Please refresh.</li>}
            {exhibits?.map((e, i) => <GardenCard key={e.slug} exhibit={e} index={i} total={count} />)}
          </ul>
        </div>

        <div className="container-x mt-8 hidden group-data-[mode=pin]/gardens:block" aria-hidden="true">
          <div className="h-px w-full bg-cream/15">
            <div className="gardens-progress h-px origin-left bg-petal" />
          </div>
        </div>
      </div>
    </section>
  );
}

function GardenCard({ exhibit: e, index, total }: { exhibit: Exhibit; index: number; total: number }) {
  return (
    <li className="garden-card relative w-[78vw] max-w-[26rem] shrink-0 snap-center md:w-[30vw] md:max-w-[30rem]">
      <article aria-labelledby={`garden-${e.slug}`} className="group">
        <div className="garden-media overflow-hidden rounded-[2rem]">
          <ArtImage image={e.image} className="aspect-[4/5]" imgClassName="garden-img transition-transform duration-1000 ease-expo-out group-hover:scale-105" />
        </div>
        <div className="mt-6 flex items-baseline justify-between gap-4">
          <p data-card-text className="eyebrow text-petal">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {e.zone}
          </p>
        </div>
        <h3 id={`garden-${e.slug}`} data-card-text className="mt-3 text-step-3">
          {e.name}
        </h3>
        <p data-card-text className="mt-2 text-step-0 text-cream/80">
          {e.tagline}
        </p>
        <Link
          data-card-text
          to={`/exhibits/${e.slug}`}
          className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-petal after:absolute after:inset-0 after:content-[''] hover:text-cream"
        >
          View exhibit <span className="sr-only">: {e.name}</span>
          <Arrow className="transition-transform duration-500 ease-expo-out group-hover:translate-x-1" />
        </Link>
      </article>
    </li>
  );
}

