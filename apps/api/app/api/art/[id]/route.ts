import { renderArtSvg } from '@flower/shared';
import { getArt } from '@/lib/data';
import { error } from '@/lib/http';

/** GET /api/art/:id — deterministic SVG artwork (stand-in imagery). */
export function GET(_req: Request, { params }: { params: { id: string } }) {
  const entry = getArt(params.id.replace(/\.svg$/, ''));
  if (!entry) return error(404, 'Artwork not found');
  return new Response(renderArtSvg(entry.params, entry.title), {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      // SVG is served as an image; forbid script execution if opened directly.
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}
