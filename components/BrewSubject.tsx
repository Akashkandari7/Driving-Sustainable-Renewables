/* The subjects for the product-house concept.
   Each one is drawn rather than photographed, so no two sections share a subject and the
   whole set is lit the same way: a dark face, a warm rim where the stage light lands, and a
   green mark on whatever is being verified. */

type P = { x: number; y: number };
type Quad = [P, P, P, P];

/** A point inside a four-cornered face, given as a fraction across and down it. */
const at = (q: Quad, u: number, v: number): P => {
  const tx = q[0].x + (q[1].x - q[0].x) * u;
  const ty = q[0].y + (q[1].y - q[0].y) * u;
  const bx = q[3].x + (q[2].x - q[3].x) * u;
  const by = q[3].y + (q[2].y - q[3].y) * u;
  return { x: tx + (bx - tx) * v, y: ty + (by - ty) * v };
};

/** A smaller face inset within a face — used for cells, trays, louvres and panels. */
const sub = (q: Quad, u0: number, v0: number, u1: number, v1: number): Quad => [
  at(q, u0, v0),
  at(q, u1, v0),
  at(q, u1, v1),
  at(q, u0, v1),
];

const d = (pts: P[]) => `M${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L")}Z`;
const seg = (a: P, b: P) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;

/** A box in three-quarter view: the front face, the side that falls away, and the top. */
function boxFaces(tl: P, w: number, h: number, rise: number, dx: number, dy: number) {
  const A = tl;
  const B = { x: tl.x + w, y: tl.y + rise };
  const Ab = { x: A.x, y: A.y + h };
  const Bb = { x: B.x, y: B.y + h };
  const Ad = { x: A.x + dx, y: A.y + dy };
  const Bd = { x: B.x + dx, y: B.y + dy };
  const Adb = { x: Ad.x, y: Ad.y + h };
  return {
    front: [A, B, Bb, Ab] as Quad,
    side: [Ad, A, Ab, Adb] as Quad,
    top: [Ad, Bd, B, A] as Quad,
    A,
    B,
    Ab,
    Bb,
    Ad,
    Bd,
    Adb,
  };
}

