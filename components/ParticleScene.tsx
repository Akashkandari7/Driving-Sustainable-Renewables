"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { battery, bolt, globe, imageShape, network, randoms, scatter, solarPanel, sun } from "@/lib/shapes";
import { scenes } from "@/lib/content";
import { currentTheme, THEME_EVENT, type Theme } from "@/lib/theme";

// Two colours per scene; each particle picks a fixed mix between them.
// Light: one hue per shape, in a tight vivid range, so the swarm reads as a single clean object —
// mixing two distant hues here just looks muddy. Dark: neon glow on black.
const PALETTES: Record<Theme, [string, string][]> = {
  light: [
    ["#fb923c", "#f97316"], // sun
    ["#3b82f6", "#2563eb"], // solar panel
    ["#10b981", "#059669"], // battery
    ["#38bdf8", "#0ea5e9"], // bolt
    ["#818cf8", "#6366f1"], // network
    ["#34d399", "#3b82f6"], // globe
  ],
  dark: [
    ["#ffb347", "#ff5a1f"],
    ["#3b82f6", "#7dd3fc"],
    ["#10b981", "#bef264"],
    ["#38bdf8", "#fde68a"],
    ["#818cf8", "#22d3ee"],
    ["#10b981", "#3b82f6"],
  ],
};

const vertexShader = /* glsl */ `
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute vec3 p4;
  attribute vec3 p5;
  attribute vec3 aScatter;
  attribute vec3 aLogoCol;
  attribute float aRand;
  attribute float aSize;
  uniform float uW[6];
  uniform float uTime;
  uniform float uTrans;
  uniform float uIntro;
  uniform float uSize;
  uniform float uPR;
  uniform float uTwinkle;
  varying float vRand;
  varying float vTwinkle;
  varying vec3 vLogoCol;

  void main() {
    vec3 pos = position * uW[0] + p1 * uW[1] + p2 * uW[2] + p3 * uW[3] + p4 * uW[4] + p5 * uW[5];

    // Mid-morph the swarm spins and puffs outwards, then settles into the next shape.
    float ang = uTrans * (1.1 + aRand * 2.4);
    float c = cos(ang), s = sin(ang);
    pos.xz = mat2(c, -s, s, c) * pos.xz;
    pos += normalize(pos + 0.0001) * uTrans * (0.5 + aRand * 1.6);

    float t = uTime * 0.6 + aRand * 62.83;
    pos += vec3(sin(t), cos(t * 1.3), sin(t * 0.7)) * (0.012 + uTrans * 0.22);

    // Intro: the swarm holds the DSR logo, then streams into the first shape.
    float e = 1.0 - pow(1.0 - uIntro, 3.0);
    pos = mix(aScatter, pos, clamp(e * 1.2 - aRand * 0.2, 0.0, 1.0));

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPR / -mv.z;
    vRand = aRand;
    vTwinkle = 1.0 - uTwinkle + uTwinkle * (0.5 + 0.5 * sin(uTime * 1.7 + aRand * 40.0));
    vLogoCol = aLogoCol;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uOpacity;
  uniform float uDark;
  uniform float uLogo;
  varying float vRand;
  varying float vTwinkle;
  varying vec3 vLogoCol;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 1.7);
    vec3 base = mix(uColA, uColB, vRand);
    base = mix(base, vLogoCol, uLogo);
    // Dark: additive core blown out to white. Light: flat ink, so overlapping points stay clean.
    vec3 col = mix(base, base + pow(a, 5.0) * 0.55, uDark);
    gl_FragColor = vec4(col, a * vTwinkle * uOpacity);
  }
`;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

