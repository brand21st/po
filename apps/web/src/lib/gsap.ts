import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// House motion language: graceful, never bouncy.
gsap.defaults({ ease: 'power2.out', duration: 0.9 });
ScrollTrigger.config({ ignoreMobileResize: true });

/** Media queries used with gsap.matchMedia() across sections. */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 768px)',
  mobile: '(max-width: 767.98px)',
} as const;

export { gsap, ScrollTrigger, SplitText, useGSAP };