const HAIR = "rgba(238,242,246,0.17)";
const RIM = "rgba(255,206,150,0.55)";
const GREEN = "#4ade80";

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0" stopColor="#38322c" />
        <stop offset="1" stopColor="#141211" />
      </linearGradient>
      <linearGradient id={`${id}-side`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0d0c0b" />
        <stop offset="1" stopColor="#252118" />
      </linearGradient>
      <linearGradient id={`${id}-top`} x1="0.1" y1="1" x2="0.8" y2="0">
        <stop offset="0" stopColor="#2b2520" />
        <stop offset="1" stopColor="#6d5a44" />
      </linearGradient>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0.4">
        <stop offset="0" stopColor="#8d8678" />
        <stop offset="0.45" stopColor="#3c3933" />
        <stop offset="1" stopColor="#726a5e" />
      </linearGradient>
      <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1e2c39" />
        <stop offset="0.55" stopColor="#0e1620" />
        <stop offset="1" stopColor="#253547" />
      </linearGradient>
      <linearGradient id={`${id}-cell`} x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0" stopColor="#26394b" />
        <stop offset="1" stopColor="#101a25" />
      </linearGradient>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#bdb7a8" />
        <stop offset="1" stopColor="#6b6559" />
      </linearGradient>
      <linearGradient id={`${id}-warm`} x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#c4762e" stopOpacity="0" />
        <stop offset="1" stopColor="#e8a257" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id={`${id}-screen`} x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#14201d" />
        <stop offset="1" stopColor="#090d0c" />
      </linearGradient>
      <radialGradient id={`${id}-shadow`}>
        <stop offset="0" stopColor="#000" stopOpacity="0.8" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-pool`}>
        <stop offset="0" stopColor="#e8a257" stopOpacity="0.3" />
        <stop offset="1" stopColor="#e8a257" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

/* ---------- the subjects ---------- */

/** A framed photovoltaic module, seen from above the near edge. */
function Module(id: string) {
  const q: Quad = [
    { x: 72, y: 96 },
    { x: 324, y: 58 },
    { x: 358, y: 182 },
    { x: 58, y: 228 },
  ];
  const glass = sub(q, 0.045, 0.075, 0.955, 0.925);
  const cols = 10;
  const rows = 6;
  const g = 0.004;
  const cells: Quad[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      cells.push(sub(glass, c / cols + g, r / rows + g * 2, (c + 1) / cols - g, (r + 1) / rows - g * 2));
    }
  }
  const railA = sub(q, 0.18, 0.99, 0.32, 1.06);
  const railB = sub(q, 0.68, 0.99, 0.82, 1.06);

  return (
    <>
      <ellipse cx="206" cy="254" rx="152" ry="21" fill={`url(#${id}-shadow)`} />
      <path d={d(railA)} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.7} />
      <path d={d(railB)} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.7} />
      <path d={d(q)} fill={`url(#${id}-metal)`} stroke="rgba(238,242,246,0.22)" strokeWidth={0.9} />
      <path d={d(glass)} fill={`url(#${id}-glass)`} />
      {cells.map((cq, i) => (
        <path key={i} d={d(cq)} fill={`url(#${id}-cell)`} stroke="rgba(150,190,220,0.13)" strokeWidth={0.4} />
      ))}
      <path d={d(glass)} fill={`url(#${id}-warm)`} opacity={0.5} />
      <g fill="none" strokeLinecap="round">
        <path d={seg(q[0], q[1])} stroke={RIM} strokeWidth={1.3} />
        <path d={seg(q[1], q[2])} stroke="rgba(255,206,150,0.38)" strokeWidth={1.2} />
      </g>
      {/* the label that gets checked against the bill of materials */}
      <g>
        <path d={d(sub(glass, 0.72, 1.06, 0.93, 1.2))} fill="#15120f" stroke={HAIR} strokeWidth={0.7} />
        <circle cx={at(glass, 0.755, 1.13).x} cy={at(glass, 0.755, 1.13).y} r="2.4" fill={GREEN} />
      </g>
    </>
  );
}

/** A battery rack: trays stacked in a cabinet, each reporting its own state. */
function Rack(id: string) {
  const f = boxFaces({ x: 146, y: 62 }, 158, 172, 22, -66, 24);
  const trays = Array.from({ length: 8 }, (_, i) =>
    sub(f.front, 0.07, 0.05 + i * 0.115, 0.93, 0.05 + i * 0.115 + 0.09),
  );

  return (
    <>
      <ellipse cx="200" cy="264" rx="126" ry="18" fill={`url(#${id}-shadow)`} />
      <path d={d(f.side)} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.8} />
      <path d={d(f.top)} fill={`url(#${id}-top)`} stroke={HAIR} strokeWidth={0.8} />
      <path d={d(f.front)} fill={`url(#${id}-face)`} stroke={HAIR} strokeWidth={0.9} />
      {trays.map((t, i) => (
        <g key={i}>
          <path d={d(t)} fill="#0c0b0a" stroke={HAIR} strokeWidth={0.6} />
          <path d={d(sub(t, 0.02, 0.2, 0.62, 0.8))} fill="rgba(238,242,246,0.05)" />
          <circle cx={at(t, 0.9, 0.5).x} cy={at(t, 0.9, 0.5).y} r="2.2" fill={GREEN} opacity={i % 3 === 1 ? 0.45 : 1} />
        </g>
      ))}
      <path d={seg(f.A, f.B)} stroke={RIM} strokeWidth={1.2} fill="none" />
      <path d={seg(f.B, f.Bb)} stroke="rgba(255,206,150,0.3)" strokeWidth={1.1} fill="none" />
      {/* feet */}
      <path d={d(sub(f.front, 0.05, 1.0, 0.2, 1.05))} fill="#080b0e" />
      <path d={d(sub(f.front, 0.8, 1.0, 0.95, 1.05))} fill="#080b0e" />
    </>
  );
}

