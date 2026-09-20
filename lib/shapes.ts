// Particle target shapes. Every generator returns `count` xyz points (Float32Array of length count*3).
// The shader blends between these arrays as the user scrolls, so all shapes share the same count.

type Rng = () => number;

// Deterministic PRNG so the scene looks identical on every load.
function mulberry32(seed: number): Rng {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gauss = (r: Rng) => {
  const u = 1 - r();
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

function randomDir(r: Rng): [number, number, number] {
  const x = gauss(r), y = gauss(r), z = gauss(r);
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
}

// Shuffle so that particle i lands on a random part of each shape; this makes morphs look like a swarm
// rather than a wipe.
function shuffle(out: Float32Array, r: Rng) {
  const n = out.length / 3;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    for (let k = 0; k < 3; k++) {
      const t = out[i * 3 + k];
      out[i * 3 + k] = out[j * 3 + k];
      out[j * 3 + k] = t;
    }
  }
  return out;
}

function rotate(out: Float32Array, rx: number, ry: number) {
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  for (let i = 0; i < out.length; i += 3) {
    const x = out[i];
    const y = out[i + 1] * cx - out[i + 2] * sx;
    const z = out[i + 1] * sx + out[i + 2] * cx;
    out[i] = x * cy + z * sy;
    out[i + 1] = y;
    out[i + 2] = -x * sy + z * cy;
  }
  return out;
}

// Samples a point along a random segment of a polyline, weighted by segment length.
function segmentSampler(segs: [number, number, number, number, number, number][]) {
  const lens = segs.map(([a, b, c, d, e, f]) => Math.hypot(d - a, e - b, f - c));
  const total = lens.reduce((s, l) => s + l, 0);
  return (r: Rng): [number, number, number] => {
    let t = r() * total;
    let i = 0;
    while (t > lens[i] && i < lens.length - 1) t -= lens[i++];
    const [a, b, c, d, e, f] = segs[i];
    const u = r();
    return [a + (d - a) * u, b + (e - b) * u, c + (f - c) * u];
  };
}

function pointInPolygon(x: number, y: number, poly: [number, number][]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Sun: glowing sphere + corona rays. */
export function sun(count: number) {
  const r = mulberry32(11);
  const out = new Float32Array(count * 3);
  const R = 1.45;
  const rays = 14;
  for (let i = 0; i < count; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.58) {
      const d = randomDir(r);
      const rr = R * (1 + gauss(r) * 0.02);
      p = [d[0] * rr, d[1] * rr, d[2] * rr];
    } else if (k < 0.7) {
      // soft inner glow
      const d = randomDir(r);
      const rr = R * Math.cbrt(r()) * 0.95;
      p = [d[0] * rr, d[1] * rr, d[2] * rr];
    } else {
      const a = (Math.floor(r() * rays) / rays) * Math.PI * 2 + 0.11;
      const t = R * 1.22 + Math.pow(r(), 1.6) * 1.25;
      p = [Math.cos(a) * t + gauss(r) * 0.035, Math.sin(a) * t + gauss(r) * 0.035, gauss(r) * 0.05];
    }
    out.set(p, i * 3);
  }
  return shuffle(out, r);
}

/** Solar panel: cell grid on a tilted frame with a mounting post. */
export function solarPanel(count: number) {
  const r = mulberry32(22);
  const out = new Float32Array(count * 3);
  const W = 4.4, H = 2.7, cols = 10, rows = 6, gap = 0.07;
  const cw = W / cols, ch = H / rows;
  for (let i = 0; i < count; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.42) {
      // grid lines between cells
      if (r() < 0.5) {
        const c = Math.floor(r() * (cols + 1));
        p = [-W / 2 + c * cw, -H / 2 + r() * H, 0];
      } else {
        const rw = Math.floor(r() * (rows + 1));
        p = [-W / 2 + r() * W, -H / 2 + rw * ch, 0];
      }
      p[0] += gauss(r) * 0.008;
      p[1] += gauss(r) * 0.008;
    } else if (k < 0.86) {
      // cell surfaces (sparser, leaves the busbar gaps dark)
      const c = Math.floor(r() * cols), rw = Math.floor(r() * rows);
      p = [-W / 2 + c * cw + gap + r() * (cw - 2 * gap), -H / 2 + rw * ch + gap + r() * (ch - 2 * gap), gauss(r) * 0.01];
    } else if (k < 0.93) {
      // frame thickness
      p = [-W / 2 + r() * W, (r() < 0.5 ? -1 : 1) * (H / 2), -0.08 * r()];
    } else {
      // post + base, added in panel space before tilt
      if (r() < 0.75) p = [gauss(r) * 0.04, -r() * 2.3, -0.35 + gauss(r) * 0.04];
      else p = [(r() - 0.5) * 1.3, -2.3, -0.35 + (r() - 0.5) * 0.7];
    }
    out.set(p, i * 3);
  }
  rotate(out, -0.95, -0.45);
  for (let i = 1; i < out.length; i += 3) out[i] += 0.35;
  return shuffle(out, r);
}

