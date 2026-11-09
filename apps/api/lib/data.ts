import {
  PALETTES,
  SHOW,
  type ArtParams,
  type EventItem,
  type Exhibit,
  type GalleryItem,
  type Image,
  type PaletteName,
  type TicketType,
} from '@flower/shared';

/**
 * In-memory mock data. Swap these arrays for a database / CMS later;
 * route handlers only depend on the exported functions.
 */

/* ---------- Art registry (backs GET /api/art/:id) ---------- */

const art = new Map<string, { params: ArtParams; title: string }>();

function registerArt(id: string, title: string, palette: PaletteName, p: Omit<ArtParams, 'palette'>): Image {
  art.set(id, { params: { ...p, palette: PALETTES[palette] }, title });
  return { src: `/api/art/${id}`, alt: title, width: p.width, height: p.height, dominant: PALETTES[palette].bg2 };
}

export function getArt(id: string) {
  return art.get(id);
}

/* ---------- Exhibits ---------- */

type ExhibitSeed = Omit<Exhibit, 'image'> & {
  art: { palette: PaletteName; composition: ArtParams['composition']; petals: number; layers: number; shape: ArtParams['shape']; seed: number };
};

const exhibitSeeds: ExhibitSeed[] = [
  {
    slug: 'rose-cathedral',
    name: 'The Rose Cathedral',
    designer: 'Amara Lindqvist Studio',
    tagline: 'Nine hundred climbing roses, arched like a nave.',
    description: [
      'A vaulted walk of living arches, each trained over two seasons from heritage climbing roses. Light falls through the canopy in soft blush tones.',
      'At its heart sits a reflecting pool planted with water lilies, framing the arches twice: once in the air, once in the water.',
    ],
    highlights: ['900+ heritage climbing roses', 'Twelve-metre living arch', 'Fragrance trail with tasting notes'],
    zone: 'Great Glasshouse · North',
    bloomSeason: 'summer',
    featured: true,
    art: { palette: 'blush', composition: 'single', petals: 9, layers: 3, shape: 'round', seed: 101 },
  },
  {
    slug: 'moonlit-meadow',
    name: 'Moonlit Meadow',
    designer: 'Okonkwo & Reyes',
    tagline: 'A garden designed to be seen after dark.',
    description: [
      'White and silver-leaved plants chosen for how they catch moonlight: night phlox, evening primrose, moonflower and silver sage.',
      'Low lanterns rise and fall with the scent of the flowers. Come back after 19:00 to see it at its best.',
    ],
    highlights: ['Night-scented planting', 'Lantern choreography at dusk', 'Moth-friendly habitat'],
    zone: 'Terrace Gardens',
    bloomSeason: 'summer',
    featured: true,
    art: { palette: 'moonlit', composition: 'meadow', petals: 6, layers: 1, shape: 'pointed', seed: 202 },
  },
  {
    slug: 'peony-pavilion',
    name: 'Peony Pavilion',
    designer: 'House of Hanami',
    tagline: 'Two hundred varieties, one perfect week of bloom.',
    description: [
      'A lacquered pavilion surrounded by tree and herbaceous peonies, timed to open together for the show.',
      'Growers are on hand all day to talk through cultivation, from bare root to show bench.',
    ],
    highlights: ['200 peony varieties', 'Grower talks every hour', 'Rare Itoh hybrids'],
    zone: 'East Lawn',
    bloomSeason: 'spring',
    featured: true,
    art: { palette: 'peony', composition: 'cluster', petals: 10, layers: 4, shape: 'heart', seed: 303 },
  },
  {
    slug: 'golden-prairie',
    name: 'Golden Prairie',
    designer: 'Wild Margin Collective',
    tagline: 'A drought-wise sweep of grasses and gold.',
    description: [
      'Rudbeckia, echinacea and feather grasses planted in loose drifts that need no irrigation once established.',
      'A study in resilient, pollinator-rich planting for warming summers.',
    ],
    highlights: ['Zero-irrigation planting plan', 'Pollinator counts live on site', 'Take-home seed mix'],
    zone: 'South Meadow',
    bloomSeason: 'summer',
    featured: true,
    art: { palette: 'meadow', composition: 'meadow', petals: 12, layers: 1, shape: 'pointed', seed: 404 },
  },
  {
    slug: 'iris-water-garden',
    name: 'Iris Water Garden',
    designer: 'Studio Fenwater',
    tagline: 'Reflections, rills and a thousand irises.',
    description: [
      'Japanese and Siberian irises edging a slow, stepped rill that runs the length of the garden.',
      'Stepping stones let you cross the water and stand among the blooms.',
    ],
    highlights: ['1,000 irises in 40 cultivars', 'Stepping-stone rill crossing', 'Sound design by the water'],
    zone: 'Lake Walk',
    bloomSeason: 'spring',
    featured: true,
    art: { palette: 'iris', composition: 'cluster', petals: 6, layers: 2, shape: 'pointed', seed: 505 },
  },
  {
    slug: 'ember-dahlias',
    name: 'Ember Dahlias',
    designer: 'Calder & Finch Growers',
    tagline: 'A late-season blaze of copper and flame.',
    description: [
      'Dinnerplate and pompom dahlias in burnt orange, rust and copper, staged in tiers like a sunset.',
      'Our autumn preview: the garden that closes the show season.',
    ],
    highlights: ['Dinnerplate dahlias up to 30cm', 'Tuber division demos', 'Autumn colour guide'],
    zone: 'Orangery',
    bloomSeason: 'autumn',
    featured: true,
    art: { palette: 'ember', composition: 'single', petals: 16, layers: 4, shape: 'pointed', seed: 606 },
  },
  {
    slug: 'crimson-conservatory',
    name: 'Crimson Conservatory',
    designer: 'Velvet Root',
    tagline: 'Deep reds, dark foliage and drama.',
    description: [
      'A moody conservatory of crimson dahlias, black-leaved begonias and ruby amaranth.',
      'Lit low and warm, it is the quietest room in the show.',
    ],
    highlights: ['Dark-foliage plant palette', 'Warm low-light design', 'Seating for quiet visits'],
    zone: 'Great Glasshouse · South',
    bloomSeason: 'autumn',
    featured: true,
    art: { palette: 'dahlia', composition: 'cluster', petals: 12, layers: 3, shape: 'round', seed: 707 },
  },
];

