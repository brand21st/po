import type Lenis from 'lenis';
import LocomotiveScroll from 'locomotive-scroll';
import { createContext, useContext, useEffect, useState, type ReactNode, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type ScrollCtx = { loco: LocomotiveScroll | null; lenis: Lenis | null };
const ScrollContext = createContext<ScrollCtx>({ loco: null, lenis: null });

/** The Lenis instance Locomotive runs on (null under reduced motion). */
export const useLenis = () => useContext(ScrollContext).lenis;
export const useLocomotive = () => useContext(ScrollContext).loco;

/**
 * Locomotive Scroll v5 (built on Lenis) provides smooth scrolling and
 * `data-scroll-speed` parallax. Its render loop runs on GSAP's ticker, so
 * Locomotive, Lenis and ScrollTrigger share one clock.
 * Disabled entirely for reduced-motion users (native scroll, no parallax).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [ctx, setCtx] = useState<ScrollCtx>({ loco: null, lenis: null });

  useEffect(() => {
    if (reduced) return;
    const loco = new LocomotiveScroll({
      lenisOptions: {
        duration: 1.15,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
      },
      scrollCallback: () => ScrollTrigger.update(),
      initCustomTicker: (render) => gsap.ticker.add(render),
      destroyCustomTicker: (render) => gsap.ticker.remove(render),
    });
    gsap.ticker.lagSmoothing(0);
    // Locomotive bundles its own copy of Lenis; the public API is identical.
    setCtx({ loco, lenis: loco.lenisInstance as unknown as Lenis });
    return () => {
      loco.destroy();
      setCtx({ loco: null, lenis: null });
    };
  }, [reduced]);

  return <ScrollContext.Provider value={ctx}>{children}</ScrollContext.Provider>;
}

/**
 * Registers `[data-scroll]` parallax elements inside `scope` with Locomotive.
 * Call from any component that renders parallax elements (including ones
 * that appear after data loads: pass those values as `deps`).
 */
export function useLocomotiveParallax(scope: RefObject<HTMLElement>, deps: unknown[] = []) {
  const loco = useLocomotive();
  useEffect(() => {
    const el = scope.current;
    if (!loco || !el) return;
    // Remove first so elements already picked up by Locomotive's initial scan aren't doubled.
    loco.removeScrollElements(el);
    loco.addScrollElements(el);
    return () => {
      loco.removeScrollElements(el);
      el.querySelectorAll<HTMLElement>('[data-scroll-speed]').forEach((n) => n.style.removeProperty('transform'));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loco, scope, ...deps]);
}

/** Reset scroll on route change and re-measure triggers once the new page is in. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -72 });
        else el.scrollIntoView();
        return;
      }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, hash, lenis]);
  return null;
}