/** A drawing on the bench with a caliper laid across it — where the specification is set. */
function Bench(id: string) {
  const sheet: Quad = [
    { x: 56, y: 116 },
    { x: 330, y: 80 },
    { x: 364, y: 208 },
    { x: 44, y: 244 },
  ];
  const rows = Array.from({ length: 7 }, (_, i) => 0.16 + i * 0.1);

  return (
    <>
      <ellipse cx="204" cy="252" rx="158" ry="20" fill={`url(#${id}-shadow)`} />
      <ellipse cx="240" cy="150" rx="150" ry="100" fill={`url(#${id}-pool)`} />
      <path d={d(sheet)} fill={`url(#${id}-paper)`} stroke="rgba(0,0,0,0.3)" strokeWidth={0.8} />
      <path d={d(sub(sheet, 0.04, 0.06, 0.96, 0.94))} fill="none" stroke="rgba(20,18,16,0.4)" strokeWidth={0.7} />
      <g stroke="rgba(20,18,16,0.36)" strokeWidth={0.7} fill="none">
        {rows.map((v, i) => (
          <path key={i} d={seg(at(sheet, 0.1, v), at(sheet, 0.66, v))} />
        ))}
        <path d={seg(at(sheet, 0.1, 0.1), at(sheet, 0.1, 0.9))} />
      </g>
      {/* title block */}
      <path d={d(sub(sheet, 0.7, 0.68, 0.94, 0.9))} fill="rgba(20,18,16,0.1)" stroke="rgba(20,18,16,0.4)" strokeWidth={0.7} />
      <g stroke="rgba(20,18,16,0.3)" strokeWidth={0.6} fill="none">
        <path d={seg(at(sheet, 0.7, 0.76), at(sheet, 0.94, 0.76))} />
        <path d={seg(at(sheet, 0.7, 0.83), at(sheet, 0.94, 0.83))} />
      </g>
      {/* the caliper, closing on a dimension */}
      <g transform="rotate(-7 200 190)">
        <rect x="96" y="186" width="214" height="9" rx="2" fill={`url(#${id}-metal)`} stroke="rgba(0,0,0,0.4)" strokeWidth={0.6} />
        <rect x="100" y="158" width="11" height="30" rx="2" fill={`url(#${id}-metal)`} stroke="rgba(0,0,0,0.4)" strokeWidth={0.6} />
        <rect x="176" y="160" width="10" height="28" rx="2" fill={`url(#${id}-metal)`} stroke="rgba(0,0,0,0.4)" strokeWidth={0.6} />
        <rect x="172" y="180" width="30" height="20" rx="2" fill="#2a2621" stroke="rgba(0,0,0,0.4)" strokeWidth={0.6} />
        <g stroke="rgba(20,18,16,0.45)" strokeWidth={0.6}>
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${208 + i * 6} 188L${208 + i * 6} ${i % 4 === 0 ? 193 : 191}`} />
          ))}
        </g>
      </g>
      <path d={seg(sheet[0], sheet[1])} stroke="rgba(255,226,186,0.6)" strokeWidth={1.1} fill="none" />
      <circle cx={at(sheet, 0.44, 0.42).x} cy={at(sheet, 0.44, 0.42).y} r="3" fill={GREEN} />
    </>
  );
}

/** A site layout: rows of arrays set out on contours, dimensioned. */
function Plan(id: string) {
  const sheet: Quad = [
    { x: 50, y: 108 },
    { x: 334, y: 74 },
    { x: 368, y: 210 },
    { x: 40, y: 248 },
  ];
  const rows = Array.from({ length: 9 }, (_, i) => 0.14 + i * 0.082);

  return (
    <>
      <ellipse cx="204" cy="254" rx="158" ry="20" fill={`url(#${id}-shadow)`} />
      <path d={d(sheet)} fill="#101a1c" stroke={HAIR} strokeWidth={0.8} />
      <path d={d(sub(sheet, 0.03, 0.05, 0.97, 0.95))} fill="none" stroke="rgba(120,200,190,0.2)" strokeWidth={0.7} />
      {/* contours */}
      <g fill="none" stroke="rgba(120,200,190,0.16)" strokeWidth={0.7}>
        {[0.2, 0.35, 0.5, 0.65].map((k, i) => (
          <path
            key={i}
            d={`M${at(sheet, 0.06, k).x} ${at(sheet, 0.06, k).y}Q${at(sheet, 0.4, k - 0.12).x} ${
              at(sheet, 0.4, k - 0.12).y
            } ${at(sheet, 0.72, k + 0.04).x} ${at(sheet, 0.72, k + 0.04).y}T${at(sheet, 0.97, k - 0.02).x} ${
              at(sheet, 0.97, k - 0.02).y
            }`}
          />
        ))}
      </g>
      {/* array rows */}
      <g>
        {rows.map((v, i) => {
          const r = sub(sheet, 0.12 + (i % 2) * 0.03, v, 0.78 - (i % 3) * 0.05, v + 0.036);
          return <path key={i} d={d(r)} fill="rgba(150,200,230,0.2)" stroke="rgba(180,220,240,0.35)" strokeWidth={0.5} />;
        })}
      </g>
      {/* dimension line down the side */}
      <g stroke="rgba(74,222,128,0.6)" strokeWidth={0.7} fill="none">
        <path d={seg(at(sheet, 0.85, 0.14), at(sheet, 0.85, 0.86))} />
        <path d={seg(at(sheet, 0.83, 0.14), at(sheet, 0.87, 0.14))} />
        <path d={seg(at(sheet, 0.83, 0.86), at(sheet, 0.87, 0.86))} />
      </g>
      {/* north arrow */}
      <g transform={`translate(${at(sheet, 0.93, 0.2).x} ${at(sheet, 0.93, 0.2).y})`}>
        <path d="M0 -11L4.5 5L0 1.5L-4.5 5Z" fill="rgba(238,242,246,0.6)" />
      </g>
      <path d={seg(sheet[0], sheet[1])} stroke={RIM} strokeWidth={1.1} fill="none" />
    </>
  );
}

/** A crate of modules, banded and ready to leave the factory. */
function Crate(id: string) {
  const f = boxFaces({ x: 128, y: 108 }, 190, 20, 112, -60, 22);
  const bandA = sub(f.front, 0.22, -0.06, 0.29, 1.06);
  const bandB = sub(f.front, 0.68, -0.06, 0.75, 1.06);

  return (
    <>
      <ellipse cx="204" cy="244" rx="144" ry="19" fill={`url(#${id}-shadow)`} />
      <path d={d(f.side)} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.8} />
      <path d={d(f.top)} fill={`url(#${id}-top)`} stroke={HAIR} strokeWidth={0.8} />
      {/* module edges showing through the open top */}
      <g>
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={d(sub(f.top, 0.08, 0.12 + i * 0.11, 0.92, 0.12 + i * 0.11 + 0.07))}
            fill="rgba(30,44,57,0.9)"
            stroke="rgba(180,214,236,0.2)"
            strokeWidth={0.5}
          />
        ))}
      </g>
      <path d={d(f.front)} fill={`url(#${id}-face)`} stroke={HAIR} strokeWidth={0.9} />
      {/* slats and brace */}
      <g stroke="rgba(238,242,246,0.1)" strokeWidth={0.8} fill="none">
        <path d={seg(at(f.front, 0.02, 0.26), at(f.front, 0.98, 0.26))} />
        <path d={seg(at(f.front, 0.02, 0.74), at(f.front, 0.98, 0.74))} />
        <path d={seg(at(f.front, 0.04, 0.28), at(f.front, 0.96, 0.72))} />
        <path d={seg(at(f.front, 0.96, 0.28), at(f.front, 0.04, 0.72))} />
      </g>
      <path d={d(bandA)} fill="#1d1a16" stroke="rgba(238,242,246,0.2)" strokeWidth={0.6} />
      <path d={d(bandB)} fill="#1d1a16" stroke="rgba(238,242,246,0.2)" strokeWidth={0.6} />
      {/* the seal that says it was witnessed */}
      <path d={d(sub(f.front, 0.38, 0.4, 0.6, 0.58))} fill="#12100e" stroke="rgba(74,222,128,0.5)" strokeWidth={0.7} />
      <circle cx={at(f.front, 0.42, 0.49).x} cy={at(f.front, 0.42, 0.49).y} r="2.3" fill={GREEN} />
      <path d={seg(f.A, f.B)} stroke={RIM} strokeWidth={1.2} fill="none" />
    </>
  );
}

