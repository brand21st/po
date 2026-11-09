import { useRef } from 'react';
import { BloomSvg } from '@/components/BloomSvg';
import { NewsletterForm } from '@/components/NewsletterForm';
import { useReveal } from '@/hooks/useReveal';
import { gsap, MQ, useGSAP } from '@/lib/gsap';
import { useLocomotiveParallax } from '@/providers/SmoothScroll';

/** 9 · Newsletter: a slowly turning bloom behind the signup. */
export function Newsletter() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  useLocomotiveParallax(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo('.nl-bloom', { rotate: -40, scale: 0.8 }, { rotate: 40, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="newsletter" aria-labelledby="newsletter-title" className="relative overflow-hidden bg-botanic py-section text-cream">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[20vw] top-1/2 w-[70vw] max-w-[900px] -translate-y-1/2 opacity-20">
        <div data-scroll data-scroll-speed="0.25">
          <div className="nl-bloom">
            <BloomSvg className="h-auto w-full" />
          </div>
        </div>
      </div>
      <div className="container-x relative grid gap-12 md:grid-cols-2 md:items-center">
        <header data-reveal-group>
          <p data-reveal className="eyebrow text-petal">
            Newsletter
          </p>
          <h2 data-reveal id="newsletter-title" className="mt-4 text-step-4 text-balance">
            Be first through the gates.
          </h2>
          <p data-reveal className="mt-6 max-w-md text-step-1 text-cream/80">
            Early-bird tickets, garden reveals and a monthly planting calendar. A few letters a season, never more.
          </p>
        </header>
        <div data-reveal-group>
          <div data-reveal>
            <NewsletterForm tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
