import { useRef, type CSSProperties } from 'react';
import { Arrow, ButtonLink } from '@/components/Button';
import { Photo } from '@/components/Photo';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { BACKDROPS, PHOTOS } from '@/lib/photos';

/**
 * Golden Hour: a sunrise told in three scrubbed beats over a sticky stage.
 * Art direction and motion script: docs/golden-hour-meta-prompt.md
 *
 * Uses CSS `position: sticky` rather than a third GSAP pin (the page already pins
 * the hero and gardens). Reduced motion renders a static editorial layout instead.
 */

const BEATS = [
  { time: 'First light · 05:52', title: 'First light', copy: 'The gates open before the sun does. Walk the meadow while it is still yours.' },
  { time: 'The field wakes · 06:21', title: 'The field wakes', copy: 'Ten thousand blooms turn toward the light, row by row, in peach and blush.' },
  { time: 'Dew & gold · 06:48', title: 'Dew & gold', copy: 'Every petal holds a little of the morning. Arrive early. Stay for the gold.' },
];

// Dew glints over the daisy (percent positions on the 506×740 frame).
const GLINTS: Array<[number, number, number]> = [
  [28, 47, 1],
  [39, 53, 0.7],
  [69, 44, 0.9],
  [79, 55, 0.6],
  [56, 63, 0.8],
  [22, 58, 0.5],
  [62, 38, 0.6],
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const START_MIN = 5 * 60 + 52;
const END_MIN = 7 * 60 + 10;
const clock = (p: number) => {
  const m = Math.round(START_MIN + p * (END_MIN - START_MIN));
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

export function GoldenHour() {
  const reduced = useReducedMotion();
  return reduced ? <GoldenHourStatic /> : <GoldenHourScene />;
}

function GoldenHourScene() {
  const root = useRef<HTMLElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const captions = q<HTMLElement>('.gh-caption');
      const splits = captions.map((c) => SplitText.create(c.querySelector('.gh-title'), { type: 'words', mask: 'words' }));

      // Initial states (motion only; the static layout never runs this).
      gsap.set(captions.slice(1), { autoAlpha: 0 });
      gsap.set(q('.gh-cta'), { autoAlpha: 0, y: 16 });
      gsap.set(q('.gh-l-dahlias'), { clipPath: 'circle(0% at 50% 55%)' });
      gsap.set(q('.gh-l-daisy'), { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(q('.gh-bd-dahlias'), { autoAlpha: 0 });
      gsap.set(q('.gh-glint'), { scale: 0, autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: q('.gh-track')[0],
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            if (clockRef.current) clockRef.current.textContent = clock(self.progress);
          },
        },
      });

      // Arrive: curtains part on the arch window, sun begins to rise.
      tl.fromTo(q('.gh-arch'), { clipPath: 'inset(0% 50% 0% 50% round 999px 999px 32px 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 32px 32px)', duration: 0.1, ease: 'power2.out' }, 0)
        .fromTo(q('.gh-sun'), { yPercent: 25, scale: 0.6, autoAlpha: 0.35 }, { yPercent: -55, scale: 1.15, autoAlpha: 1, duration: 1 }, 0)
        .fromTo(q('.gh-bd'), { scale: 1.18 }, { scale: 1.02, duration: 1 }, 0)
        .fromTo(q('.gh-veil'), { autoAlpha: 0.62 }, { autoAlpha: 0.22, duration: 0.9 }, 0)
        .fromTo(q('.gh-l-meadow .gh-zoom'), { scale: 1.14 }, { scale: 1, duration: 0.36 }, 0);

      // Beat 1 copy.
      tl.from(splits[0]!.words, { yPercent: 110, stagger: 0.01, duration: 0.08, ease: 'power2.out' }, 0.04)
        .from(captions[0]!.querySelectorAll('[data-gh-fade]'), { autoAlpha: 0, y: 14, stagger: 0.02, duration: 0.06 }, 0.08)
        .to(captions[0]!, { autoAlpha: 0, y: -24, duration: 0.05 }, 0.31);

      // Beat 2: iris opens on the dahlia field; backdrop follows.
      tl.to(q('.gh-l-dahlias'), { clipPath: 'circle(80% at 50% 55%)', duration: 0.2, ease: 'power1.inOut' }, 0.36)
        .fromTo(q('.gh-l-dahlias .gh-zoom'), { scale: 1.22 }, { scale: 1, duration: 0.28 }, 0.36)
        .to(q('.gh-bd-dahlias'), { autoAlpha: 1, duration: 0.18 }, 0.38)
        .to(captions[1]!, { autoAlpha: 1, duration: 0.01 }, 0.39)
        .from(splits[1]!.words, { yPercent: 110, stagger: 0.01, duration: 0.08, ease: 'power2.out' }, 0.4)
        .from(captions[1]!.querySelectorAll('[data-gh-fade]'), { autoAlpha: 0, y: 14, stagger: 0.02, duration: 0.06 }, 0.44)
        .to(captions[1]!, { autoAlpha: 0, y: -24, duration: 0.05 }, 0.59);

      // Beat 3: rack focus. The daisy rises sharp into the arch; dew glints catch the sun.
      tl.to(q('.gh-l-daisy'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.16, ease: 'power2.out' }, 0.64)
        .fromTo(q('.gh-l-daisy .gh-zoom'), { scale: 1.16, yPercent: 6 }, { scale: 1, yPercent: 0, duration: 0.26 }, 0.64)
        .to(q('.gh-glint'), { scale: 1, autoAlpha: 1, stagger: 0.012, duration: 0.05, ease: 'power2.out' }, 0.78)
        .to(captions[2]!, { autoAlpha: 1, duration: 0.01 }, 0.67)
        .from(splits[2]!.words, { yPercent: 110, stagger: 0.01, duration: 0.08, ease: 'power2.out' }, 0.68)
        .from(captions[2]!.querySelectorAll('[data-gh-fade]'), { autoAlpha: 0, y: 14, stagger: 0.02, duration: 0.06 }, 0.72)
        .to(q('.gh-cta'), { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.86);

      // Satellite cosmos (desktop) drifts up through the whole scene.
      tl.fromTo(q('.gh-sat'), { yPercent: 60, autoAlpha: 0 }, { yPercent: -50, autoAlpha: 1, duration: 0.6 }, 0.3);

      return () => splits.forEach((s) => s.revert());
    },
    { scope: root },
  );

  return (
    <section ref={root} id="golden-hour" aria-labelledby="golden-hour-title" className="relative bg-sun-umber text-sun-cream">
      <div className="gh-track relative h-[280svh] md:h-[340svh]">
        <div className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden">
          {/* Backdrop: tiny pre-blurred photos stretched full-bleed (bokeh by design). */}
          <div aria-hidden="true" className="absolute inset-0">
            <div className="gh-bd absolute inset-0 will-change-transform">
              <img src={BACKDROPS.meadow} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <img src={BACKDROPS.dahlias} alt="" className="gh-bd-dahlias absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="gh-veil absolute inset-0 bg-sun-umber" />
            <div
              className="gh-sun pointer-events-none absolute -right-[20vmax] top-[35%] h-[90vmax] w-[90vmax] rounded-full mix-blend-screen will-change-transform"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,240,214,0.95) 0%, rgba(241,204,164,0.55) 14%, rgba(233,164,119,0.22) 34%, rgba(233,164,119,0) 62%)',
              }}
            />
            <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
            {/* Caption scrim: measured for ≥4.5:1 cream text (see meta prompt §1). */}
            <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-sun-umber/90 via-sun-umber/65 to-transparent md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-[62%] md:bg-gradient-to-r md:from-sun-umber/85 md:via-sun-umber/70" />
          </div>

          <div className="container-x relative z-10 grid h-full grid-rows-[1fr_auto] items-center gap-4 pb-6 pt-[calc(var(--nav-h)+1rem)] md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-1 md:gap-16 md:pb-0">
            {/* Arch window with three stacked photo layers */}
            <div className="relative order-1 justify-self-center md:order-2">
              <div className="gh-arch relative aspect-[506/740] h-[min(48svh,calc(84vw*1.462),740px)] overflow-hidden rounded-b-[2rem] rounded-t-full shadow-[0_40px_120px_-30px_rgba(40,20,10,0.6)] md:h-[min(76svh,740px)]">
                <div className="gh-l-meadow absolute inset-0">
                  <div className="gh-zoom h-full w-full will-change-transform">
                    <Photo photo={PHOTOS.wildflowerMeadow} className="h-full w-full" decorative eager />
                  </div>
                </div>
                <div className="gh-l-dahlias absolute inset-0">
                  <div className="gh-zoom h-full w-full will-change-transform">
                    <Photo photo={PHOTOS.peachDahlias} className="h-full w-full" decorative eager />
                  </div>
                </div>
                <div className="gh-l-daisy absolute inset-0">
                  <div className="gh-zoom h-full w-full will-change-transform">
                    <Photo photo={PHOTOS.dewDaisy} className="h-full w-full" decorative eager />
                  </div>
                  {GLINTS.map(([x, y], i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className="gh-glint absolute block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                      style={{ left: `${x}%`, top: `${y}%`, boxShadow: '0 0 10px 3px rgba(255,248,230,0.9)' } as CSSProperties}
                    >
                      <span className="absolute inset-0 animate-[twinkle_2.4s_ease-in-out_infinite] rounded-full bg-white" style={{ animationDelay: `${i * 0.35}s` }} />
                    </span>
                  ))}
                </div>
                {/* Soft inner rim light */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_60px_rgba(255,236,214,0.35)]" />
              </div>

              {/* Satellite: cosmos in a round frame (desktop only) */}
              <div aria-hidden="true" className="gh-sat absolute -left-28 bottom-[8%] hidden w-40 lg:block">
                <Photo photo={PHOTOS.cosmosField} className="aspect-square rounded-full ring-1 ring-sun-cream/40 shadow-[0_30px_60px_-20px_rgba(40,20,10,0.6)]" decorative />
              </div>
            </div>

            {/* Captions */}
            <div className="relative order-2 self-end md:order-1 md:self-center">
              <p className="eyebrow text-sun-peach">
                Golden hour <span aria-hidden="true">· </span>
                <span ref={clockRef} aria-hidden="true" className="tabular-nums">
                  {clock(0)}
                </span>
              </p>
              <h2 id="golden-hour-title" className="sr-only">
                Golden hour at the show: first light, the field wakes, dew and gold
              </h2>
              <div className="relative mt-3 grid min-h-[10rem] md:mt-4 md:min-h-[15rem]">
                {BEATS.map((b) => (
                  <div key={b.title} className="gh-caption col-start-1 row-start-1 max-w-md">
                    <p data-gh-fade className="text-step--1 font-medium text-sun-peach">
                      {b.time}
                    </p>
                    <h3 className="gh-title mt-1 font-display text-step-4 font-light leading-[0.95] text-sun-cream md:mt-2 md:text-step-5">{b.title}</h3>
                    <p data-gh-fade className="mt-3 text-step-0 text-sun-cream/90 text-pretty md:mt-4 md:text-step-1">
                      {b.copy}
                    </p>
                  </div>
                ))}
              </div>
              <div className="gh-cta mt-3 md:mt-6">
                <ButtonLink to="/tickets?type=twilight" variant="petal">
                  Book a twilight entry <Arrow />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Reduced motion: the same story as a still, editorial composition. */
