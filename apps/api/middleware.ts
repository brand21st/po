import { NextResponse, type NextRequest } from 'next/server';

/**
 * CORS for every /api/* route.
 * Only origins listed in ALLOWED_ORIGIN (comma-separated) get CORS headers.
 */
function allowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGIN ?? '';
  return raw
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');
  const isAllowed = origin !== null && allowedOrigins().includes(origin);

  if (req.method === 'OPTIONS') {
    if (!isAllowed) {
      return new NextResponse(null, { status: 403, headers: { Vary: 'Origin' } });
    }
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
  }

  const res = NextResponse.next();
  res.headers.set('Vary', 'Origin');
  if (isAllowed) {
    for (const [k, v] of Object.entries(corsHeaders(origin))) res.headers.set(k, v);
  }
  return res;
}

export const config = {
  matcher: '/api/:path*',
};
