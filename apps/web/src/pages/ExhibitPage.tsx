import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SHOW } from '@flower/shared';
import { ArtImage } from '@/components/ArtImage';
import { Arrow, ButtonLink } from '@/components/Button';
import { useExhibit, useExhibits } from '@/hooks/queries';
import { useRefreshOnChange } from '@/hooks/useRefreshOnChange';
import { useReveal } from '@/hooks/useReveal';
import { ApiRequestError } from '@/lib/api';
import { gsap, MQ, useGSAP } from '@/lib/gsap';

export default function ExhibitPage() {
  const { slug = '' } = useParams();
  const root = useRef<HTMLDivElement>(null);
  const { data: exhibit, isLoading, error } = useExhibit(slug);
  const { data: all } = useExhibits();
  const others = (all ?? []).filter((e) => e.slug !== slug).slice(0, 3);

  useEffect(() => {
    if (exhibit) document.title = `${exhibit.name} · ${SHOW.fullName}`;
  }, [exhibit]);

  useReveal(root, [exhibit?.slug, others.length]);
  useRefreshOnChange(exhibit?.slug, others.length);

  useGSAP(
    () => {
      if (!exhibit) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo('.exhibit-media', { clipPath: 'inset(12% 8% 12% 8% round 2.5rem)' }, { clipPath: 'inset(0% 0% 0% 0% round 2.5rem)', duration: 1.4, ease: 'expo.out' });
        gsap.fromTo('.exhibit-img', { scale: 1.25 }, { scale: 1, duration: 1.8, ease: 'expo.out' });
        gsap.to('.exhibit-img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.exhibit-media', start: 'top top', end: 'bottom top', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [exhibit?.slug], revertOnUpdate: true },
  );

  if (isLoading) return <div className="min-h-screen bg-cream pt-[calc(var(--nav-h)+4rem)]" aria-busy="true" />;

  if (error || !exhibit) {
    const notFound = error instanceof ApiRequestError && error.status === 404;
    return (
      <div className="container-x flex min-h-[70svh] flex-col justify-center pt-[var(--nav-h)]">
        <h1 className="text-step-4">{notFound ? 'We couldn’t find that garden.' : 'This garden is taking a moment to load.'}</h1>
        <Link to="/#gardens" className="mt-6 font-semibold text-petal-deep underline">
          Back to all gardens
        </Link>
      </div>
    );
  }

  return (
    <div ref={root} className="bg-cream">
      <article aria-labelledby="exhibit-title" className="pb-section pt-[calc(var(--nav-h)+3rem)]">
        <div className="container-x">
          <Link to="/#gardens" className="inline-flex min-h-[44px] items-center gap-2 text-step--1 font-semibold text-ink-soft hover:text-ink">
            <Arrow className="rotate-180" /> All gardens
          </Link>
          <header data-reveal-group className="mt-6 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
            <div>
              <p data-reveal className="eyebrow text-petal-deep">
                {exhibit.zone} · {exhibit.bloomSeason} bloom
              </p>
              <h1 data-reveal id="exhibit-title" className="mt-4 text-step-5 text-balance">
                {exhibit.name}
              </h1>
            </div>
            <p data-reveal className="text-step-1 text-ink-soft">
              {exhibit.tagline}
            </p>
          </header>
        </div>

        <div className="container-x mt-12">
          <div className="exhibit-media overflow-hidden rounded-[2.5rem]">
            <ArtImage image={exhibit.image} eager className="aspect-[4/5] max-h-[85svh] w-full md:aspect-[16/10]" imgClassName="exhibit-img" />
          </div>
        </div>

        <div className="container-x mt-16 grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div data-reveal-group className="space-y-6 text-step-1 text-ink-soft">
            {exhibit.description.map((p, i) => (
              <p data-reveal key={i} className="text-pretty">
                {p}
              </p>
            ))}
            <p data-reveal className="text-step-0">
              Designed by <span className="font-semibold text-ink">{exhibit.designer}</span>
            </p>
          </div>
          <aside data-reveal-group className="rounded-[2rem] bg-botanic p-8 text-cream">
            <h2 data-reveal className="font-display text-step-2">
              Highlights
            </h2>
            <ul className="mt-6 space-y-3">
              {exhibit.highlights.map((h) => (
                <li data-reveal key={h} className="flex gap-3">
                  <span aria-hidden="true" className="text-petal">✿</span>
                  {h}
                </li>
              ))}
            </ul>
            <ButtonLink data-reveal to="/tickets" variant="petal" className="mt-8">
              Get tickets <Arrow />
            </ButtonLink>
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section aria-labelledby="more-title" className="border-t border-ink/10 py-section">
          <div className="container-x">
            <h2 id="more-title" className="text-step-3">
              More gardens
            </h2>
            <ul data-reveal-group className="mt-10 grid gap-8 sm:grid-cols-3" role="list">
              {others.map((o) => (
                <li data-reveal key={o.slug} className="group relative">
                  <ArtImage image={o.image} className="aspect-[4/5] rounded-[1.5rem]" imgClassName="transition-transform duration-1000 ease-expo-out group-hover:scale-105" />
                  <h3 className="mt-4 font-display text-step-1">
                    <Link to={`/exhibits/${o.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {o.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-step--1 text-ink-soft">{o.tagline}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
