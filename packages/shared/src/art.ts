/**
 * Deterministic generative botanical artwork.
 *
 * The API serves these SVGs as stand-in imagery (`GET /api/art/:id`) so the
 * site works with no photo assets. Replace with real photography later —
 * the `Image` shape stays the same.
 */

export type ArtPalette = {
  bg: string;
  bg2: string;
  petal: string;
  petalInner: string;
  center: string;
  leaf: string;
};

export type ArtParams = {
  seed: number;
  composition: 'single' | 'cluster' | 'meadow';
  petals: number;
  layers: number;
  shape: 'round' | 'pointed' | 'heart';
  palette: ArtPalette;
  width: number;
  height: number;
};

export const PALETTES = {
  blush: { bg: '#F7E6E4', bg2: '#EFCFD3', petal: '#E79AAC', petalInner: '#FBE3E8', center: '#C9A55A', leaf: '#3F6B4E' },
  peony: { bg: '#2A1E24', bg2: '#4A2B38', petal: '#D9708C', petalInner: '#F6C4D1', center: '#E7C77D', leaf: '#5C8A63' },
  meadow: { bg: '#E8EDD9', bg2: '#CFDDBA', petal: '#F3D27A', petalInner: '#FFF4D2', center: '#B8742E', leaf: '#3E6B45' },
  moonlit: { bg: '#14241C', bg2: '#21402F', petal: '#EDE6F3', petalInner: '#FFFFFF', center: '#D8B866', leaf: '#6E9C7A' },
  ember: { bg: '#F2DFCB', bg2: '#E6C2A0', petal: '#D46A43', petalInner: '#F7C29C', center: '#6B3A22', leaf: '#4D6B3C' },
  iris: { bg: '#E7E4F1', bg2: '#CFC9E6', petal: '#7E6AB8', petalInner: '#D9CFF5', center: '#E9C76A', leaf: '#3F6B55' },
  cream: { bg: '#FBF6EC', bg2: '#F1E6D0', petal: '#F4EDE0', petalInner: '#FFFFFF', center: '#C9A55A', leaf: '#2F5A40' },
  dahlia: { bg: '#3A1420', bg2: '#5C1F31', petal: '#C23B5C', petalInner: '#F08AA2', center: '#F1C76A', leaf: '#6F9A6E' },
} satisfies Record<string, ArtPalette>;
export type PaletteName = keyof typeof PALETTES;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function petalPath(shape: ArtParams['shape'], L: number, W: number): string {
  const p = (n: number) => r2(n);
  switch (shape) {
    case 'pointed':
      return `M0 0 C${p(W)} ${p(-L * 0.35)} ${p(W * 0.55)} ${p(-L * 0.8)} 0 ${p(-L)} C${p(-W * 0.55)} ${p(-L * 0.8)} ${p(-W)} ${p(-L * 0.35)} 0 0Z`;
    case 'heart':
      return `M0 0 C${p(W * 1.2)} ${p(-L * 0.3)} ${p(W * 1.1)} ${p(-L * 1.05)} ${p(W * 0.25)} ${p(-L * 0.98)} Q0 ${p(-L * 0.88)} ${p(-W * 0.25)} ${p(-L * 0.98)} C${p(-W * 1.1)} ${p(-L * 1.05)} ${p(-W * 1.2)} ${p(-L * 0.3)} 0 0Z`;
    case 'round':
    default:
      return `M0 0 C${p(W * 1.1)} ${p(-L * 0.25)} ${p(W)} ${p(-L * 0.95)} 0 ${p(-L)} C${p(-W)} ${p(-L * 0.95)} ${p(-W * 1.1)} ${p(-L * 0.25)} 0 0Z`;
  }
}

function leafPath(L: number) {
  return `M0 0 C${r2(L * 0.3)} ${r2(-L * 0.28)} ${r2(L * 0.75)} ${r2(-L * 0.22)} ${r2(L)} 0 C${r2(L * 0.75)} ${r2(L * 0.22)} ${r2(L * 0.3)} ${r2(L * 0.28)} 0 0Z`;
}

function escapeXml(s: string) {
  return s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!);
}

type Bloom = { x: number; y: number; size: number };