export const exhibits: Exhibit[] = exhibitSeeds.map(({ art: a, ...e }) => ({
  ...e,
  image: registerArt(`exhibit-${e.slug}`, `${e.name}: illustration of the garden`, a.palette, {
    seed: a.seed,
    composition: a.composition,
    petals: a.petals,
    layers: a.layers,
    shape: a.shape,
    width: 1200,
    height: 1500,
  }),
}));

/* ---------- Schedule ---------- */

const [d1, d2, d3, d4, d5] = SHOW.days;

export const events: EventItem[] = [
  { id: 'e1', day: d1, start: '09:00', end: '09:45', title: 'The First Bloom: opening ceremony', description: 'A dawn chorus, a ribbon of petals and the gates open.', location: 'Main Gate', category: 'ceremony' },
  { id: 'e2', day: d1, start: '11:00', end: '12:00', title: 'Designing with fragrance', description: 'How the Rose Cathedral was planted for scent, not just sight.', location: 'Speakers’ Glasshouse', category: 'talk', host: 'Amara Lindqvist' },
  { id: 'e3', day: d1, start: '14:00', end: '15:30', title: 'Hand-tied bouquet workshop', description: 'Build a seasonal hand-tie to take home. All materials provided.', location: 'Potting Shed', category: 'workshop' },
  { id: 'e4', day: d2, start: '10:00', end: '11:00', title: 'Peony growers’ masterclass', description: 'From bare root to show bench with the House of Hanami.', location: 'Peony Pavilion', category: 'talk', host: 'House of Hanami' },
  { id: 'e5', day: d2, start: '19:30', end: '21:00', title: 'Lantern walk through Moonlit Meadow', description: 'A guided after-dark walk as the night-scented garden wakes.', location: 'Terrace Gardens', category: 'tour' },
  { id: 'e6', day: d3, start: '12:00', end: '13:00', title: 'String quartet among the irises', description: 'Live chamber music on the Lake Walk.', location: 'Lake Walk', category: 'performance' },
  { id: 'e7', day: d3, start: '15:00', end: '16:00', title: 'Planting for a hotter summer', description: 'Drought-wise prairie planting with Wild Margin Collective.', location: 'South Meadow', category: 'talk', host: 'Wild Margin Collective' },
  { id: 'e8', day: d4, start: '10:30', end: '12:00', title: 'Pressed flower art for families', description: 'A gentle, hands-on session for all ages.', location: 'Potting Shed', category: 'workshop' },
  { id: 'e9', day: d4, start: '16:00', end: '17:00', title: 'Best in Show awards', description: 'The judges reveal this year’s gold medal gardens.', location: 'Great Glasshouse', category: 'ceremony' },
  { id: 'e10', day: d5, start: '11:00', end: '12:00', title: 'Dahlia tuber division demo', description: 'Calder & Finch show how to lift, split and store.', location: 'Orangery', category: 'workshop', host: 'Calder & Finch' },
  { id: 'e11', day: d5, start: '16:00', end: '16:45', title: 'Closing: the petal fall', description: 'The show ends as it began, beneath a shower of petals.', location: 'Main Lawn', category: 'ceremony' },
];

