"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Full-bleed cinematic backdrop.
 *
 * Each plate is a photograph plus a depth map, so pushing in parallaxes the foreground against the
 * horizon instead of scaling flat. Every act gets its own camera move (push, pan, tilt, pull back),
 * the shots dissolve on scroll, and the result is graded — warm lift, vignette, grain, drifting dust.
 */

export type CameraMove = "push" | "panLeft" | "panRight" | "tiltUp" | "pullBack";

export type CinemaShot = {
  src: string;
  /** framing: 1 = fit the frame, >1 crops in tighter */
  zoom?: number;
  /** where the crop sits, -0.5…0.5 of the frame */
  focus?: [number, number];
  /** how dark the plate is pushed so overlaid copy stays readable */
  dim?: number;
  /** how the camera behaves while this act is on screen */
  move?: CameraMove;
  /** where the light source sits in the frame (0-1 uv) — drives flare and god rays */
  sun?: [number, number];
  /** short label for the scene index */
  label?: string;
};

const depthSrc = (src: string) => src.replace(/\.(png|jpe?g)$/i, "-depth.jpg");

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform sampler2D uDepA;
  uniform sampler2D uDepB;
  uniform vec2 uCoverA;
  uniform vec2 uCoverB;
  uniform vec2 uFocusA;
  uniform vec2 uFocusB;
  uniform float uZoomA;
  uniform float uZoomB;
  uniform float uDimA;
  uniform float uDimB;
  uniform vec2 uParA;
  uniform vec2 uParB;
  uniform vec2 uSunA;
  uniform vec2 uSunB;
  uniform float uMix;
  uniform float uTime;
  uniform float uReveal;
  uniform float uFlash;
  uniform float uBlur;
  varying vec2 vUv;

  /* cover-fit sampling, displaced by the plate's depth so near things travel further */
  vec3 plate(sampler2D tex, sampler2D dep, vec2 cover, vec2 focus, float zoom, vec2 par, float drift, vec2 off) {
    vec2 base = (vUv + off - 0.5) / (cover * zoom * (1.0 + drift)) + focus + 0.5;
    float d = texture2D(dep, clamp(base, 0.002, 0.998)).r;
    vec2 uv = base + par * (d - 0.45);
    return texture2D(tex, clamp(uv, 0.002, 0.998)).rgb;
  }

  /* a few taps along the scroll direction stand in for shutter smear while the page is moving fast */
  vec3 smeared(sampler2D tex, sampler2D dep, vec2 cover, vec2 focus, float zoom, vec2 par, float drift) {
    vec3 sum = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float t = (float(i) - 2.0) * 0.5;
      sum += plate(tex, dep, cover, focus, zoom, par, drift, vec2(0.0, t * uBlur));
    }
    return sum / 5.0;
  }

  /* warm bloom around the sun plus a soft anamorphic streak */
  vec3 flare(vec2 sun, float amount) {
    vec2 d = vUv - sun;
    d.x *= 1.35;
    float glow = exp(-length(d) * 7.0) * 0.9;
    float streak = exp(-abs(d.y) * 90.0) * exp(-abs(d.x) * 2.2) * 0.5;
    float rays = exp(-length(d) * 3.0) * (0.5 + 0.5 * sin(atan(d.y, d.x) * 14.0 + uTime * 0.25)) * 0.16;
    return vec3(1.0, 0.82, 0.58) * (glow + streak + rays) * amount;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    float breathe = sin(uTime * 0.06) * 0.01;
    vec3 a = smeared(uTexA, uDepA, uCoverA, uFocusA, uZoomA, uParA, breathe);
    vec3 b = smeared(uTexB, uDepB, uCoverB, uFocusB, uZoomB, uParB, breathe);
    vec3 col = mix(a, b, uMix);
    float dim = mix(uDimA, uDimB, uMix);

    // lens dispersion towards the edges of the frame
    vec2 r = vUv - 0.5;
    float ca = dot(r, r) * (0.0018 + uBlur * 0.16);
    col.r = mix(
      plate(uTexA, uDepA, uCoverA, uFocusA, uZoomA, uParA, breathe, r * ca).r,
      plate(uTexB, uDepB, uCoverB, uFocusB, uZoomB, uParB, breathe, r * ca).r, uMix);
    col.b = mix(
      plate(uTexA, uDepA, uCoverA, uFocusA, uZoomA, uParA, breathe, -r * ca).b,
      plate(uTexB, uDepB, uCoverB, uFocusB, uZoomB, uParB, breathe, -r * ca).b, uMix);

    // grade: deepen the shadows, keep the sun warm
    col = pow(col, vec3(1.06));
    col *= mix(vec3(1.0), vec3(1.04, 0.99, 0.92), 0.5);
    col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 1.12);

    // sun bloom, blended between the two plates
    col += mix(flare(uSunA, 1.0 - uMix), flare(uSunB, uMix), uMix) * 0.55;

    // darken towards the edges and the lower third, where the copy sits
    vec2 d = vUv - 0.5;
    float vig = 1.0 - smoothstep(0.35, 0.95, length(d * vec2(1.05, 1.25)));
    col *= mix(0.55, 1.0, vig);
    col *= 1.0 - dim * smoothstep(0.35, 1.0, 1.0 - vUv.y) * 0.85;
    col *= 1.0 - dim * 0.25;

    // light leak across the cut between two shots
    col += vec3(1.0, 0.86, 0.66) * uFlash * (0.35 + 0.65 * smoothstep(0.0, 1.0, vUv.x));

    col += (hash(vUv * 900.0 + uTime) - 0.5) * 0.022;
    col *= uReveal;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const smootherstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Where the camera sits within a shot, 0 = act entering, 1 = act leaving. */