function GoldenHourStatic() {
  return (
    <section id="golden-hour" aria-labelledby="golden-hour-title" className="bg-sun-peach py-section text-ink">
      <div className="container-x grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow text-petal-deep">Golden hour</p>
          <h2 id="golden-hour-title" className="mt-4 text-step-5 font-light text-balance">
            A morning in the gardens
          </h2>
          <ol className="mt-8 space-y-6">
            {BEATS.map((b) => (
              <li key={b.title}>
                <h3 className="font-display text-step-2">{b.title}</h3>
                <p className="mt-1 text-step--1 font-medium text-ink-soft">{b.time}</p>
                <p className="mt-2 max-w-md text-ink-soft">{b.copy}</p>
              </li>
            ))}
          </ol>
          <ButtonLink to="/tickets?type=twilight" className="mt-8">
            Book a twilight entry <Arrow />
          </ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4 md:w-[28rem]">
          <Photo photo={PHOTOS.dewDaisy} className="col-span-2 aspect-[506/740] max-h-[70svh] rounded-b-[2rem] rounded-t-full" />
          <Photo photo={PHOTOS.peachDahlias} className="aspect-square rounded-[1.5rem]" />
          <Photo photo={PHOTOS.wildflowerMeadow} className="aspect-square rounded-[1.5rem]" />
        </div>
      </div>
    </section>
  );
}
