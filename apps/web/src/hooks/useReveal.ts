import type { RefObject } from 'react';
import { gsap, MQ, useGSAP } from '@/lib/gsap';

/**
 * Generic staggered fade-up for `[data-reveal]` children inside each
 * `[data-reveal-group]` within the scope. No-op under reduced motion.
 */
export function useReveal(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal-group]', scope.current).forEach((group) => {
          const items = group.querySelectorAll('[data-reveal]');
          if (!items.length) return;
          gsap.from(items, {
            y: 32,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  );
}
