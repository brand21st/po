# Golden Hour: meta prompt

A reusable brief for building, extending, or regenerating the **Golden Hour** scroll scene and its
photography. Give it to a designer, a coding agent, or an image model. Each part says which of
the installed skills it draws on.

---

## 0. The prompt (copy this)

> **Role:** You are a senior creative front-end engineer building an award-level, scroll-driven
> scene for **Poopoli 2027**, a flower show (May 13–17, 2027, Halden Glasshouse Gardens).
>
> **Goal:** Make the visitor *feel* a sunrise in a flower meadow, then turn that feeling into one
> action: booking a ticket. The scene is the emotional peak of the home page, placed after the
> Seasons colour journey and before the Numbers section.
>
> **Visual language** (from the reference photos, §1): backlit golden-hour light, very shallow
> depth of field, creamy bokeh, dew on petals, a peach/apricot/rose palette that warms as it
> rises, and layered depth (sharp hero bloom → soft midground field → blurred sunlit background).
> Style family: *Nature Distilled* (warm earth tones, soft grain, gentle parallax, natural
> ease-out motion).
>
> **Motion script** (§3): one sticky stage, scrubbed by scroll, in three beats:
> **First light → The field wakes → Dew & gold**, ending on a calm CTA. The camera *racks focus*
> and the sun *rises* as you scroll. Motion is slow and deliberate, never bouncy.
>
> **Hard constraints:** transform/opacity/clip-path only. No more than two GSAP pins on the page
> (use CSS `position: sticky`). Respect `prefers-reduced-motion` with a complete static layout.
> Text contrast ≥ 4.5:1 over photography (use a measured scrim). Never upscale the source photos
> past their native size. Mobile-first: works with native touch scrolling at 375px.
>
> **Stack:** React 18 + TS, Tailwind tokens, GSAP ScrollTrigger + SplitText, Locomotive Scroll v5
> (Lenis) for smooth scroll and `data-scroll-speed` parallax, vite-imagetools for AVIF/WebP.

---

## 1. Reference analysis

Four distinct images were supplied; two of the five uploads were identical. Colours were sampled
with sharp: mean colour, plus a 4×6 grid from top to bottom.

| File | What it gives us | Mean | Light → shadow |
| --- | --- | --- | --- |
| `dew-daisy.png` (506×740) | **Hero subject.** Single pink daisy, dew drops, sun flare top-right, strong subject/background separation | `#C37C7C` | `#FCD499` → `#663637` |
| `peach-dahlias.webp` (506×740) | **Midground.** Dense peach dahlia field, hazy sunlit horizon, layered rows of blooms | `#CC9A7F` | `#FDF8EC` → `#55422A` |
| `wildflower-meadow.png` (335×597) | **Atmosphere.** Mixed cosmos, lavender and marigold meadow, low sun through trees, deep bokeh | `#B1845E` | `#E8C8A9` → `#6F5634` |
| `cosmos-field.png` (246×360) | **Accent.** Pink and butter cosmos, painterly softness | `#CC9776` | `#FAE9D7` → `#774D22` |

**Shared traits to preserve:**
1. **Light from upper right, behind the subject.** Rim-lit petal edges and warm haze. Anything
   added (flares, glows, gradients) comes from the top-right and moves *up* as the scroll
   progresses: the sun rises.
2. **Shallow depth of field.** One sharp plane per frame and everything else melts. This licenses
   the *rack focus* move and lets blur hide low-resolution backgrounds.
3. **A palette that warms with height.** Cream and butter at the top, peach and rose in the
   middle, umber in the stems.
4. **Dew drops.** Tiny specular highlights: small glints that twinkle, never confetti.

### Derived tokens (added to `styles/index.css` and `tailwind.config.ts` as `sun-*`)

| Token | Hex | Use |
| --- | --- | --- |
| `sun-cream` | `#FDF8EC` | Highlights, text on dark scrim |
| `sun-peach` | `#F1CCA4` | Section background, dawn haze |
| `sun-apricot` | `#E9A477` | Flare core, accents |
| `sun-honey` | `#DEAA72` | Gradient mid-stops |
| `sun-rose` | `#DC8797` | Bloom accents (decorative only; not for text on peach) |
| `sun-umber` | `#55422A` | Text scrim base, the shadow side |

Contrast: `sun-cream` on a `sun-umber` scrim at ≥ 70% opacity is ≈ 9:1. Body copy on `sun-peach`
uses `ink` (`#1A1714`), ≈ 13:1.

---

## 2. Skill inputs

| Skill | What it contributed |
| --- | --- |
| **scroll-experience** | Story beats (hook → journey → climax → resolution). Enhance scroll, never hijack it. Animate key moments only. Mobile-first with simpler effects on touch. |
| **ui-ux-pro-max** | Style match *Nature Distilled* (warm tones, grain, subtle parallax, ease-out). GSAP preset *Scroll Reveal / Complex*: scrubbed pinned timeline, `scrub` 0.5–1.5, refresh after images load. Its rule *"don't pin more than 1–2 sections per page"* → the scene uses CSS sticky. Plus §1 contrast, §3 performance (AVIF/WebP, intrinsic sizes, lazy-load), §7 animation (`parallax-subtle`, `reduced-motion`, `opacity-threshold`, `excessive-motion`). The first design-system query suggested purple/orange "Vibrant & Block-based"; it was **rejected as off-brief** and the narrower style query used instead, as the skill instructs. |
| **locomotive-scroll** | Smooth scroll on Lenis via Locomotive v5; `data-scroll-speed` parallax on the Story stack using the same photos. Parallax stays off for touch and reduced motion. |
| **nano-banana** | Regeneration prompts in §5 for 2048px masters. **Not run:** no Gemini API key is configured yet. |
| **design / brand / design-system** | Token architecture (primitive hex → semantic `sun-*` → component usage) and the voice of the copy (calm, sensory, second person). |

