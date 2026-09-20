# Build brief: cinematic scroll-morphing particle website

Build a single-page marketing website where a 3D swarm of glowing particles lives behind the content and
morphs into a different shape for each section as the visitor scrolls. The feel is dark, cinematic and premium:
deep-space black background, luminous particles, frosted-glass cards floating in 3D next to the shape.

**This brief describes the effect and the build quality, not the content.** Reuse the technique, layout and
polish, but design the shapes, colours and copy around *this* site's own theme. Don't reuse shapes from any
earlier project.

**Before building, work out from the site's theme:**
- What the site is about, who it's for, and the story the scroll should tell from top to bottom.
- 5–7 sections, each with **one particle shape that symbolises that section's idea for this brand**. Pick simple,
  instantly recognisable silhouettes that read well as dots: an object, an icon, a letterform, an abstract
  structure. As examples only: a fitness brand might go dumbbell → heartbeat line → running figure; a coffee
  brand might go bean → cup → steam swirl. Propose the shape list to me before writing code.
- A colour pair per section that fits the brand. The particle colours and the section's accent CSS variables must match.
- Copy and stats for the cards. Use real numbers only; if I haven't given any, ask rather than inventing them.

---

## Tech stack
- Next.js (App Router, TypeScript), React
- Three.js with a custom `ShaderMaterial` (no React Three Fiber needed)
- Plain CSS with custom properties, no UI framework
- Fonts via `next/font/google`: a geometric display font for headings (e.g. Sora) and Inter for body text
- No other runtime dependencies. Scroll handling, reveals and counters are hand-written.

## Page layout
- The colours and hex values below are defaults for a dark cinematic look. Swap the accents for the brand's own.
- **Fixed full-screen `<canvas>`** behind everything (z-index 0), then a fixed **vignette** overlay
  (radial darkening at the edges plus a top/bottom fade, `pointer-events: none`), then the content (z-index 2).
- **Header:** a fixed, centred, pill-shaped glass bar (max 1200px) with a logo on the left, nav links and a
  gradient CTA button on the right. On mobile the nav collapses into a hamburger with a glass dropdown panel.
- **Side section indicator:** fixed on the right edge, vertically centred. Each section has a number (01–06) and
  a short line; the active line grows longer and turns gradient. Labels appear on hover only so they never overlap
  content. Active state comes from an IntersectionObserver with `rootMargin: "-50% 0px -50% 0px"`. Hide it below 1100px.
- **Sections:** each is about 125vh tall, a 2-column grid. The text goes on one side and the particle shape plus
  stat cards on the other, alternating left and right from section to section. The hero is 100vh with a
  "scroll" mouse-icon hint at the bottom.
- **Contact section:** text and contact details on the left, form on the right. The form is **near-opaque**
  (about 92% dark background) with a soft brand-colour glow, so the shape behind it forms a halo and never makes
  the fields hard to read.
- **Footer:** a thin top border, small muted text, and a translucent dark background.

## The particle system (the core effect)
**Shapes:** write one generator per shape. Each returns a `Float32Array` of exactly `N` xyz points (N = 22,000 on
desktop, 9,000 on mobile). Every shape must have the same count.
- Use a **seeded PRNG** (mulberry32) so the scene looks identical on every load.
- **Shuffle** each shape's points, so particle *i* lands on a random part of every shape. Morphs then look like
  a swarm instead of a wipe.
- Build the theme's shapes from simple sampling primitives, combined as needed:
  - sphere surface (normalised gaussian vector)
  - filled volume (`cbrt(random)` radius)
  - line segments weighted by length (for outlines, grids, wireframes, network edges)
  - point-in-polygon rejection sampling (for any flat icon or logo outline defined as a 2D polygon)
  - rings and orbits
  - parametric curves (spirals, helices, waves)
- Mix densities: bright outlines and edges (about 35–45%), sparser fills, plus a few accent details.
- Keep flat shapes (panels, icons) facing the camera. Any idle rotation must stay small (±0.2 rad sway),
  otherwise a flat shape turns edge-on and becomes unreadable.

**Geometry:**
- Shape 0 goes in `position`. Shapes 1–5 go in extra attributes `p1`…`p5`.
- Add these attributes too:
  - `aScatter`: random points in a big shell, used for the intro fly-in
  - `aRand`: per-particle random 0–1
  - `aSize`: mostly small, with a few large ones (`0.45 + pow(r, 4) * 1.9`)
- Set a large `boundingSphere` so nothing gets frustum-culled.

**Vertex shader:**
- `pos = position*uW[0] + p1*uW[1] + … + p5*uW[5]`. The weight uniform array `uW[6]` does the blending.
- Mid-morph turbulence driven by `uTrans` (which is 0 when a shape is settled and 1 mid-transition):
  - rotate `pos.xz` by `uTrans * (1.1 + aRand * 2.4)`
  - push outward along `normalize(pos)` by `uTrans * (0.5 + aRand * 1.6)`
- Idle shimmer: a small sin/cos offset using `uTime` and `aRand`.
- Intro: `mix(aScatter, pos, clamp(ease(uIntro) * 1.2 - aRand * 0.2, 0, 1))`, so particles stream in with a
  stagger over about 2.6 seconds.
- Point size: `uSize * aSize * pixelRatio / -mvPosition.z` (perspective size attenuation).
- Twinkle varying: `0.6 + 0.4 * sin(uTime * 1.7 + aRand * 40)`.

**Fragment shader:**
- Soft round points: discard outside radius 0.5, and use alpha `pow(1 - 2d, 1.7)`.
- Colour: `mix(uColA, uColB, aRand)` plus a hot white core, `pow(alpha, 5) * 0.55`.
- Material settings: `AdditiveBlending`, `depthWrite: false`, `transparent: true`.