/* ---------- Gallery ---------- */

const galleryDefs: Array<[PaletteName, ArtParams['composition'], ArtParams['shape'], number, number, string]> = [
  ['blush', 'single', 'round', 9, 1000, 'Morning light on climbing roses'],
  ['moonlit', 'meadow', 'pointed', 6, 1300, 'Night phlox under lanterns'],
  ['meadow', 'cluster', 'pointed', 12, 800, 'Rudbeckia in the prairie drifts'],
  ['iris', 'single', 'pointed', 6, 1200, 'A single Siberian iris'],
  ['peony', 'cluster', 'heart', 10, 1000, 'Itoh peonies at dusk'],
  ['cream', 'single', 'heart', 8, 900, 'White garden ranunculus'],
  ['ember', 'cluster', 'pointed', 16, 1300, 'Copper dahlias in tiers'],
  ['dahlia', 'single', 'round', 12, 1000, 'Crimson pompom detail'],
  ['blush', 'meadow', 'round', 7, 800, 'Cosmos along the walk'],
  ['meadow', 'single', 'round', 14, 1200, 'Sunflower centre, close-up'],
  ['iris', 'meadow', 'pointed', 6, 1000, 'Iris rill at noon'],
  ['peony', 'single', 'heart', 9, 1300, 'Tree peony in full bloom'],
];

export const gallery: GalleryItem[] = galleryDefs.map(([palette, composition, shape, petals, height, caption], i) => ({
  id: `g${i + 1}`,
  caption,
  credit: 'Illustration · Poopoli studio',
  image: registerArt(`gallery-${i + 1}`, caption, palette, {
    seed: 1000 + i * 37,
    composition,
    shape,
    petals,
    layers: composition === 'meadow' ? 1 : 2 + (i % 3),
    width: 1000,
    height,
  }),
}));

/* ---------- Tickets ---------- */

export const ticketTypes: TicketType[] = [
  {
    id: 'day',
    name: 'Day Pass',
    description: 'Entry for one day of the show, 9:00 until close.',
    price: 150000,
    currency: SHOW.currency,
    perks: ['All gardens & glasshouses', 'Daytime talks', 'Free re-entry the same day'],
    highlight: false,
    maxPerOrder: 10,
  },
  {
    id: 'twilight',
    name: 'Twilight Entry',
    description: 'Entry from 17:00, including the Moonlit Meadow lantern walk.',
    price: 110000,
    currency: SHOW.currency,
    perks: ['Entry from 17:00', 'Lantern walk', 'Welcome glass of elderflower'],
    highlight: true,
    maxPerOrder: 10,
  },
  {
    id: 'patron',
    name: 'Patron Pass',
    description: 'Early-hour access, reserved workshop seat and lounge.',
    price: 450000,
    currency: SHOW.currency,
    perks: ['Early access 8:00 – 9:00', 'One reserved workshop', 'Patrons’ lounge & catalogue'],
    highlight: false,
    maxPerOrder: 4,
  },
  {
    id: 'child',
    name: 'Child (5–15)',
    description: 'Under 5s go free. Must be with an adult.',
    price: 50000,
    currency: SHOW.currency,
    perks: ['Family trail booklet', 'Pressed-flower kit'],
    highlight: false,
    maxPerOrder: 8,
  },
];