/** A single cell under the inspection lamp, fingers and busbars picked out. */
function Wafer(id: string) {
  const q: Quad = [
    { x: 108, y: 84 },
    { x: 306, y: 106 },
    { x: 288, y: 246 },
    { x: 92, y: 216 },
  ];
  const c = 0.09;
  const face = [
    at(q, c, 0),
    at(q, 1 - c, 0),
    at(q, 1, c),
    at(q, 1, 1 - c),
    at(q, 1 - c, 1),
    at(q, c, 1),
    at(q, 0, 1 - c),
    at(q, 0, c),
  ];

  return (
    <>
      <ellipse cx="198" cy="256" rx="126" ry="16" fill={`url(#${id}-shadow)`} />
      {/* the lamp's cone */}
      <path d="M330 18L372 40L268 250L206 246Z" fill={`url(#${id}-pool)`} opacity={0.8} />
      <path d={d(face)} fill={`url(#${id}-cell)`} stroke="rgba(170,206,232,0.3)" strokeWidth={0.9} />
      {/* fingers */}
      <g stroke="rgba(200,224,244,0.22)" strokeWidth={0.5} fill="none">
        {Array.from({ length: 26 }, (_, i) => {
          const u = 0.03 + i * 0.037;
          return <path key={i} d={seg(at(q, u, 0.02), at(q, u, 0.98))} />;
        })}
      </g>
      {/* busbars */}
      <g stroke="rgba(226,238,250,0.6)" strokeWidth={2.2} fill="none">
        {[0.24, 0.5, 0.76].map((v, i) => (
          <path key={i} d={seg(at(q, 0.01, v), at(q, 0.99, v))} />
        ))}
      </g>
      <path d={d(face)} fill={`url(#${id}-warm)`} opacity={0.32} />
      <path d={seg(at(q, c, 0), at(q, 1 - c, 0))} stroke={RIM} strokeWidth={1.3} fill="none" />
      {/* the probe coming in to the corner */}
      <g>
        <path d="M352 62L296 122" stroke={`url(#${id}-metal)`} strokeWidth={4} strokeLinecap="round" />
        <circle cx="296" cy="122" r="3" fill={GREEN} />
      </g>
    </>
  );
}