export default function ParticleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    const init = async () => {
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      } catch {
        document.documentElement.classList.add("no-webgl");
        return;
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = window.innerWidth < 820;
      const N = mobile ? 9000 : 30000;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 9;

      // Intro shape: the DSR logo sampled from the client's own artwork, with a scatter-cloud fallback.
      let intro = scatter(N);
      let logoColors = new Float32Array(N * 3).fill(1);
      try {
        const sampled = imageShape(await loadImage("/images/logo.jpeg"), N, mobile ? 4.4 : 5.6);
        intro = sampled.positions;
        logoColors = sampled.colors;
      } catch {
        // keep the scatter fallback
      }
      if (disposed) return renderer.dispose();

      const shapes = [sun(N), solarPanel(N), battery(N), bolt(N), network(N), globe(N)];
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
      shapes.slice(1).forEach((s, i) => geometry.setAttribute(`p${i + 1}`, new THREE.BufferAttribute(s, 3)));
      geometry.setAttribute("aScatter", new THREE.BufferAttribute(intro, 3));
      geometry.setAttribute("aLogoCol", new THREE.BufferAttribute(logoColors, 3));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(randoms(N, 5), 1));
      const sizes = randoms(N, 9).map((v) => 0.45 + Math.pow(v, 4) * 1.9);
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);

      const swatches: Record<Theme, THREE.Color[][]> = {
        light: PALETTES.light.map(([a, b]) => [new THREE.Color(a), new THREE.Color(b)]),
        dark: PALETTES.dark.map(([a, b]) => [new THREE.Color(a), new THREE.Color(b)]),
      };
      let theme = currentTheme();
      let colors = swatches[theme];
      const uniforms = {
        uW: { value: [1, 0, 0, 0, 0, 0] },
        uTime: { value: 0 },
        uTrans: { value: 0 },
        uIntro: { value: reduceMotion ? 1 : 0 },
        uSize: { value: mobile ? 32 : 38 },
        uPR: { value: renderer.getPixelRatio() },
        uOpacity: { value: 1 },
        uDark: { value: 0 },
        uTwinkle: { value: 0.4 },
        uLogo: { value: reduceMotion ? 0 : 1 },
        uColA: { value: colors[0][0].clone() },
        uColB: { value: colors[0][1].clone() },
      };
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const group = new THREE.Group();
      group.add(new THREE.Points(geometry, material));
      scene.add(group);

      // Faint background dust
      const starCount = mobile ? 400 : 1100;
      const starPos = new Float32Array(starCount * 3);
      const sr = randoms(starCount * 3, 3);
      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (sr[i * 3] - 0.5) * 60;
        starPos[i * 3 + 1] = (sr[i * 3 + 1] - 0.5) * 40;
        starPos[i * 3 + 2] = -8 - sr[i * 3 + 2] * 25;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0x94a7c4, size: 0.055, transparent: true, opacity: 0.4, depthWrite: false });
      scene.add(new THREE.Points(starGeo, starMat));

      // Additive glow only works on black; the light theme needs normal blending and deeper inks.
      const applyTheme = (next: Theme) => {
        theme = next;
        colors = swatches[theme];
        const dark = theme === "dark";
        uniforms.uDark.value = dark ? 1 : 0;
        uniforms.uOpacity.value = dark ? (mobile ? 0.9 : 1) : mobile ? 0.85 : 1;
        uniforms.uSize.value = mobile ? 34 : dark ? 38 : 40;
        // less per-particle flicker in light, where it reads as dirt rather than sparkle
        uniforms.uTwinkle.value = dark ? 0.4 : 0.12;
        material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
        material.needsUpdate = true;
        starMat.color.set(dark ? 0x9fb4d9 : 0x94a7c4);
        starMat.opacity = dark ? 0.45 : 0.4;
      };
      applyTheme(theme);

      const onTheme = (e: Event) => applyTheme((e as CustomEvent<Theme>).detail);
      window.addEventListener(THEME_EVENT, onTheme);
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
      const onSystemTheme = () => applyTheme(currentTheme());
      systemTheme.addEventListener("change", onSystemTheme);

      // Where the shape sits for each scene: opposite the text on desktop, above it on mobile.
      const offsets = scenes.map((s) =>
        mobile ? { x: 0, y: 2.25 } : { x: s.side === "left" ? 2.5 : -2.5, y: 0.25 },
      );
      group.scale.setScalar(mobile ? 0.5 : 1);

      const resize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);

      const pointer = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onPointer);

      // Fractional scene index: 2.5 means the viewport centre is halfway between scene 2 and 3.
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
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

      const last = shapes.length - 1;
      let progress = readProgress();
      const clock = new THREE.Clock();
      let raf = 0;

      const frame = () => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(clock.getDelta(), 0.05);
        const time = clock.elapsedTime;

        progress += (readProgress() - progress) * (reduceMotion ? 1 : 1 - Math.pow(0.001, dt));
        const i = Math.min(Math.floor(progress), last - 1);
        const f = smoothstep(0.15, 0.85, Math.min(1, Math.max(0, progress - i)));

        const w = uniforms.uW.value;
        w.fill(0);
        w[i] = 1 - f;
        w[i + 1] = f;
        uniforms.uTrans.value = reduceMotion ? 0 : Math.sin(Math.PI * f);
        uniforms.uTime.value = reduceMotion ? 0 : time;
        if (uniforms.uIntro.value < 1) {
          // hold the logo for a beat, then stream into the first shape
          uniforms.uIntro.value = Math.min(1, Math.max(0, (time - 1.1) / 2.2));
          uniforms.uLogo.value = Math.max(0, 1 - uniforms.uIntro.value * 2.2);
        }
        uniforms.uColA.value.copy(colors[i][0]).lerp(colors[i + 1][0], f);
        uniforms.uColB.value.copy(colors[i][1]).lerp(colors[i + 1][1], f);

        const ox = offsets[i].x + (offsets[i + 1].x - offsets[i].x) * f;
        const oy = offsets[i].y + (offsets[i + 1].y - offsets[i].y) * f;
        group.position.x += (ox - group.position.x) * 0.08;
        group.position.y += (oy - group.position.y) * 0.08;
        // Gentle sway only — the panel and bolt are flat, so large rotations would show them edge-on.
        if (!reduceMotion) group.rotation.y = Math.sin(time * 0.2) * 0.22;


        camera.position.x += (pointer.x * 0.45 - camera.position.x) * 0.04;
        camera.position.y += (-pointer.y * 0.3 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      frame();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener(THEME_EVENT, onTheme);
        systemTheme.removeEventListener("change", onSystemTheme);
        geometry.dispose();
        material.dispose();
        starGeo.dispose();
        starMat.dispose();
        renderer.dispose();
      };
    };

    init();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className="particles" aria-hidden="true" />;
}
