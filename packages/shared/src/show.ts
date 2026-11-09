/**
 * Single source of truth for event details.
 * All values below are placeholders — swap them for the real show.
 */
export const SHOW_DAYS = ['2027-05-13', '2027-05-14', '2027-05-15', '2027-05-16', '2027-05-17'] as const;
export type ShowDay = (typeof SHOW_DAYS)[number];

export const SHOW = {
  name: 'Poopoli 2027',
  fullName: 'Poopoli 2027 Flower Show',
  edition: 'The 42nd edition',
  tagline: 'Five days where the city turns to bloom.',
  datesLabel: 'May 13–17, 2027',
  days: SHOW_DAYS,
  currency: 'INR',
  venue: {
    name: 'Halden Glasshouse Gardens',
    address: '1200 Conservatory Way',
    city: 'Portland, Oregon',
    postcode: 'OR 97205',
    mapQuery: 'Halden Glasshouse Gardens Portland',
  },
  hours: [
    { label: 'Thu – Sat', value: '9:00 – 20:00' },
    { label: 'Sun', value: '9:00 – 19:00' },
    { label: 'Mon (final day)', value: '9:00 – 17:00' },
  ],
  stats: [
    { id: 'visitors', label: 'Visitors last spring', value: 128000, suffix: '+' },
    { id: 'varieties', label: 'Varieties in bloom', value: 3400, suffix: '' },
    { id: 'exhibitors', label: 'Growers & designers', value: 212, suffix: '' },
    { id: 'years', label: 'Years in bloom', value: 42, suffix: '' },
  ],
  contactEmail: 'hello@poopoli.example',
} as const;

export function formatDay(day: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) {
  // Parse as a local calendar date (avoid UTC shifting a day back).
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1).toLocaleDateString('en-US', opts);
}

export function formatPrice(minor: number, currency: string = SHOW.currency) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: minor % 100 === 0 ? 0 : 2 }).format(minor / 100);
}