function framing(shot: CinemaShot, t: number) {
  const zoom = shot.zoom ?? 1.06;
  const fx = shot.focus?.[0] ?? 0;
  const fy = shot.focus?.[1] ?? 0;
  const e = t - 0.5; // centred so the move brackets the act
  switch (shot.move ?? "push") {
    case "panLeft":
      return { zoom: zoom * (1 + t * 0.05), x: fx - e * 0.12, y: fy };
    case "panRight":
      return { zoom: zoom * (1 + t * 0.05), x: fx + e * 0.12, y: fy };
    case "tiltUp":
      return { zoom: zoom * (1 + t * 0.06), x: fx, y: fy + e * 0.1 };
    case "pullBack":
      return { zoom: zoom * (1.12 - t * 0.14), x: fx, y: fy - e * 0.03 };
    default:
      return { zoom: zoom * (1 + t * 0.13), x: fx, y: fy };
  }
}

export default function CinemaScene({ shots }: { shots: CinemaShot[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
      const mobile = window.innerWidth < 860;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.6 : 2));

      const loader = new THREE.TextureLoader();
      const load = (src: string, srgb: boolean) =>
        loader.loadAsync(src).then((t) => {
          if (srgb) t.colorSpace = THREE.SRGBColorSpace;
          t.minFilter = THREE.LinearFilter;
          t.generateMipmaps = false;
          return t;
        });

      const loaded = await Promise.all(
        shots.map(async (s) => ({ tex: await load(s.src, true), dep: await load(depthSrc(s.src), false) })),
      ).catch(() => null);
      if (disposed || !loaded) {
        renderer.dispose();
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const second = Math.min(1, loaded.length - 1);
      const uniforms = {
        uTexA: { value: loaded[0].tex },
        uTexB: { value: loaded[second].tex },
        uDepA: { value: loaded[0].dep },
        uDepB: { value: loaded[second].dep },
        uCoverA: { value: new THREE.Vector2(1, 1) },
        uCoverB: { value: new THREE.Vector2(1, 1) },
        uFocusA: { value: new THREE.Vector2() },
        uFocusB: { value: new THREE.Vector2() },
        uZoomA: { value: 1 },
        uZoomB: { value: 1 },
        uDimA: { value: 0.4 },
        uDimB: { value: 0.4 },
        uParA: { value: new THREE.Vector2() },
        uParB: { value: new THREE.Vector2() },
        uSunA: { value: new THREE.Vector2(0.82, 0.38) },
        uSunB: { value: new THREE.Vector2(0.82, 0.38) },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uReveal: { value: reduceMotion ? 1 : 0 },
        uFlash: { value: 0 },
        uBlur: { value: 0 },
      };
      const quad = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false }),
      );
      scene.add(quad);

      // Dust drifting through the light
      const motes = mobile ? 180 : 420;
      const dust = new Float32Array(motes * 3);
      const dustSeed = new Float32Array(motes);
      for (let i = 0; i < motes; i++) {
        dust[i * 3] = Math.random() * 2 - 1;
        dust[i * 3 + 1] = Math.random() * 2 - 1;
        dustSeed[i] = Math.random();
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
      dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
      const dustUniforms = { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uReveal: uniforms.uReveal };
      const dustMat = new THREE.ShaderMaterial({
        uniforms: dustUniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform float uPR;
          varying float vSeed;
          void main() {
            vec3 p = position;
            p.y = mod(p.y + uTime * (0.012 + aSeed * 0.03) + 1.0, 2.0) - 1.0;
            p.x += sin(uTime * 0.25 + aSeed * 30.0) * 0.06;
            gl_Position = vec4(p.xy, 0.0, 1.0);
            gl_PointSize = (1.0 + aSeed * 3.2) * uPR;
            vSeed = aSeed;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uReveal;
          varying float vSeed;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = pow(1.0 - d * 2.0, 2.0) * (0.12 + vSeed * 0.3);
            a *= 0.5 + 0.5 * sin(uTime * 0.8 + vSeed * 40.0);
            gl_FragColor = vec4(vec3(1.0, 0.94, 0.84), a * uReveal);
          }
        `,
      });
      scene.add(new THREE.Points(dustGeo, dustMat));

      const cover = (tex: THREE.Texture, out: THREE.Vector2) => {
        const img = tex.image as { width: number; height: number };
        const frame = canvas.clientWidth / canvas.clientHeight;
        const asset = img.width / img.height;
        if (asset > frame) out.set(frame / asset, 1);
        else out.set(1, asset / frame);
        return out;
      };

      const resize = () => renderer.setSize(window.innerWidth, window.innerHeight, false);
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
        // how fast the camera is travelling between acts, smoothed
        velocity += (Math.min(1, Math.abs(progress - before) / Math.max(dt, 0.001) / 1.6) - velocity) * 0.18;
        const i = Math.min(Math.floor(progress), Math.max(0, last - 1));
        const f = Math.min(1, Math.max(0, progress - i));
        const j = Math.min(i + 1, last);

        const A = framing(shots[i], f);
        const B = framing(shots[j], f - 1);

        uniforms.uTexA.value = loaded[i].tex;
        uniforms.uDepA.value = loaded[i].dep;
        uniforms.uTexB.value = loaded[j].tex;
        uniforms.uDepB.value = loaded[j].dep;
        cover(loaded[i].tex, uniforms.uCoverA.value);
        cover(loaded[j].tex, uniforms.uCoverB.value);
        uniforms.uZoomA.value = A.zoom;
        uniforms.uZoomB.value = B.zoom;
        uniforms.uFocusA.value.set(A.x, A.y);
        uniforms.uFocusB.value.set(B.x, B.y);
        uniforms.uDimA.value = shots[i].dim ?? 0.42;
        uniforms.uDimB.value = shots[j].dim ?? 0.42;
        uniforms.uMix.value = smootherstep(f);

        // depth parallax: pointer plus a little from the camera's own travel
        smoothPointer.lerp(pointer, 0.045);
        uniforms.uParA.value.set(smoothPointer.x * 0.05 + f * 0.012, smoothPointer.y * 0.028);
        uniforms.uParB.value.set(smoothPointer.x * 0.05 + (f - 1) * 0.012, smoothPointer.y * 0.028);

        uniforms.uSunA.value.set(shots[i].sun?.[0] ?? 0.82, shots[i].sun?.[1] ?? 0.38);
        uniforms.uSunB.value.set(shots[j].sun?.[0] ?? 0.82, shots[j].sun?.[1] ?? 0.38);

        // the cut itself: a light leak and a touch of smear, both strongest mid-dissolve
        const cut = Math.sin(Math.PI * Math.min(1, Math.max(0, f))) * (0.35 + 0.65 * velocity);
        uniforms.uFlash.value = reduceMotion ? 0 : cut * 0.16;
        uniforms.uBlur.value = reduceMotion ? 0 : velocity * 0.012;
        // letterbox bars close in while the page is moving quickly
        root.style.setProperty("--cine-bar", `${(reduceMotion ? 0 : velocity * 34).toFixed(2)}px`);

        uniforms.uTime.value = reduceMotion ? 0 : time;
        if (uniforms.uReveal.value < 1) uniforms.uReveal.value = Math.min(1, time / 1.4);
        dustUniforms.uTime.value = reduceMotion ? 0 : time;

        renderer.render(scene, camera);
      };
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        root.style.removeProperty("--cine-bar");
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        quad.geometry.dispose();
        (quad.material as THREE.Material).dispose();
        dustGeo.dispose();
        dustMat.dispose();
        loaded.forEach(({ tex, dep }) => {
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
  }, [shots]);

  return <canvas ref={canvasRef} className="cine__canvas" aria-hidden="true" />;
}
