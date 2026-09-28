"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BASE } from "@/lib/asset";

/**
 * The backdrop is built in three dimensions.
 *
 * Every plate is a photograph plus a depth map, and the depth map is geometry here, not a trick in
 * the pixels: the picture is a mesh whose surface stands up where the scene is near and falls away
 * where it is far. A real camera moves through that relief — panels and containers pass in front of
 * the hills while the horizon holds still — and the change of act is a flight: the plate you are on
 * comes toward the camera and past it while the next one rises out of the depth behind it.
 *
 * Dawn and dusk fly differently: dawn opens outward into the light, dusk falls forward into the dark.
 */

export type CameraMove = "push" | "panLeft" | "panRight" | "tiltUp" | "pullBack";

export type CinemaShot = {
  /** plate name, e.g. "hybrid" — the file is picked per mode: /images/<mode>/<mode>-<plate> */
  plate: string;
  /** framing: 1 = fit the frame, >1 stands the camera closer */
  zoom?: number;
  /** where the camera looks, -0.5…0.5 of the frame */
  focus?: [number, number];
  /** how dark the plate is pushed so overlaid copy stays readable */
  dim?: number;
  /** how the camera behaves while this act is on screen */
  move?: CameraMove;
  /** where the light sits in the frame (0-1 uv) — drives the flare */
  sun?: [number, number];
  /** short label for the scene index */
  label?: string;
};

const plateSrc = (plate: string, mode: string) => `${BASE}/images/${mode}/${mode}-${plate}`;
const wideSrc = (base: string) => `${base}-w.jpg`;
const depthOf = (base: string) => `${base}-depth.jpg`;
const phoneOf = (base: string) => `${base}-p.jpg`;
const readMode = () => (document.querySelector<HTMLElement>(".cine")?.dataset.mode === "dusk" ? "dusk" : "dawn");

const FOV = 46;
const BASE_Z = 6; // where a plate rests in front of the camera

/** The surface stands up along the depth map, so the photograph has real relief. */
const vertexShader = /* glsl */ `
  uniform sampler2D uDep;
  uniform vec2 uCover;
  uniform float uRelief;
  uniform float uTime;
  varying vec2 vUv;
  varying vec2 vRaw;
  varying float vDepth;

  void main() {
    vRaw = uv;
    vec2 cuv = clamp((uv - 0.5) * uCover + 0.5, 0.002, 0.998);
    vUv = cuv;

    float d = texture2D(uDep, cuv).r;
    vDepth = d;

    vec3 p = position;
    // near ground rises toward the camera, the horizon settles back
    p.z += (d - 0.42) * uRelief;
    // a slow swell so the scene breathes while it is held
    p.z += sin(uTime * 0.25 + p.x * 0.6) * 0.012 * d;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uSun;
  uniform float uDim;
  uniform float uDawn;
  uniform float uFade;
  uniform float uTime;
  uniform float uGlow;
  varying vec2 vUv;
  varying vec2 vRaw;
  varying float vDepth;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec3 col = texture2D(uTex, vUv).rgb;

    // grade: dusk deepens the shadows, dawn lifts the frame and pulls the warmth back
    col = pow(col, mix(vec3(0.94), vec3(0.84), uDawn));
    col *= mix(vec3(1.02, 0.99, 0.94), vec3(1.1, 1.06, 1.0), uDawn);
    col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, mix(1.12, 1.05, uDawn));

    // screen-space furniture: flare, vignette, the shade the copy sits on, grain
    vec2 suv = gl_FragCoord.xy / uRes;
    vec2 fd = suv - uSun;
    fd.x *= 1.35;
    float glow = exp(-length(fd) * 7.0) * 0.9 + exp(-abs(fd.y) * 90.0) * exp(-abs(fd.x) * 2.2) * 0.5;
    col += vec3(1.0, 0.82, 0.58) * glow * 0.5;

    vec2 d = suv - 0.5;
    float vig = 1.0 - smoothstep(0.35, 0.95, length(d * vec2(1.05, 1.25)));
    col *= mix(mix(0.72, 1.0, vig), mix(0.86, 1.0, vig), uDawn);
    col *= 1.0 - uDim * smoothstep(0.35, 1.0, 1.0 - suv.y) * mix(0.62, 0.42, uDawn);
    col *= 1.0 - uDim * mix(0.14, 0.06, uDawn);

    // light gathering on the near ground as a plate hands over
    col += mix(vec3(0.85, 0.42, 0.16), vec3(1.0, 0.84, 0.58), uDawn) * uGlow * smoothstep(0.35, 1.0, vDepth) * 0.5;

    col += (hash(suv * 900.0 + uTime) - 0.5) * 0.022;

    // the mesh has borders of its own; feather them so a plate never arrives as a rectangle
    vec2 e = smoothstep(vec2(0.0), vec2(0.16), vRaw) * smoothstep(vec2(0.0), vec2(0.16), 1.0 - vRaw);
    gl_FragColor = vec4(col, uFade * e.x * e.y);
  }
`;

const smootherstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Where the camera stands within a shot, 0 = act entering, 1 = act leaving. */
function framing(shot: CinemaShot, t: number, tight = 1) {
  const fx = (shot.focus?.[0] ?? 0) * tight;
  const fy = (shot.focus?.[1] ?? 0) * tight;
  const e = t - 0.5;
  switch (shot.move ?? "push") {
    case "panLeft":
      return { dolly: 0.3 * t, x: fx - e * 0.5 * tight, y: fy };
    case "panRight":
      return { dolly: 0.3 * t, x: fx + e * 0.5 * tight, y: fy };
    case "tiltUp":
      return { dolly: 0.35 * t, x: fx, y: fy + e * 0.42 * tight };
    case "pullBack":
      return { dolly: 0.7 - t * 0.85, x: fx, y: fy - e * 0.12 * tight };
    default:
      return { dolly: 0.75 * t, x: fx, y: fy };
  }
}

export default function CinemaScene({ shots }: { shots: CinemaShot[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const platesRef = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState<boolean | null>(null);
  const [mode, setMode] = useState("dawn");

  // Phones get plain crossfading plates: a portrait window onto a photograph leaves the camera
  // almost nothing to work with, and the relief costs more than it shows at that size.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px), (pointer: coarse)");
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // the phone plates are plain images, so they swap with the mode here
  useEffect(() => {
    setMode(readMode());
    const onMode = (e: Event) => setMode((e as CustomEvent<string>).detail === "dawn" ? "dawn" : "dusk");
    window.addEventListener("cinemode", onMode);
    return () => window.removeEventListener("cinemode", onMode);
  }, []);

  // --- phone: scroll drives which plate is showing ---
  useEffect(() => {
    if (!phone) return;
    const host = platesRef.current;
    if (!host) return;
    const layers = Array.from(host.children) as HTMLElement[];
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"));
    let raf = 0;

    const paint = () => {
      raf = 0;
      const vc = window.innerHeight / 2;
      const centers = sections.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let p = 0;
      if (centers.length && vc > centers[0]) {
        p = centers.length - 1;
        for (let i = 0; i < centers.length - 1; i++) {
          if (vc < centers[i + 1]) {
            p = i + (vc - centers[i]) / (centers[i + 1] - centers[i]);
            break;
          }
        }
      }
      const i = Math.min(Math.floor(p), Math.max(0, layers.length - 1));
      const f = Math.min(1, Math.max(0, p - i));
      layers.forEach((el, k) => {
        const on = k === i ? 1 - f : k === i + 1 ? f : 0;
        el.style.opacity = on.toFixed(3);
        if (k === i) {
          // the plate on screen comes toward the viewer as it hands over
          el.style.transform = `scale(${(1.05 + f * 0.12).toFixed(3)}) translateZ(${(f * 60).toFixed(1)}px)`;
        } else if (k === i + 1) {
          // the next one rises from behind and settles
          el.style.transform = `scale(${(1.16 - f * 0.11).toFixed(3)}) translateZ(${((f - 1) * 70).toFixed(1)}px)`;
        }
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [phone, shots]);

  // --- desktop: the scene in three dimensions ---
  useEffect(() => {
    if (phone !== false) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    const init = async () => {
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
      } catch {
        document.documentElement.classList.add("no-webgl");
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Same reasoning as the particle field: this fills the window, and photography has no
      // hard edges for the extra pixels to sharpen.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x05070b, 1);
      // What shows wherever a plate does not reach — between shots, and at the edges as the
      // camera pulls back. Near-black is invisible at dusk but reads as a black band across a
      // daylight page, so it follows the mode along with everything else.
      const duskClear = new THREE.Color(0x05070b);
      const dawnClear = new THREE.Color(0xf3ece3);
      const clear = new THREE.Color();

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);

      const loader = new THREE.TextureLoader();
      const load = (src: string, srgb: boolean) =>
        loader.loadAsync(src).then((t) => {
          if (srgb) t.colorSpace = THREE.SRGBColorSpace;
          t.minFilter = THREE.LinearFilter;
          t.generateMipmaps = false;
          return t;
        });

      type Loaded = { tex: Awaited<ReturnType<typeof load>>; dep: Awaited<ReturnType<typeof load>> };

      /* One mesh stands in front and one behind; on a change of act they trade places, the front one
         flying past the camera. Because each mesh carries its relief, that flight goes through the
         scene rather than across a picture of it. */
      const geometry = new THREE.PlaneGeometry(2, 2, 180, 110);
      const makeStage = () => {
        const uniforms = {
          uTex: { value: null as THREE.Texture | null },
          uDep: { value: null as THREE.Texture | null },
          uCover: { value: new THREE.Vector2(1, 1) },
          uRelief: { value: 1.25 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uSun: { value: new THREE.Vector2(0.8, 0.35) },
          uDim: { value: 0.42 },
          uDawn: { value: 0 },
          uFade: { value: 1 },
          uGlow: { value: 0 },
          uTime: { value: 0 },
        };
        const mesh = new THREE.Mesh(
          geometry,
          new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, transparent: true }),
        );
        mesh.frustumCulled = false;
        scene.add(mesh);
        return { mesh, uniforms };
      };
      const front = makeStage();
      const back = makeStage();
      back.mesh.renderOrder = -1;

      // Plates load as the scroll reaches them rather than all at once.
      const cache = new Map<string, Loaded>();
      const inFlight = new Set<string>();
      const keyOf = (i: number, m: string) => `${m}:${shots[i].plate}`;
      const plateFor = (i: number, m: string) => cache.get(keyOf(i, m));
      const ensure = (i: number, m: string) => {
        const key = keyOf(i, m);
        if (cache.has(key) || inFlight.has(key)) return;
        inFlight.add(key);
        const base = plateSrc(shots[i].plate, m);
        Promise.all([load(wideSrc(base), true), load(depthOf(base), false)])
          .then(([tex, dep]) => {
            if (disposed) {
              tex.dispose();
              dep.dispose();
              return;
            }
            cache.set(key, { tex, dep });
          })
          .catch(() => {
            // the plate we already have keeps standing
          })
          .finally(() => inFlight.delete(key));
      };

      let mode = readMode();
      const firstBase = plateSrc(shots[0].plate, mode);
      const first = await Promise.all([load(wideSrc(firstBase), true), load(depthOf(firstBase), false)])
        .then(([tex, dep]) => ({ tex, dep }))
        .catch(() => null);
      if (disposed || !first) {
        renderer.dispose();
        return;
      }
      cache.set(keyOf(0, mode), first);
      if (shots.length > 1) ensure(1, mode);

      let dawnTarget = mode === "dawn" ? 1 : 0;
      let dawn = dawnTarget;
      const onMode = (e: Event) => {
        const next = (e as CustomEvent<string>).detail === "dawn" ? "dawn" : "dusk";
        dawnTarget = next === "dawn" ? 1 : 0;
        if (next !== mode) mode = next;
      };
      window.addEventListener("cinemode", onMode);

      // how large a plate has to be to cover the frame at a given distance
      const frameAt = (dist: number) => {
        const h = 2 * Math.max(0.6, dist) * Math.tan((FOV * Math.PI) / 360);
        return { w: h * camera.aspect, h };
      };
      const coverFor = (tex: THREE.Texture, planeW: number, planeH: number, out: THREE.Vector2) => {
        const img = tex.image as { width: number; height: number };
        const plane = planeW / planeH;
        const ratio = img.width / img.height;
        if (ratio > plane) out.set(plane / ratio, 1);
        else out.set(1, ratio / plane);
        return out;
      };

      const place = (stage: ReturnType<typeof makeStage>, plate: Loaded, shot: CinemaShot, z: number, fade: number) => {
        // the plate sits at -BASE_Z and z slides it toward (or away from) the camera
        const worldZ = -BASE_Z + z;
        const dist = -worldZ;
        const { w, h } = frameAt(dist);
        const sw = w * 1.75; // margin so the feathered border stays off-screen while a plate rests
        const sh = h * 1.75;
        stage.mesh.position.z = worldZ;
        stage.mesh.scale.set(sw / 2, sh / 2, 1);
        stage.uniforms.uTex.value = plate.tex;
        stage.uniforms.uDep.value = plate.dep;
        coverFor(plate.tex, sw, sh, stage.uniforms.uCover.value);
        stage.uniforms.uDim.value = shot.dim ?? 0.42;
        stage.uniforms.uSun.value.set(shot.sun?.[0] ?? 0.8, 1 - (shot.sun?.[1] ?? 0.35));
        stage.uniforms.uFade.value = fade;
        stage.uniforms.uRelief.value = 0.55 / Math.max(0.5, sh / 6);
        stage.mesh.visible = fade > 0.002;
      };

      const resize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const pr = renderer.getPixelRatio();
        front.uniforms.uRes.value.set(w * pr, h * pr);
        back.uniforms.uRes.value.set(w * pr, h * pr);
      };
      resize();
      window.addEventListener("resize", resize);

      const pointer = new THREE.Vector2();
      const smoothPointer = new THREE.Vector2();
      const onPointer = (e: PointerEvent) => {
        pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onPointer);

      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"));
      const readProgress = () => {
        const vc = window.innerHeight / 2;
        const centers = sections.map((el) => {
          const r = el.getBoundingClientRect();
          return r.top + r.height / 2;
        });
        if (!centers.length || vc <= centers[0]) return 0;
        for (let i = 0; i < centers.length - 1; i++) {
          if (vc < centers[i + 1]) return i + (vc - centers[i]) / (centers[i + 1] - centers[i]);
        }
        return centers.length - 1;
      };

      const last = shots.length - 1;
      let progress = readProgress();
      let velocity = 0;
      const root = document.documentElement;
      const clock = new THREE.Clock();
      let raf = 0;

      const frame = () => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05);
        const time = clock.elapsedTime;

        const before = progress;
        progress += (readProgress() - progress) * (reduceMotion ? 1 : 1 - Math.pow(0.004, dt));
        velocity += (Math.min(1, Math.abs(progress - before) / Math.max(dt, 0.001) / 1.6) - velocity) * 0.18;

        const i = Math.min(Math.floor(progress), Math.max(0, last - 1));
        const j = Math.min(i + 1, last);
        const raw = Math.min(1, Math.max(0, progress - i));
        const f = smootherstep(raw);

        ensure(i, mode);
        ensure(j, mode);
        if (j + 1 <= last) ensure(j + 1, mode);
        const plateA = plateFor(i, mode) ?? plateFor(j, mode) ?? first;
        const plateB = plateFor(j, mode) ?? plateA;

        dawn += (dawnTarget - dawn) * 0.06;
        renderer.setClearColor(clear.copy(duskClear).lerp(dawnClear, dawn), 1);

        /* The flight. Dusk falls forward — the plate you are on rushes past the camera. Dawn opens
           outward — the next scene comes up from further back and the light arrives with it. */
        const A = framing(shots[i], raw);
        const B = framing(shots[j], raw - 1);
        const dusk = 1 - dawn;
        const exitZ = A.dolly + f * (3.1 + dusk * 1.9);
        const enterZ = B.dolly - (1 - f) * (3.2 + dawn * 1.8);

        // the outgoing plate only gives way once it is nearly past
        const fadeA = 1 - smootherstep((f - 0.62) / 0.38);
        const fadeB = smootherstep(f / 0.6);

        place(back, plateB, shots[j], enterZ, fadeB);
        place(front, plateA, shots[i], exitZ, fadeA);

        const glow = Math.sin(Math.PI * f) * (0.22 + velocity * 0.45);
        front.uniforms.uGlow.value = reduceMotion ? 0 : glow;
        back.uniforms.uGlow.value = reduceMotion ? 0 : glow * 0.6;
        front.uniforms.uDawn.value = dawn;
        back.uniforms.uDawn.value = dawn;
        front.uniforms.uTime.value = reduceMotion ? 0 : time;
        back.uniforms.uTime.value = reduceMotion ? 0 : time;

        // the camera looks where the act asks, and drifts with the pointer
        smoothPointer.lerp(pointer, 0.045);
        const camX = (A.x + (B.x - A.x) * f) * 1.5 + smoothPointer.x * 0.3;
        const camY = (A.y + (B.y - A.y) * f) * 1.5 - smoothPointer.y * 0.2;
        camera.position.set(camX, camY, 0);
        camera.lookAt(camX * 0.4, camY * 0.4, -BASE_Z);

        root.style.setProperty("--cine-bar", `${(reduceMotion ? 0 : velocity * 34).toFixed(2)}px`);

        renderer.render(scene, camera);
      };
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        root.style.removeProperty("--cine-bar");
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("cinemode", onMode);
        geometry.dispose();
        (front.mesh.material as THREE.Material).dispose();
        (back.mesh.material as THREE.Material).dispose();
        cache.forEach(({ tex, dep }) => {
          tex.dispose();
          dep.dispose();
        });
        renderer.dispose();
      };
    };

    init();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [shots, phone]);

  if (phone === null) return <div className="cine__canvas cine__canvas--idle" aria-hidden="true" />;

  if (phone) {
    return (
      <div className="cine__plates" ref={platesRef} aria-hidden="true">
        {shots.map((s, i) => (
          <img
            key={`${s.plate}-${i}`}
            src={phoneOf(plateSrc(s.plate, mode))}
            alt=""
            loading={i < 2 ? "eager" : "lazy"}
            style={{ opacity: i === 0 ? 1 : 0 }}
          />
        ))}
      </div>
    );
  }

  return <canvas ref={canvasRef} className="cine__canvas" aria-hidden="true" />;
}