/** A tracker row on its piles, part-built — what construction monitoring watches. */
function Tracker(id: string) {
  const row: Quad = [
    { x: 74, y: 78 },
    { x: 330, y: 116 },
    { x: 336, y: 158 },
    { x: 80, y: 120 },
  ];
  const piles = [0.16, 0.5, 0.84];

  return (
    <>
      <ellipse cx="204" cy="252" rx="150" ry="17" fill={`url(#${id}-shadow)`} />
      {/* piles and bearings */}
      {piles.map((u, i) => {
        const top = at(row, u, 1.1);
        return (
          <g key={i}>
            <rect x={top.x - 5} y={top.y} width="10" height={244 - top.y} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.7} />
            <rect x={top.x - 11} y={top.y - 12} width="22" height="16" rx="3" fill={`url(#${id}-metal)`} stroke="rgba(0,0,0,0.4)" strokeWidth={0.6} />
          </g>
        );
      })}
      {/* torque tube */}
      <path
        d={d([at(row, 0, 1.02), at(row, 1, 1.02), at(row, 1, 1.13), at(row, 0, 1.13)])}
        fill={`url(#${id}-metal)`}
        stroke="rgba(0,0,0,0.4)"
        strokeWidth={0.6}
      />
      {/* the row: three modules on, one bay still open */}
      <path d={d(row)} fill="none" stroke={HAIR} strokeWidth={0.8} />
      {[0, 1, 2].map((i) => {
        const m = sub(row, 0.03 + i * 0.245, 0.06, 0.03 + i * 0.245 + 0.225, 0.94);
        return (
          <g key={i}>
            <path d={d(m)} fill={`url(#${id}-glass)`} stroke="rgba(170,206,232,0.26)" strokeWidth={0.7} />
            <g stroke="rgba(190,214,236,0.16)" strokeWidth={0.45} fill="none">
              {Array.from({ length: 5 }, (_, k) => (
                <path key={k} d={seg(at(m, 0.2 * k + 0.1, 0.05), at(m, 0.2 * k + 0.1, 0.95))} />
              ))}
            </g>
          </g>
        );
      })}
      <path
        d={d(sub(row, 0.765, 0.06, 0.99, 0.94))}
        fill="none"
        stroke="rgba(74,222,128,0.45)"
        strokeWidth={0.8}
        strokeDasharray="4 4"
      />
      <path d={seg(row[0], row[1])} stroke={RIM} strokeWidth={1.2} fill="none" />
    </>
  );
}

