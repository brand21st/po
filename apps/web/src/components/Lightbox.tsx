import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryItem } from '@flower/shared';
import { assetUrl } from '@/lib/api';
import { useLenis } from '@/providers/SmoothScroll';

type Props = {
  items: GalleryItem[];
  index: number | null;
  onChange: (index: number | null) => void;
};

/**
 * Accessible lightbox: modal dialog with focus trap, Esc to close,
 * ←/→ keys and horizontal swipe to navigate. Focus returns to the opener.
 */
export function Lightbox({ items, index, onChange }: Props) {
  const lenis = useLenis();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = index !== null;
  const item = open ? items[index] : undefined;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      opener.current?.focus();
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
        const first = f[0];
        const last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go, onChange]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index + 1} of ${items.length}: ${item.caption}`}
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 text-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-8">
            <p className="text-step--1 tabular-nums text-cream/80" aria-live="polite">
              {index + 1} / {items.length}
            </p>
            <button ref={closeRef} type="button" onClick={() => onChange(null)} className="inline-flex h-11 items-center gap-2 rounded-full px-4 hover:bg-cream/10">
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={item.id}
                className="flex max-h-full flex-col items-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onDragEnd}
              >
                <img
                  src={assetUrl(item.image.src)}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  draggable={false}
                  className="max-h-[calc(100svh-11rem)] w-auto touch-pan-y select-none rounded-2xl object-contain"
                />
                <figcaption className="mt-4 text-center">
                  <span className="font-display text-step-1">{item.caption}</span>
                  <span className="block text-step--1 text-cream/70">{item.credit}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20 sm:inline-flex">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20 sm:inline-flex">
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <p className="pb-4 text-center text-step--1 text-cream/60 sm:hidden">Swipe to browse</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
