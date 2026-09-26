"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { battery, bolt, globe, network, randoms, solarPanel, sun } from "@/lib/shapes";

/**
 * A figure drawn in light, floating over the plate: each act has its own form — sun, panel, cell,
 * charge, network, globe — and the swarm morphs from one to the next as the page scrolls, swirling
 * through the change. Tuned for the cinematic pages: cool white with a green core, never louder
 * than the photograph behind it.
 */

export type FigureKey = "sun" | "panel" | "battery" | "bolt" | "network" | "globe";

const BUILDERS: Record<FigureKey, (n: number) => Float32Array> = {
  sun,
  panel: solarPanel,
  battery,
  bolt,
  network,
  globe,
};

const vertexShader = /* glsl */ `
  attribute vec3 p1;
  attribute float aRand;
  attribute float aSize;
  uniform float uMix;
  uniform float uTrans;
  uniform float uTime;
  uniform float uSize;
  uniform float uPR;
  uniform float uIntro;
  varying float vRand;
  varying float vTw;

  void main() {
    vec3 pos = mix(position, p1, uMix);

    // the swarm spins and swells while it is changing form
    float ang = uTrans * (0.9 + aRand * 2.0);
    float c = cos(ang), s = sin(ang);
    pos.xz = mat2(c, -s, s, c) * pos.xz;
    pos += normalize(pos + 0.0001) * uTrans * (0.35 + aRand * 1.1);

    float t = uTime * 0.5 + aRand * 62.83;
    pos += vec3(sin(t), cos(t * 1.3), sin(t * 0.7)) * (0.01 + uTrans * 0.16);

    pos *= mix(0.4, 1.0, uIntro);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPR / -mv.z;
    vRand = aRand;
    vTw = 0.55 + 0.45 * sin(uTime * 1.5 + aRand * 40.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform float uOpacity;
  varying float vRand;
  varying float vTw;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 1.8);
    vec3 col = mix(uColA, uColB, vRand) + pow(a, 5.0) * 0.5;
    gl_FragColor = vec4(col, a * vTw * uOpacity);
  }
`;

export default function MorphFigures({ figures }: { figures: FigureKey[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    } catch {
      return;
    }

    const phone = window.innerWidth < 860;
    const N = phone ? 5000 : 14000;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, phone ? 1.6 : 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 9;

    // every figure this page needs, precomputed once
    const forms = figures.map((k) => BUILDERS[k](N));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(forms[0], 3));
    geometry.setAttribute("p1", new THREE.BufferAttribute(forms[Math.min(1, forms.length - 1)], 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(randoms(N, 5), 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(randoms(N, 9).map((v) => 0.4 + Math.pow(v, 4) * 1.7), 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);

    const uniforms = {
      uMix: { value: 0 },
      uTrans: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: phone ? 26 : 36 },
      uPR: { value: renderer.getPixelRatio() },
      uIntro: { value: 0 },
      uOpacity: { value: phone ? 0.6 : 0.95 },
      uColA: { value: new THREE.Color("#eafff6") },
      uColB: { value: new THREE.Color("#34d399") },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const group = new THREE.Group();
    group.add(new THREE.Points(geometry, material));
    group.scale.setScalar(1);
    scene.add(group);

    const resize = () => renderer.setSize(window.innerWidth, window.innerHeight, false);
    resize();
    window.addEventListener("resize", resize);

    const pointer = new THREE.Vector2();
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

    const last = forms.length - 1;
    let progress = readProgress();
    let shownA = -1;
    let shownB = -1;
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;

      progress += (readProgress() - progress) * (1 - Math.pow(0.004, dt));
      const i = Math.min(Math.floor(progress), Math.max(0, last - 1));
      const j = Math.min(i + 1, last);
      const f = Math.min(1, Math.max(0, progress - i));

      // only two forms are ever resident; swap the attributes as the window moves
      if (i !== shownA) {
        geometry.setAttribute("position", new THREE.BufferAttribute(forms[i], 3));
        shownA = i;
      }
      if (j !== shownB) {
        geometry.setAttribute("p1", new THREE.BufferAttribute(forms[j], 3));
        shownB = j;
      }

      uniforms.uMix.value = f * f * (3 - 2 * f);
      uniforms.uTrans.value = Math.sin(Math.PI * f);
      uniforms.uTime.value = time;
      uniforms.uIntro.value = Math.min(1, time / 1.8);

      // hero acts have an open right half; the rest carry card grids, so the figure lifts into the
      // top corner and shrinks to stay clear of them
      const openA = i === 0 ? 1 : 0;
      const openB = j === 0 ? 1 : 0;
      const open = openA + (openB - openA) * f;
      const targetX = phone ? 0 : 2.85 + open * 0.15;
      const targetY = phone ? 2.4 : 1.45 - open * 0.65;
      const scale = phone ? 0.4 : 0.52 + open * 0.16;
      group.position.x += (targetX + pointer.x * 0.12 - group.position.x) * 0.05;
      group.position.y += (targetY - pointer.y * 0.08 - group.position.y) * 0.05;
      const sc = group.scale.x + (scale - group.scale.x) * 0.06;
      group.scale.setScalar(sc);
      group.rotation.y = Math.sin(time * 0.18) * 0.26;

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [figures]);

  return (
    <>
      <div className="cine__figure-shade" aria-hidden="true" />
      <canvas ref={canvasRef} className="cine__figure" aria-hidden="true" />
    </>
  );
}