/** An inverter cabinet at handover: louvres, display, glands. */
function Inverter(id: string) {
  const f = boxFaces({ x: 160, y: 52 }, 112, 186, 16, -56, 20);
  const louvres = Array.from({ length: 11 }, (_, i) => 0.36 + i * 0.045);

  return (
    <>
      <ellipse cx="200" cy="262" rx="112" ry="17" fill={`url(#${id}-shadow)`} />
      <path d={d(f.side)} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.8} />
      <path d={d(f.top)} fill={`url(#${id}-top)`} stroke={HAIR} strokeWidth={0.8} />
      <path d={d(f.front)} fill={`url(#${id}-face)`} stroke={HAIR} strokeWidth={0.9} />
      {/* display */}
      <path d={d(sub(f.front, 0.12, 0.07, 0.62, 0.24))} fill={`url(#${id}-screen)`} stroke={HAIR} strokeWidth={0.7} />
      <g stroke="rgba(74,222,128,0.7)" strokeWidth={1} fill="none">
        <path d={seg(at(f.front, 0.17, 0.19), at(f.front, 0.3, 0.12))} />
        <path d={seg(at(f.front, 0.3, 0.12), at(f.front, 0.42, 0.17))} />
        <path d={seg(at(f.front, 0.42, 0.17), at(f.front, 0.56, 0.1))} />
      </g>
      <circle cx={at(f.front, 0.82, 0.12).x} cy={at(f.front, 0.82, 0.12).y} r="3" fill={GREEN} />
      <circle cx={at(f.front, 0.82, 0.22).x} cy={at(f.front, 0.82, 0.22).y} r="3" fill="rgba(238,242,246,0.2)" />
      {/* louvres */}
      <g stroke="rgba(238,242,246,0.16)" strokeWidth={1.1} fill="none">
        {louvres.map((v, i) => (
          <path key={i} d={seg(at(f.front, 0.1, v), at(f.front, 0.9, v))} />
        ))}
      </g>
      {/* door seam and handle */}
      <path d={seg(at(f.front, 0.06, 0.04), at(f.front, 0.06, 0.96))} stroke={HAIR} strokeWidth={0.7} fill="none" />
      <rect
        x={at(f.front, 0.92, 0.46).x - 2}
        y={at(f.front, 0.92, 0.46).y}
        width="4"
        height="22"
        rx="2"
        fill={`url(#${id}-metal)`}
      />
      {/* cable glands */}
      <g>
        {[0.24, 0.42, 0.6, 0.78].map((u, i) => (
          <circle key={i} cx={at(f.front, u, 0.93).x} cy={at(f.front, u, 0.93).y} r="4" fill="#0a0908" stroke={HAIR} strokeWidth={0.7} />
        ))}
      </g>
      <path d={seg(f.A, f.B)} stroke={RIM} strokeWidth={1.2} fill="none" />
      <path d={seg(f.B, f.Bb)} stroke="rgba(255,206,150,0.32)" strokeWidth={1.1} fill="none" />
    </>
  );
}