/** Battery: box outline, terminal, and glowing charge bars. */
export function battery(count: number) {
  const r = mulberry32(33);
  const out = new Float32Array(count * 3);
  const w = 1.8, h = 3.1, d = 1.1, y0 = -0.25;
  const x0 = -w / 2, x1 = w / 2, yA = y0 - h / 2, yB = y0 + h / 2, z0 = -d / 2, z1 = d / 2;
  const edges = segmentSampler([
    [x0, yA, z0, x1, yA, z0], [x0, yB, z0, x1, yB, z0], [x0, yA, z1, x1, yA, z1], [x0, yB, z1, x1, yB, z1],
    [x0, yA, z0, x0, yB, z0], [x1, yA, z0, x1, yB, z0], [x0, yA, z1, x0, yB, z1], [x1, yA, z1, x1, yB, z1],
    [x0, yA, z0, x0, yA, z1], [x1, yA, z0, x1, yA, z1], [x0, yB, z0, x0, yB, z1], [x1, yB, z0, x1, yB, z1],
  ]);
  const bars = 4, bh = 0.5, bgap = 0.16;
  for (let i = 0; i < count; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.34) {
      p = edges(r);
      p = [p[0] + gauss(r) * 0.012, p[1] + gauss(r) * 0.012, p[2] + gauss(r) * 0.012];
    } else if (k < 0.5) {
      // faint front/back faces
      p = [x0 + r() * w, yA + r() * h, r() < 0.5 ? z0 : z1];
    } else if (k < 0.57) {
      // terminal nub
      const a = r() * Math.PI * 2, rr = 0.32 * Math.sqrt(r());
      p = [Math.cos(a) * rr, yB + r() * 0.28, Math.sin(a) * rr];
    } else {
      // charge bars (filled volume), bottom to top
      const b = Math.floor(r() * bars);
      const by = yA + 0.22 + b * (bh + bgap);
      p = [x0 + 0.2 + r() * (w - 0.4), by + r() * bh, z0 + 0.2 + r() * (d - 0.4)];
    }
    out.set(p, i * 3);
  }
  rotate(out, 0.12, 0.55);
  return shuffle(out, r);
}

/** Lightning bolt with an orbiting energy ring. */
export function bolt(count: number) {
  const r = mulberry32(44);
  const out = new Float32Array(count * 3);
  const poly: [number, number][] = [
    [0.15, 2.35], [1.15, 2.35], [0.4, 0.55], [1.25, 0.55], [-0.65, -2.45], [-0.05, -0.2], [-0.95, -0.2],
  ];
  const outline = segmentSampler(
    poly.map((p, i) => {
      const q = poly[(i + 1) % poly.length];
      return [p[0], p[1], 0, q[0], q[1], 0] as [number, number, number, number, number, number];
    }),
  );
  for (let i = 0; i < count; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.5) {
      let x = 0, y = 0;
      do {
        x = -1 + r() * 2.3;
        y = -2.5 + r() * 4.9;
      } while (!pointInPolygon(x, y, poly));
      p = [x, y, (r() - 0.5) * 0.45];
    } else if (k < 0.82) {
      const q = outline(r);
      p = [q[0] + gauss(r) * 0.015, q[1] + gauss(r) * 0.015, (r() < 0.5 ? -1 : 1) * 0.22 + gauss(r) * 0.01];
    } else {
      const a = r() * Math.PI * 2;
      const rr = 2.7 + gauss(r) * 0.05;
      const q: [number, number, number] = [Math.cos(a) * rr, gauss(r) * 0.03, Math.sin(a) * rr * 0.35];
      // tilt ring
      const t = 0.5;
      p = [q[0] * Math.cos(t) - q[1] * Math.sin(t), q[0] * Math.sin(t) + q[1] * Math.cos(t), q[2]];
    }
    out.set(p, i * 3);
  }
  rotate(out, 0, 0.3);
  return shuffle(out, r);
}

