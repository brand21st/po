import { useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Nav } from './Nav';
import { gsap, useGSAP } from '@/lib/gsap';
import { ScrollToTop } from '@/providers/SmoothScroll';

/** Thin page progress line scrubbed to document scroll. Decorative. */
function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  });
  return <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-petal via-gold to-petal-deep" />;
}

export function Layout() {
  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-full bg-ink px-5 py-3 text-cream">
        Skip to content
      </a>
      <ScrollToTop />
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
