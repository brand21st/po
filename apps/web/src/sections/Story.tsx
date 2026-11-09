import { useRef } from 'react';
import { SHOW } from '@flower/shared';
import { Photo } from '@/components/Photo';
import { gsap, MQ, SplitText, useGSAP } from '@/lib/gsap';
import { PHOTOS } from '@/lib/photos';
import { useLocomotiveParallax } from '@/providers/SmoothScroll';

/** Locomotive `data-scroll-speed` per depth: far layers drift least, near layers most. */
// Photos are matched to layer size so none is shown much above its native width.
const LAYERS = [
  { cls: 'story-layer-back', photo: PHOTOS.peachDahlias, speed: 0.03, pos: 'left-0 top-0 w-[72%] aspect-[4/5]', z: 'z-0' },
  { cls: 'story-layer-mid', photo: PHOTOS.wildflowerMeadow, speed: 0.1, pos: 'right-0 top-[28%] w-[52%] aspect-[4/5]', z: 'z-10' },
  { cls: 'story-layer-front', photo: PHOTOS.cosmosField, speed: 0.2, pos: 'left-[18%] bottom-0 w-[38%] aspect-square', z: 'z-20' },
];

/** 2 · Intro / story: masked line-by-line text reveal + 3-depth parallax stack. */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);

        q<HTMLElement>('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: 'top 80%', once: true },
              }),
          });
        });

        gsap.from(q('[data-story-fade]'), {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.1,
          scrollTrigger: { trigger: q('[data-story-fade]')[0], start: 'top 85%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Parallax depth layers are driven by Locomotive Scroll, not GSAP.
  useLocomotiveParallax(root);


  return (
    <section ref={root} id="story" aria-labelledby="story-title" className="relative bg-cream py-section">
      <div className="container-x grid items-center gap-16 md:grid-cols-2 md:gap-20">
        <div>
          <p className="eyebrow text-petal-deep" data-story-fade>
            The story
          </p>
          <h2 id="story-title" data-split className="mt-4 text-step-5 text-balance">
            Forty-two springs of turning glass and soil into wonder.
          </h2>
          <div className="mt-8 max-w-xl space-y-5 text-step-1 text-ink-soft">
            <p data-split>
              Every May, {SHOW.venue.name} opens its doors to the growers, designers and dreamers who spend all year coaxing gardens into their finest
              hour.
            </p>
            <p data-split>
              Walk under living arches, through night-scented meadows and copper-lit glasshouses. Stay for the talks, the workshops and the twilight
              lantern walk.
            </p>
          </div>
        </div>

        <div className="story-stack relative mx-auto aspect-[5/6] w-full max-w-[34rem]">
          {LAYERS.map((l) => (
            <div key={l.cls} className={`absolute ${l.pos} ${l.z}`} data-scroll data-scroll-speed={l.speed}>
              <div className={`${l.cls} h-full w-full overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-30px_rgb(var(--c-botanic)/0.45)]`}>
                <Photo photo={l.photo} className="h-full w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
