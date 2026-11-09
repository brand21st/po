import { Link } from 'react-router-dom';
import { SHOW } from '@flower/shared';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-botanic text-cream">
      <div className="container-x grid gap-12 py-18 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-step--1 text-cream/75">{SHOW.tagline}</p>
          <p className="mt-6 text-step--1 text-cream/75">{SHOW.datesLabel}</p>
        </div>
        <div>
          <h2 className="eyebrow font-sans text-petal">Visit</h2>
          <address className="mt-4 text-step--1 not-italic leading-relaxed text-cream/85">
            {SHOW.venue.name}
            <br />
            {SHOW.venue.address}
            <br />
            {SHOW.venue.city} {SHOW.venue.postcode}
          </address>
        </div>
        <div>
          <h2 className="eyebrow font-sans text-petal">Explore</h2>
          <ul className="mt-4 space-y-2 text-step--1">
            <li><Link className="hover:text-petal" to="/tickets">Tickets</Link></li>
            <li><Link className="hover:text-petal" to="/visit">Plan your visit</Link></li>
            <li><Link className="hover:text-petal" to="/#schedule">Schedule</Link></li>
            <li><Link className="hover:text-petal" to="/#newsletter">Newsletter</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow font-sans text-petal">Hours</h2>
          <dl className="mt-4 space-y-2 text-step--1 text-cream/85">
            {SHOW.hours.map((h) => (
              <div key={h.label} className="flex justify-between gap-4">
                <dt>{h.label}</dt>
                <dd>{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col gap-2 py-6 text-step--1 text-cream/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SHOW.fullName}. Demo site: event details are placeholders.</p>
          <a className="hover:text-petal" href={`mailto:${SHOW.contactEmail}`}>{SHOW.contactEmail}</a>
        </div>
      </div>
    </footer>
  );
}