/** A storage container on the stand, doors shut, cooling on the long side. */
function Container(id: string) {
  const f = boxFaces({ x: 102, y: 104 }, 236, 26, 88, -52, 20);

  return (
    <>
      <ellipse cx="204" cy="238" rx="160" ry="18" fill={`url(#${id}-shadow)`} />
      <path d={d(f.side)} fill={`url(#${id}-side)`} stroke={HAIR} strokeWidth={0.8} />
      <path d={d(f.top)} fill={`url(#${id}-top)`} stroke={HAIR} strokeWidth={0.8} />
      {/* roof rail */}
      <path d={d(sub(f.top, 0, 0, 1, 0.12))} fill="rgba(238,242,246,0.07)" stroke={HAIR} strokeWidth={0.6} />
      <path d={d(f.front)} fill={`url(#${id}-face)`} stroke={HAIR} strokeWidth={0.9} />
      {/* corrugation */}
      <g stroke="rgba(238,242,246,0.08)" strokeWidth={1} fill="none">
        {Array.from({ length: 21 }, (_, i) => {
          const u = 0.03 + i * 0.0455;
          return <path key={i} d={seg(at(f.front, u, 0.06), at(f.front, u, 0.94))} />;
        })}
      </g>
      {/* doors at the right end */}
      <path d={d(sub(f.front, 0.68, 0.04, 0.97, 0.96))} fill="rgba(0,0,0,0.25)" stroke={HAIR} strokeWidth={0.8} />
      <path d={seg(at(f.front, 0.825, 0.04), at(f.front, 0.825, 0.96))} stroke={HAIR} strokeWidth={0.8} fill="none" />
      <g stroke={`url(#${id}-metal)`} strokeWidth={2.4} fill="none">
        <path d={seg(at(f.front, 0.73, 0.08), at(f.front, 0.73, 0.92))} />
        <path d={seg(at(f.front, 0.78, 0.08), at(f.front, 0.78, 0.92))} />
        <path d={seg(at(f.front, 0.87, 0.08), at(f.front, 0.87, 0.92))} />
        <path d={seg(at(f.front, 0.92, 0.08), at(f.front, 0.92, 0.92))} />
      </g>
      {/* cooling units */}
      {[0.1, 0.3, 0.5].map((u, i) => (
        <g key={i}>
          <path d={d(sub(f.front, u, 0.18, u + 0.13, 0.52))} fill="#0d0c0b" stroke={HAIR} strokeWidth={0.7} />
          <g stroke="rgba(238,242,246,0.14)" strokeWidth={0.7} fill="none">
            {[0.3, 0.5, 0.7].map((v, k) => (
              <path key={k} d={seg(at(f.front, u + 0.015, 0.18 + v * 0.34), at(f.front, u + 0.115, 0.18 + v * 0.34))} />
            ))}
          </g>
        </g>
      ))}
      <circle cx={at(f.front, 0.6, 0.24).x} cy={at(f.front, 0.6, 0.24).y} r="2.6" fill={GREEN} />
      {/* stand */}
      <path d={d(sub(f.front, 0.04, 1.0, 0.16, 1.07))} fill="#0a0908" />
      <path d={d(sub(f.front, 0.84, 1.0, 0.96, 1.07))} fill="#0a0908" />
      <path d={seg(f.A, f.B)} stroke={RIM} strokeWidth={1.2} fill="none" />
    </>
  );
}