/** Data network: nodes linked to their nearest neighbours. */
export function network(count: number) {
  const r = mulberry32(55);
  const out = new Float32Array(count * 3);
  const nodes: [number, number, number][] = [];
  for (let i = 0; i < 64; i++) {
    const d = randomDir(r);
    const rr = 2.4 * (0.55 + 0.45 * Math.cbrt(r()));
    nodes.push([d[0] * rr * 1.1, d[1] * rr * 0.95, d[2] * rr]);
  }
  const segs: [number, number, number, number, number, number][] = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, dist: Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) }))
      .filter((o) => o.j > i)
      .sort((x, y) => x.dist - y.dist)
      .slice(0, 3)
      .forEach(({ j }) => segs.push([...a, ...nodes[j]]));
  });
  const line = segmentSampler(segs);
  for (let i = 0; i < count; i++) {
    let p: [number, number, number];
    if (r() < 0.32) {
      const n = nodes[Math.floor(r() * nodes.length)];
      const s = 0.07;
      p = [n[0] + gauss(r) * s, n[1] + gauss(r) * s, n[2] + gauss(r) * s];
    } else {
      const q = line(r);
      p = [q[0] + gauss(r) * 0.012, q[1] + gauss(r) * 0.012, q[2] + gauss(r) * 0.012];
    }
    out.set(p, i * 3);
  }
  return shuffle(out, r);
}

/** Globe: lat/long grid on a sphere with an orbit ring. */
export function globe(count: number) {
  const r = mulberry32(66);
  const out = new Float32Array(count * 3);
  const R = 2.05;
  for (let i = 0; i < count; i++) {
    const k = r();
    let p: [number, number, number];
    if (k < 0.3) {
      const d = randomDir(r);
      p = [d[0] * R, d[1] * R, d[2] * R];
    } else if (k < 0.55) {
      // latitude rings every 22.5°
      const lat = ((Math.floor(r() * 7) - 3) * Math.PI) / 8;
      const lon = r() * Math.PI * 2;
      p = [Math.cos(lat) * Math.cos(lon) * R, Math.sin(lat) * R, Math.cos(lat) * Math.sin(lon) * R];
    } else if (k < 0.85) {
      // longitude meridians every 22.5°
      const lon = (Math.floor(r() * 16) * Math.PI) / 8;
      const lat = (r() - 0.5) * Math.PI;
      p = [Math.cos(lat) * Math.cos(lon) * R, Math.sin(lat) * R, Math.cos(lat) * Math.sin(lon) * R];
    } else {
      const a = r() * Math.PI * 2;
      const rr = 3.0 + gauss(r) * 0.04;
      p = [Math.cos(a) * rr, gauss(r) * 0.02, Math.sin(a) * rr];
    }
    out.set(p, i * 3);
  }
  rotate(out, 0.35, 0);
  return shuffle(out, r);
}

/**
 * Samples an image's dark pixels into particles — used to spell the DSR logo out of the swarm.
 * Returns positions plus the pixel colour each particle sat on.
 */
export function imageShape(img: HTMLImageElement, count: number, width = 5.2) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const w = 260;
  const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * w));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no 2d context");
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  // Collect ink pixels (the logo is dark artwork on white)
  const ink: number[] = [];
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    if ((0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.62) ink.push(i);
  }
  if (ink.length < 64) throw new Error("image too sparse");

  const rnd = mulberry32(99);
  const height = (h / w) * width;
  for (let i = 0; i < count; i++) {
    const p = ink[Math.floor(rnd() * ink.length)];
    const px = p % w, py = Math.floor(p / w);
    positions.set(
      [
        ((px + rnd()) / w - 0.5) * width,
        (0.5 - (py + rnd()) / h) * height,
        gauss(rnd) * 0.05,
      ],
      i * 3,
    );
    colors.set([data[p * 4] / 255, data[p * 4 + 1] / 255, data[p * 4 + 2] / 255], i * 3);
  }
  return { positions, colors };
}

/** Scattered cloud particles fly in from on first load. */
export function scatter(count: number) {
  const r = mulberry32(77);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const d = randomDir(r);
    const rr = 6 + r() * 10;
    out.set([d[0] * rr, d[1] * rr, d[2] * rr - 4], i * 3);
  }
  return out;
}

export function randoms(count: number, seed: number) {
  const r = mulberry32(seed);
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) out[i] = r();
  return out;
}
