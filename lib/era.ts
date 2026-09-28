/* The forms the home page travels through.

   Every form here is the same sheet of panels, bent a different way. That is the whole trick:
   a particle keeps its place on the sheet — which row, which cell, where inside that cell — no
   matter which form is being drawn, so when one becomes the next the structure travels with it
   instead of dissolving into noise and reassembling.

   The sheet is read as a grid rather than scattered at random, which is what makes the rows and
   columns show as combed lines, and what lets it read as panels rather than dust. */

type Pt = [number, number, number];

/** Deterministic per-particle jitter, so the same speck sits the same way in every form. */
const wobble = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};

/** How many cells across and down the sheet. Around 20,000 points land one per cell. */
const COLS = 220;
const ROWS = 92;

function build(count: number, place: (u: number, v: number, i: number) => Pt) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS) % ROWS;
    // A little spread inside the cell, held away from the edges so the gaps between cells
    // stay dark — that is what reads as the lines on a panel.
    const u = (col + 0.5 + wobble(i, 1) * 0.62) / COLS;
    const v = (row + 0.5 + wobble(i, 2) * 0.62) / ROWS;
    out.set(place(u, v, i), i * 3);
  }
  return out;
}

/** The sheet closed into a ring facing the viewer. Hollow, so the middle stays dark and the
    copy can sit in it, and dense at the rim where the tube turns away. */
export function ring(count: number) {
  // Wide, with a slim tube, so the hole it leaves is large enough to set the copy inside.
  const R = 4.05;
  return build(count, (u, v, i) => {
    const a = u * Math.PI * 2;
    const b = v * Math.PI * 2;
    // a slow swell around the ring, so the rim is not a clean circle
    const r = 0.72 + Math.sin(a * 5 + b * 2) * 0.1 + Math.sin(a * 13) * 0.04 + wobble(i, 3) * 0.02;
    const d = R + r * Math.cos(b);
    return [d * Math.cos(a), d * Math.sin(a), r * Math.sin(b) * 1.15];
  });
}

/** The same ring drawn out into a drum around the viewer — the moment of passing through it. */
export function drum(count: number) {
  return build(count, (u, v, i) => {
    const a = u * Math.PI * 2;
    const rad = 3.0 + Math.sin(a * 7 + v * 6) * 0.16 + wobble(i, 4) * 0.03;
    return [Math.cos(a) * rad, Math.sin(a) * rad, (v - 0.5) * 15];
  });
}

/** The sheet laid down as rows of panels running away to the horizon. */
export function array(count: number) {
  return build(count, (u, v, i) => {
    // v walks back through the rows; the spacing opens up towards the viewer
    const row = v;
    const z = 4.5 - Math.pow(row, 0.8) * 15;
    const spread = 13 - row * 3.2;
    const x = (u - 0.5) * spread;
    // each row is a tilted face, lifted a little as it recedes
    const tilt = (((v * ROWS) % 1) - 0.5) * 0.75;
    return [x, -1.35 + tilt + row * 1.5 + wobble(i, 5) * 0.02, z];
  });
}

/** The sheet flattened and rippling, low in the frame. */
export function wave(count: number) {
  return build(count, (u, v, i) => {
    const x = (u - 0.5) * 16;
    const z = (v - 0.5) * 10 - 1.5;
    const h =
      Math.sin(x * 0.4) * 0.4 + Math.sin(x * 0.16 + z * 0.3) * 0.5 + Math.cos(z * 0.5) * 0.24;
    return [x, -2.2 + h + wobble(i, 6) * 0.03, z];
  });
}

/** The sheet wound into a slow spiral, its middle left empty. */
export function spiral(count: number) {
  return build(count, (u, v, i) => {
    const t = 0.18 + Math.pow(v, 0.7) * 0.95;
    const a = u * Math.PI * 2 + t * 4.6;
    const rad = t * 4.8;
    return [
      Math.cos(a) * rad + wobble(i, 7) * 0.1,
      wobble(i, 8) * 0.28,
      Math.sin(a) * rad + wobble(i, 9) * 0.1,
    ];
  });
}

/** In the order the page travels through them. */
export const FORMS = [ring, drum, array, wave, spiral, spiral];
