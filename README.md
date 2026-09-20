# DSR — Driving Sustainable Renewables

Marketing site for DSR, an independent technical services firm for solar and battery energy storage.

A single-page site where a WebGL particle swarm morphs through a different shape for each section as you
scroll: the DSR logo on load, then sun → solar panel → battery → lightning bolt → data network → globe.
Light and dark themes, with a toggle that remembers the visitor's choice.

## Stack
- Next.js (App Router) + TypeScript
- Three.js with a custom shader (no other runtime dependencies)
- Plain CSS with custom properties

## Local development
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where things live
| Path | What it holds |
| --- | --- |
| `lib/content.ts` | All copy and the stat figures |
| `lib/shapes.ts` | Particle shape generators |
| `components/ParticleScene.tsx` | The WebGL scene and scroll→morph logic |
| `app/globals.css` | Design tokens, layout and both themes |

## Before going live
- The figures in `lib/content.ts` are **placeholders** — replace them with numbers the client confirms.
- The contact form opens the visitor's mail app (`mailto:`). Swap in a form service for real submissions.