/** The quality record itself: findings plotted, trend read, evidence attached. */
function Dashboard(id: string) {
  const panel: Quad = [
    { x: 86, y: 70 },
    { x: 330, y: 92 },
    { x: 322, y: 232 },
    { x: 78, y: 206 },
  ];
  const bars = [0.72, 0.44, 0.86, 0.3, 0.6, 0.5, 0.78, 0.36];

  return (
    <>
      <ellipse cx="200" cy="248" rx="134" ry="16" fill={`url(#${id}-shadow)`} />
      <ellipse cx="220" cy="150" rx="150" ry="110" fill={`url(#${id}-pool)`} opacity={0.6} />
      <path d={d(panel)} fill={`url(#${id}-screen)`} stroke="rgba(238,242,246,0.22)" strokeWidth={0.9} />
      {/* header */}
      <path d={d(sub(panel, 0.04, 0.05, 0.96, 0.15))} fill="rgba(238,242,246,0.05)" />
      <g fill="rgba(238,242,246,0.3)">
        {[0.07, 0.11, 0.15].map((u, i) => (
          <circle key={i} cx={at(panel, u, 0.1).x} cy={at(panel, u, 0.1).y} r="2" />
        ))}
      </g>
      <path d={d(sub(panel, 0.6, 0.08, 0.92, 0.12))} fill="rgba(238,242,246,0.12)" />
      {/* bars */}
      <g>
        {bars.map((h, i) => {
          const u = 0.08 + i * 0.075;
          const b = sub(panel, u, 0.74 - h * 0.46, u + 0.05, 0.74);
          return <path key={i} d={d(b)} fill={i === 2 ? "rgba(74,222,128,0.55)" : "rgba(180,214,236,0.24)"} />;
        })}
        <path d={seg(at(panel, 0.06, 0.74), at(panel, 0.72, 0.74))} stroke={HAIR} strokeWidth={0.7} fill="none" />
      </g>
      {/* trend */}
      <path
        d={`M${at(panel, 0.08, 0.48).x} ${at(panel, 0.08, 0.48).y}L${at(panel, 0.24, 0.4).x} ${
          at(panel, 0.24, 0.4).y
        }L${at(panel, 0.4, 0.44).x} ${at(panel, 0.4, 0.44).y}L${at(panel, 0.56, 0.3).x} ${
          at(panel, 0.56, 0.3).y
        }L${at(panel, 0.72, 0.34).x} ${at(panel, 0.72, 0.34).y}`}
        fill="none"
        stroke={GREEN}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* side readings */}
      <g>
        {[0.22, 0.42, 0.62].map((v, i) => (
          <g key={i}>
            <path d={d(sub(panel, 0.76, v, 0.94, v + 0.14))} fill="rgba(238,242,246,0.05)" stroke={HAIR} strokeWidth={0.6} />
            <path d={d(sub(panel, 0.79, v + 0.04, 0.88, v + 0.06))} fill="rgba(238,242,246,0.28)" />
            <path d={d(sub(panel, 0.79, v + 0.08, 0.91, v + 0.11))} fill="rgba(238,242,246,0.14)" />
          </g>
        ))}
      </g>
      <path d={seg(panel[0], panel[1])} stroke={RIM} strokeWidth={1.2} fill="none" />
    </>
  );
}

/* ---------- the switch ---------- */

const SUBJECTS = {
  module: Module,
  rack: Rack,
  bench: Bench,
  plan: Plan,
  crate: Crate,
  wafer: Wafer,
  tracker: Tracker,
  inverter: Inverter,
  container: Container,
  dashboard: Dashboard,
};

export type SubjectName = keyof typeof SUBJECTS;

/** The names in the order the services are listed, so each service gets its own object. */
export const SERVICE_SUBJECTS: SubjectName[] = [
  "plan",
  "crate",
  "wafer",
  "tracker",
  "inverter",
  "container",
  "dashboard",
];

export default function BrewSubject({ name, label }: { name: SubjectName; label: string }) {
  const id = `s-${name}`;
  return (
    <svg className="brew-subject" viewBox="0 0 400 300" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <Defs id={id} />
      {SUBJECTS[name](id)}
    </svg>
  );
}
