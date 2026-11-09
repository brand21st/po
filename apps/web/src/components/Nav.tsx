import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonLink } from './Button';
import { SHOW } from '@flower/shared';
import { Logo } from './Logo';
import { useLenis } from '@/providers/SmoothScroll';

const links = [
  { to: '/#gardens', label: 'Gardens' },
  { to: '/#schedule', label: 'Schedule' },
  { to: '/#gallery', label: 'Gallery' },
  { to: '/visit', label: 'Visit' },
];

export function Nav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) menuBtn.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, lenis]);

  const overDark = pathname === '/' && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ease-power2-out ${
        overDark ? 'bg-transparent text-cream' : 'bg-cream/85 text-ink shadow-[0_1px_0_rgb(var(--c-ink)/0.08)] backdrop-blur-md'
      }`}
    >
      <nav aria-label="Main" className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link to="/" className="rounded-md" aria-label={`${SHOW.fullName}, home`}>
          <Logo />
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="group relative py-2 text-step--1 font-medium">
                {l.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-expo-out group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ButtonLink to="/tickets" variant={overDark ? 'petal' : 'primary'} className="hidden sm:inline-flex">
            Buy tickets
          </ButtonLink>
          <button
            ref={menuBtn}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] bg-cream md:hidden"
          >
            <ul className="container-x flex flex-col gap-2 pt-10">
              {[...links, { to: '/tickets', label: 'Tickets' }].map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={l.to} onClick={() => setOpen(false)} className="block py-3 font-display text-step-4">
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