**Scroll → morph mapping:**
- Every frame, compute a **fractional section index** from the section centres. Example: 2.5 means the viewport
  centre is halfway between the centres of sections 2 and 3.
- Smooth it with frame-rate-independent damping: `p += (target - p) * (1 - pow(0.001, dt))`.
- `i = floor(p)`, `f = smoothstep(0.15, 0.85, p - i)`. Shapes hold still while the visitor reads and morph in
  between. Set `uW[i] = 1 - f` and `uW[i+1] = f`, and `uTrans = sin(PI * f)`.
- Lerp the colour pair and the **group offset** the same way. The shape sits at x = ±2.5 (opposite the text) on
  desktop, and centred higher up at a smaller scale on mobile.

**Extras:**
- Mouse parallax: the camera eases toward `pointer * (0.45, 0.3)` and keeps looking at the origin.
- A faint static starfield: about 1,400 tiny points far behind the scene.
- If `prefers-reduced-motion` is set: no intro, no turbulence or shimmer, and instant morphs.
- Wrap the `WebGLRenderer` creation in try/catch. On failure, add a `no-webgl` class that shows a static radial
  gradient background instead.
- Cap the pixel ratio at 2, and dispose of every geometry, material and the renderer on unmount.

## Floating glass stat cards
- Use two cards per section, placed on the shape's side: one at the top-left and one at the bottom-right, so they
  flank the shape.
- The card container has `perspective: 1100px`. Cards are tilted in 3D: `rotateY(±20deg) rotateX(4deg) rotateZ(∓2deg)`.
  They also react to the mouse via CSS variables `--mx` and `--my` (values from -1 to 1), which a single
  `pointermove` listener sets on `:root`.
- Card content:
  - a tiny uppercase letter-spaced label
  - a big number in the display font with a **gradient text fill** in the section's two colours
  - a short muted note
- Numbers **count up** (1.6s, ease-out quart) when the card scrolls into view.
- Glass style: `linear-gradient(150deg, rgba(22,30,48,.55), rgba(8,12,20,.35))`, a 1px border at
  `rgba(255,255,255,.09)`, `backdrop-filter: blur(16px) saturate(140%)`, an inset top highlight and a deep soft shadow.
- On mobile, cards sit in a static 2-column grid with no tilt.

## Light and dark themes
Ship both, with a toggle in the header. Default to the visitor's OS preference and remember their choice.
- Every colour is a CSS custom property on `:root` (light values). Dark values are redefined twice: under
  `:root[data-theme="dark"]`, and under `@media (prefers-color-scheme: dark)` scoped to
  `:root:not([data-theme="light"])`, so the OS preference applies until the visitor picks a theme.
- An inline script in `<head>` reads the saved choice from `localStorage` and sets `data-theme` **before first
  paint**, so there is no flash. Put `suppressHydrationWarning` on `<html>`.
- The toggle's sun/moon icons swap through those same CSS selectors, not React state, so server and client HTML match.
- The particle scene needs a **different palette and blending per theme**: dark uses neon colours with
  `AdditiveBlending` and a white-hot core, light uses saturated inks with `NormalBlending` and a *darkened* core
  (additive glow is invisible on a light background). Pass a `uDark` uniform and `mix()` between the two in the
  fragment shader. On toggle, swap the palette, set `material.blending` with `material.needsUpdate = true`, and
  adjust opacity (light needs slightly lower). The scene listens for a custom `themechange` event plus the
  `prefers-color-scheme` media query.
- On light backgrounds, headings on mobile should be solid ink rather than a gradient fill, since the text sits
  directly over the particles.

## Visual style
- Background `#030508`. Text `#eaf0f8`. Muted text `#95a3b9`. Hairline borders `rgba(255,255,255,.09)`.
- Each section sets its own `--c1`/`--c2` accent pair, matched to its particle colours. These drive the eyebrow
  text, bullet dots and stat gradients.
- **Headings:** large and tight (h1 `clamp(2.5rem, 5.6vw, 5.2rem)`, line-height 1.02, letter-spacing -0.035em),
  with a white-to-cool-grey gradient text fill and `text-wrap: balance`.
- **Eyebrow:** 12px, uppercase, 0.2em letter-spacing, in the accent colour, with a short gradient line before it.
- **Buttons:**
  - Primary: pill shape with a brand gradient and a coloured glow shadow; it lifts 2px on hover.
  - Ghost: a thin translucent border.
- **Feature bullets:** pill "chips" with a glowing accent dot.
- **Reveal on scroll:** fade in and rise 30px over 1s using `cubic-bezier(0.2, 0.8, 0.2, 1)`, via an
  IntersectionObserver at threshold 0.25.

## Mobile (below 820px)
- Single column. Each section gets about 46vh of top padding, so the shape floats in the upper part of the screen
  and the text scrolls up beneath it.
- Particles: 9,000 at 60% opacity, scaled to 0.5 and offset upward. Add a text shadow on copy for readability.
- The header shows only the logo and hamburger. The form fields stack into one column.

## Contact form
- Fields: name, company, work email, a service dropdown, and project details.
- With no backend, submit builds a `mailto:` link with the subject and body pre-filled. Later, swap this for a
  real form service.
- Inputs: faint white background, a 16% white border, a brighter border on hover, and a brand-colour border plus
  a 3px glow ring on focus.

## Acceptance checks
- `next build` passes with no type errors.
- Each shape is clearly recognisable when settled, and morphs swirl smoothly between them.
- No text overlaps the side nav, and form fields are fully readable over the particles.
- At 390px mobile width there is no horizontal scroll and the text is readable over the shape.
- Smooth 60fps on a mid-range laptop.