---

## 3. Motion script

The scene is a tall section (`~340svh` desktop, `~280svh` mobile) holding a **sticky full-height
stage**. A single GSAP timeline is scrubbed against the section (`scrub: 1`).

| Progress | Beat | Visual | Copy |
| --- | --- | --- | --- |
| 0 → 0.08 | *Arrive* | Stage fades up from Seasons' autumn tone. Blurred meadow backdrop at 115% scale, dawn veil (umber) at 55%. The arch window opens like curtains parting (clip-path from a sliver). | – |
| 0.08 → 0.36 | **1 · First light** | The meadow is sharp inside the arch, scaling 1.12 → 1. The sun flare climbs from lower right. A sun clock ticks 05:52 → 06:10. | "First light, 05:52" / *The gates open before the sun does.* |
| 0.36 → 0.64 | **2 · The field wakes** | **Iris reveal:** the dahlia field opens from the centre of the arch (circle clip 0 → 75%), zooming 1.2 → 1. Backdrop crossfades meadow → dahlias. The veil lifts. Left satellite (cosmos, round frame) drifts upward. | "The field wakes" / *Ten thousand blooms turn toward the light.* |
| 0.64 → 0.9 | **3 · Dew & gold** | **Rack focus:** the dew daisy rises into the arch from below (curtain wipe), sharp; the field behind is now the blurred backdrop. Dew glints twinkle on the arch. The flare reaches full warmth. | "Dew & gold" / *Arrive early. Stay for the gold.* |
| 0.9 → 1 | *Resolve* | Copy settles. CTA "Book a twilight entry" fades in (it can't be focused while hidden). The veil warms to peach for the hand-off to Numbers. | CTA |

Easing: scrubbed tweens use `none`/`power1.inOut` (scroll is the clock). Copy reveals use
`expo.out` 1.0–1.2s, with SplitText word masks and a 0.04s stagger. Nothing elastic.

**Reduced motion:** no tall section and no sticky stage. A composed static editorial layout: arch
with the daisy, the dahlia field and meadow as framed photos, all three captions visible, CTA
visible.

---

## 4. Implementation contract

- `src/sections/GoldenHour.tsx`: the scene. One `useGSAP` scope; `gsap.matchMedia()` branches
  for motion/no-motion and mobile/desktop. Reverted on unmount.
- `src/lib/photos.ts`: imagetools imports (`?format=avif;webp;jpg&as=picture`) plus tiny
  pre-blurred backdrops (`?w=96&blur=6`).
- `src/components/Photo.tsx`: `<picture>` with intrinsic `width`/`height`, a tone placeholder and
  lazy loading.
- Story section: the three-depth parallax stack uses the photos (Locomotive `data-scroll-speed`).
- `ScrollTrigger.refresh()` runs after images load (the sticky section's height is static, but
  later triggers depend on it).
- Accessibility: one `h2` for the scene. Captions are real text, not images. Decorative layers
  are `aria-hidden`. Every photo has an `alt` (§1). The CTA is reachable by keyboard once visible.

---

## 5. Regenerating the photography (nano-banana)

The supplied photos are 246–506px wide. That's fine for framed, near-native display, but it's
the main quality limit on large and high-DPI screens. Once a Gemini key is configured
(`gemini extensions config nanobanana "API Key"`), generate 2× masters in the same light:

```bash
gemini --yolo "/generate 'macro photograph of a single pink daisy with dew drops on its petals, backlit by low golden sunrise from the upper right, creamy bokeh, peach and apricot haze, shallow depth of field, 85mm f/1.8, portrait orientation, no text' --aspect=2:3 --count=3"
gemini --yolo "/generate 'dense field of peach and blush dahlias at sunrise, hazy golden light, soft focus horizon with trees, layered rows of blooms, shallow depth of field, portrait orientation, no text' --aspect=2:3 --count=3"
gemini --yolo "/generate 'wildflower meadow of pink cosmos, lavender and orange marigolds at sunrise, sun flaring through trees from upper right, dreamy bokeh, warm cinematic grade, portrait orientation, no text' --aspect=9:16 --count=3"
gemini --yolo "/generate 'soft painterly photograph of pink and pale butter-yellow cosmos flowers, warm diffuse morning light, cream background haze, portrait orientation, no text' --aspect=2:3 --count=3"
```

Then replace the files in `apps/web/src/assets/photos/`, keeping the names. Update `tone` in
`src/lib/photos.ts` if the mean colour shifts. Review `--yolo` before running: it lets Gemini
act without asking.

**Negative prompt / avoid:** text, watermarks, people, harsh midday light, saturated magenta,
HDR halos, cool blue casts.