export function renderArtSvg(params: ArtParams, title = 'Botanical illustration'): string {
  const { width: w, height: h, palette: c } = params;
  const rng = mulberry32(params.seed);
  const defs: string[] = [];
  const back: string[] = [];
  const front: string[] = [];

  // Bloom placement
  const blooms: Bloom[] = [];
  const minSide = Math.min(w, h);
  if (params.composition === 'single') {
    blooms.push({ x: w * (0.45 + rng() * 0.1), y: h * (0.4 + rng() * 0.1), size: minSide * 0.34 });
  } else if (params.composition === 'cluster') {
    const n = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) {
      blooms.push({
        x: w * (0.15 + rng() * 0.7),
        y: h * (0.18 + rng() * 0.5),
        size: minSide * (0.12 + rng() * 0.16),
      });
    }
  } else {
    const n = 14 + Math.floor(rng() * 9);
    for (let i = 0; i < n; i++) {
      blooms.push({ x: w * (0.04 + rng() * 0.92), y: h * (0.3 + rng() * 0.55), size: minSide * (0.04 + rng() * 0.06) });
    }
  }
  blooms.sort((a, b) => a.size - b.size);

  // Stems & leaves
  for (const b of blooms) {
    const sway = (rng() - 0.5) * w * 0.12;
    back.push(
      `<path d="M${r2(b.x)} ${r2(b.y)} Q${r2(b.x + sway)} ${r2((b.y + h) / 2)} ${r2(b.x + sway * 0.4)} ${h + 4}" stroke="${c.leaf}" stroke-width="${r2(Math.max(2, b.size * 0.05))}" fill="none" stroke-linecap="round" opacity="0.9"/>`,
    );
    const leaves = params.composition === 'meadow' ? 1 : 2;
    for (let i = 0; i < leaves; i++) {
      const t = 0.45 + rng() * 0.35;
      const ly = b.y + (h - b.y) * t;
      const lx = b.x + sway * t;
      const dir = i % 2 === 0 ? -1 : 1;
      const ang = dir === 1 ? -25 - rng() * 25 : -155 + rng() * 25;
      back.push(
        `<path d="${leafPath(b.size * (0.7 + rng() * 0.5))}" transform="translate(${r2(lx)} ${r2(ly)}) rotate(${r2(ang)})" fill="${c.leaf}" opacity="${r2(0.75 + rng() * 0.2)}"/>`,
      );
    }
  }

  // Flowers
  blooms.forEach((b, idx) => {
    const gid = `pg${idx}`;
    defs.push(
      `<radialGradient id="${gid}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${r2(b.size)}"><stop offset="0" stop-color="${c.petalInner}"/><stop offset="0.75" stop-color="${c.petal}"/><stop offset="1" stop-color="${c.petal}" stop-opacity="0.92"/></radialGradient>`,
    );
    const parts: string[] = [];
    const n = params.petals + Math.floor(rng() * 3) - 1;
    for (let l = 0; l < params.layers; l++) {
      const L = b.size * (1 - l * 0.2);
      const W = L * (params.shape === 'pointed' ? 0.26 : 0.36) * (n < 8 ? 1.35 : 1);
      const offset = (l % 2) * (180 / n) + rng() * 8;
      const d = petalPath(params.shape, L, W);
      for (let i = 0; i < n; i++) {
        const a = (360 / n) * i + offset + (rng() - 0.5) * 6;
        parts.push(`<path d="${d}" transform="rotate(${r2(a)})" fill="url(#${gid})" stroke="${c.petalInner}" stroke-opacity="0.35" stroke-width="${r2(Math.max(0.5, b.size * 0.006))}"/>`);
      }
    }
    const cr = b.size * 0.17;
    parts.push(`<circle r="${r2(cr)}" fill="${c.center}"/>`);
    const dots = 12;
    for (let i = 0; i < dots; i++) {
      const a = ((Math.PI * 2) / dots) * i;
      parts.push(`<circle cx="${r2(Math.cos(a) * cr * 0.62)}" cy="${r2(Math.sin(a) * cr * 0.62)}" r="${r2(cr * 0.12)}" fill="${c.petalInner}" opacity="0.8"/>`);
    }
    front.push(`<g transform="translate(${r2(b.x)} ${r2(b.y)}) rotate(${r2(rng() * 360)})">${parts.join('')}</g>`);
  });

  // Drifting loose petals
  const loose: string[] = [];
  const looseCount = params.composition === 'meadow' ? 6 : 10;
  for (let i = 0; i < looseCount; i++) {
    const s = minSide * (0.015 + rng() * 0.03);
    loose.push(
      `<path d="${petalPath('round', s * 2, s * 0.9)}" transform="translate(${r2(rng() * w)} ${r2(rng() * h)}) rotate(${r2(rng() * 360)})" fill="${c.petal}" opacity="${r2(0.35 + rng() * 0.4)}"/>`,
    );
  }

  defs.push(
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.bg}"/><stop offset="1" stop-color="${c.bg2}"/></linearGradient>`,
    `<radialGradient id="glow" cx="${r2(0.3 + rng() * 0.4)}" cy="0.2" r="0.7"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.45"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`,
    `<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer></filter>`,
  );

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${escapeXml(title)}">`,
    `<title>${escapeXml(title)}</title>`,
    `<defs>${defs.join('')}</defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bg)"/>`,
    `<rect width="${w}" height="${h}" fill="url(#glow)"/>`,
    back.join(''),
    front.join(''),
    loose.join(''),
    `<rect width="${w}" height="${h}" filter="url(#grain)"/>`,
    `</svg>`,
  ].join('');
}
