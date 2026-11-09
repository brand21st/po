# Poopoli 2027 Flower Show

An immersive, scroll-driven website for a flower show, built as an npm-workspaces monorepo.

> **Placeholder content.** The show name ("Poopoli 2027"), dates (May 13–17, 2027) and venue (Halden Glasshouse Gardens, Portland) are invented.
> Edit them in one place: [`packages/shared/src/show.ts`](packages/shared/src/show.ts).

```
flower-show/
├── apps/
│   ├── web/        Vite + React 18 + TS: all UI and scroll animation (port 5173)
│   └── api/        Next.js 14 App Router, API only: Route Handlers in app/api/* (port 3001)
├── packages/
│   └── shared/     Zod schemas + types, show config, generative SVG art renderer
└── package.json    workspaces + root scripts
```

## Quick start

```bash
npm install
npm run dev        # starts api (:3001) and web (:5173) together
```

Open http://localhost:5173. In dev the web app calls `/api/*` on its own origin, and Vite proxies those calls to `:3001`.

| Script | What it does |
| --- | --- |
| `npm run dev` | API + web in watch mode (via `concurrently`) |
| `npm run build` | `next build` then `tsc && vite build` |
| `npm run start` | Serves both production builds |
| `npm run typecheck` | Strict `tsc --noEmit` in every workspace |

## Environment

| App | Variable | Purpose |
| --- | --- | --- |
| api | `ALLOWED_ORIGIN` | Comma-separated origins allowed by CORS (e.g. `https://poopoli.example`). Default in `.env.local`: `http://localhost:5173` |
| web | `VITE_API_URL` | API base URL. Leave empty in dev (proxy). In production set it to the API origin. |

See `apps/api/.env.example` and `apps/web/.env.example`.

## API

All responses are validated against the shared Zod schemas on the client.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | Liveness |
| GET | `/api/exhibits[?featured=true]` | Gardens |
| GET | `/api/exhibits/:slug` | One garden (404 if unknown) |
| GET | `/api/events[?day=YYYY-MM-DD]` | Schedule |
| GET | `/api/gallery` | Gallery images |
| GET | `/api/tickets` | Ticket types (prices in paise) |
| POST | `/api/orders` | Demo booking. Totals are computed server-side. **No payment is taken.** |
| POST | `/api/newsletter` | Idempotent signup |
| GET | `/api/art/:id` | Deterministic generative SVG, the stand-in imagery |

CORS lives in [`apps/api/middleware.ts`](apps/api/middleware.ts). It answers `OPTIONS` preflights with `204` for allowed origins and `403` for everything else.

Data is in-memory ([`apps/api/lib/data.ts`](apps/api/lib/data.ts), [`lib/store.ts`](apps/api/lib/store.ts)), so orders and subscribers reset on restart.

## Front end

- **Scroll engine:** GSAP + ScrollTrigger (+ SplitText). Smooth scrolling and `data-scroll-speed` parallax come from Locomotive Scroll v5, which is built on Lenis. Its render loop runs on GSAP's ticker and its scroll events call `ScrollTrigger.update` ([`providers/SmoothScroll.tsx`](apps/web/src/providers/SmoothScroll.tsx)).
- **Locomotive parallax:** used on the Story depth stack, the Seasons images and the Newsletter bloom. Components call `useLocomotiveParallax(ref)` so their `[data-scroll]` elements register on mount and on route changes. Locomotive writes inline transforms, so put `data-scroll-speed` on a wrapper that GSAP doesn't animate. Parallax is off on touch devices and for reduced-motion users.
- **Per-section timelines:** every section owns its timeline via `useGSAP` (a scoped `gsap.context`, reverted on unmount) and `gsap.matchMedia()` for motion and breakpoint branches.
- **Framer Motion:** only micro-interactions (buttons, mobile menu, lightbox, FAQ, form states).
- **Data and forms:** TanStack Query for data; react-hook-form + shared Zod schemas for forms.

### Home narrative

1. **Hero, "The Bloom":** pinned. An SVG bud opens layer by layer as you scroll, light blooms behind it, and a canvas of petals drifts with depth parallax. The title reveals letter by letter, and a cream wash grows from the flower's heart into the next section.
2. **Story:** masked line-by-line SplitText reveal, next to a three-depth parallax image stack.
3. **Featured gardens:** pinned horizontal travel with clip-path and scale card reveals (`containerAnimation`). Keyboard focus scrolls to the focused card. **Mobile / reduced motion:** a native CSS scroll-snap carousel with no pinning.
4. **Seasons:** the background tweens CSS variables from spring to summer to autumn.
5. **Numbers:** counters animate on enter. Screen readers get the final values.
6. **Schedule:** a vine SVG grows as you scroll (`stroke-dashoffset`), and items slide in. Data: `GET /api/events`.
7. **Gallery:** CSS-columns masonry with lazy images, a `ScrollTrigger.batch` stagger, and a lightbox (focus trap, Esc, arrow keys, swipe). Data: `GET /api/gallery`.
7½. **Golden Hour:** placed after Seasons. A sunrise in three scrubbed beats (*First light → The field wakes → Dew & gold*) on a CSS-sticky stage, so the page keeps only two GSAP pins. Effects: an arch window parting like curtains, an iris reveal, a rack-focus wipe, a rising sun flare, dew glints and a sun clock. It ends on a twilight-ticket CTA, and reduced motion gets a static editorial layout. The art direction, sampled palette and image-regeneration prompts are in [`docs/golden-hour-meta-prompt.md`](docs/golden-hour-meta-prompt.md).
8. **Tickets:** curtains part to reveal the passes. Data: `GET /api/tickets`.
9. **Newsletter:** signup form (RHF + Zod) → `POST /api/newsletter`.

Routes: `/`, `/exhibits/:slug`, `/tickets` (full booking form → confirmation), `/visit`.

### Accessibility and performance

- `prefers-reduced-motion`: Lenis is off, there's no pinning or scrubbing, content renders in its final state and the petal canvas isn't drawn.
- Skip link, landmarks, labelled sections, visible focus rings and 44px touch targets. Text colour tokens meet WCAG AA on their backgrounds (`petal-deep`, `gold-deep` and `ink-soft` are the text-safe variants).
- Only transforms, opacity and clip-path are animated. The canvas pauses off-screen and in hidden tabs, and DPR is capped at 2.
- Pinned sections use `refreshPriority`, and data-driven sections call `ScrollTrigger.refresh()` once their content arrives.

## Photography

The reference photos live in `apps/web/src/assets/photos/`. vite-imagetools turns them into AVIF/WebP/JPG at build time (`src/lib/photos.ts`), and `<Photo>` renders a `<picture>` with intrinsic size. The sources are small (246–506px wide); the meta prompt has nano-banana prompts for 2× masters.

## Replacing the stand-in imagery

All images come from `GET /api/art/:id` (SVG generated by `packages/shared/src/art.ts`). To use photography:

1. Point each `image.src` in `apps/api/lib/data.ts` at your CDN, or at files in `apps/web/public`.
2. For AVIF/WebP generation, add [`vite-imagetools`](https://github.com/JonasKruckenberg/imagetools) and import images with `?format=avif;webp&as=picture`, or pre-generate them in your CMS.

## Before going live

- Swap the in-memory store for a database, and add a real payment provider to `/api/orders`.
- Add rate limiting and bot protection (e.g. a CAPTCHA) to `/api/newsletter` and `/api/orders`.
- Set `ALLOWED_ORIGIN` and `VITE_API_URL` for production.
