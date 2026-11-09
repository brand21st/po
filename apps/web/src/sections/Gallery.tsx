import { useRef, useState } from 'react';
import { ArtImage } from '@/components/ArtImage';
import { Lightbox } from '@/components/Lightbox';
import { SectionHeading } from '@/components/SectionHeading';
import { useGallery } from '@/hooks/queries';
import { useRefreshOnChange } from '@/hooks/useRefreshOnChange';
import { useReveal } from '@/hooks/useReveal';
import { gsap, MQ, ScrollTrigger, useGSAP } from '@/lib/gsap';

/** 7 · Masonry gallery: lazy images, batched staggered reveal, accessible lightbox. */
export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const { data: items, isLoading, isError } = useGallery();
  const [active, setActive] = useState<number | null>(null);
  const count = items?.length ?? 0;

  useReveal(root);

  useGSAP(
    () => {
      if (!count) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tiles = gsap.utils.toArray<HTMLElement>('.gallery-tile', root.current);
        gsap.set(tiles, { autoAlpha: 0, y: 60 });
        ScrollTrigger.batch(tiles, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [count], revertOnUpdate: true },
  );

  useRefreshOnChange(count);

  return (
    <section ref={root} id="gallery" aria-labelledby="gallery-title" className="bg-cream-deep/60 py-section">
      <div className="container-x">
        <SectionHeading id="gallery-title" eyebrow="Gallery" title="Moments from the gardens." intro="A glimpse of last spring. Select any image to view it larger." />

        {isLoading && <p className="mt-12 text-ink-soft">Gathering blooms…</p>}
        {isError && <p className="mt-12 text-ink-soft" role="alert">The gallery couldn’t load right now.</p>}

        <ul className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3" role="list">
          {items?.map((item, i) => (
            <li key={item.id} className="gallery-tile mb-6 break-inside-avoid">
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative block w-full overflow-hidden rounded-[1.5rem] text-left"
                aria-label={`Open image: ${item.caption}`}
              >
                <ArtImage image={item.image} className="w-full" imgClassName="transition-transform duration-1000 ease-expo-out group-hover:scale-[1.04]" style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }} />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-5 pt-16 text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-display text-step-1">{item.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {items && <Lightbox items={items} index={active} onChange={setActive} />}
    </section>
  );
}
