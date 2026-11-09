import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Data-driven sections change page height after load. Re-measure every
 * ScrollTrigger (pins included) on the next frame so everything below stays in sync.
 */
export function useRefreshOnChange(...deps: unknown[]) {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
