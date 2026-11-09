import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { SHOW } from '@flower/shared';
import { Arrow, ButtonLink } from '@/components/Button';
import { useReveal } from '@/hooks/useReveal';

const TRAVEL = [
  { title: 'By tram', body: 'Line A to Conservatory Way, a two-minute walk to the Main Gate. Trams run every 6 minutes during the show.' },
  { title: 'By bike', body: 'Free supervised bike parking for 600 bikes at the East Gate, open 8:00 until close.' },
  { title: 'By car', body: 'Limited parking at the Riverside lot (pre-book). Accessible bays are reserved at the Main Gate.' },
];

const ACCESS = [
  'Step-free routes through every garden and glasshouse',
  'Free wheelchair and mobility scooter loan (book ahead)',
  'Quiet hours 9:00 – 10:30 on Thursday and Friday',
  'Carers go free with a valid ticket holder',
  'Audio-described tours daily at 13:00',
];

const FAQ = [
  { q: 'Can I re-enter on the same day?', a: 'Yes. Your ticket is valid for re-entry all day; keep it on your phone.' },
  { q: 'Are dogs allowed?', a: 'Assistance dogs are very welcome. Other dogs can’t join us, to protect the plants and pollinators.' },
  { q: 'Is there food on site?', a: 'The Orangery café and four garden kiosks serve seasonal food, with vegetarian and vegan options throughout.' },
  { q: 'Can I buy plants at the show?', a: 'Yes, at the Growers’ Market. A free plant crèche holds your purchases until you leave.' },
  { q: 'What happens if it rains?', a: 'Half the show is under glass, and the gardens look wonderful in the rain. The show goes ahead in all weather.' },
];

export default function VisitPage() {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);

  useEffect(() => {
    document.title = `Plan your visit · ${SHOW.fullName}`;
  }, []);

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SHOW.venue.mapQuery)}`;

  return (
    <div ref={root} className="bg-cream pb-section pt-[calc(var(--nav-h)+4rem)]">
      <div className="container-x">
        <header data-reveal-group className="max-w-3xl">
          <p data-reveal className="eyebrow text-petal-deep">
            Plan your visit
          </p>
          <h1 data-reveal className="mt-4 text-step-5 text-balance">
            Everything you need for a perfect day in the gardens.
          </h1>
        </header>

        <section data-reveal-group aria-labelledby="venue-title" className="mt-16 grid gap-8 md:grid-cols-2">
          <div data-reveal className="rounded-[2rem] bg-botanic p-8 text-cream md:p-10">
            <h2 id="venue-title" className="font-display text-step-3">
              {SHOW.venue.name}
            </h2>
            <address className="mt-4 not-italic text-cream/85">
              {SHOW.venue.address}
              <br />
              {SHOW.venue.city} {SHOW.venue.postcode}
            </address>
            <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-[44px] items-center gap-2 font-semibold text-petal hover:text-cream">
              Open in maps <Arrow /> <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
          <div data-reveal className="rounded-[2rem] bg-white/60 p-8 ring-1 ring-ink/5 md:p-10">
            <h2 className="font-display text-step-3">Opening hours</h2>
            <p className="mt-2 text-ink-soft">{SHOW.datesLabel}</p>
            <dl className="mt-6 divide-y divide-ink/10">
              {SHOW.hours.map((h) => (
                <div key={h.label} className="flex justify-between py-3">
                  <dt>{h.label}</dt>
                  <dd className="tabular-nums text-ink-soft">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section data-reveal-group aria-labelledby="travel-title" className="mt-section">
          <h2 data-reveal id="travel-title" className="text-step-4">
            Getting here
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {TRAVEL.map((t) => (
              <li data-reveal key={t.title} className="border-t border-ink/15 pt-6">
                <h3 className="font-display text-step-2">{t.title}</h3>
                <p className="mt-3 text-ink-soft">{t.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section data-reveal-group aria-labelledby="access-title" className="mt-section grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <h2 data-reveal id="access-title" className="text-step-4">
            Accessibility
          </h2>
          <ul data-reveal className="space-y-4 text-step-1">
            {ACCESS.map((a) => (
              <li key={a} className="flex gap-3">
                <span aria-hidden="true" className="text-petal-deep">✿</span>
                {a}
              </li>
            ))}
          </ul>
        </section>

        <section data-reveal-group aria-labelledby="faq-title" className="mt-section grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <h2 data-reveal id="faq-title" className="text-step-4">
            Questions
          </h2>
          <div data-reveal className="divide-y divide-ink/10 border-y border-ink/10">
            {FAQ.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>

        <div className="mt-section flex flex-col items-start gap-6 rounded-[2rem] bg-petal-soft p-10 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-step-3">Ready when the gardens are.</p>
          <ButtonLink to="/tickets">
            Buy tickets <Arrow />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-step-1">
          {q}
          <span aria-hidden="true" className={`text-step-2 transition-transform duration-500 ease-expo-out ${open ? 'rotate-45' : ''}`}>
            +
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-ink-soft">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
