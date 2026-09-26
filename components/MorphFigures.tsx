"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { battery, bolt, globe, network, randoms, solarPanel, sun } from "@/lib/shapes";

/**
 * The figure gets its own instrument panel rather than floating loose over the photograph: a framed,
 * darkened window on the right of the frame where a swarm of light holds one form per act and morphs
 * into the next as the page scrolls. Inside the frame it always has contrast, and it can never drift
 * across the copy.
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

const LABELS: Record<FigureKey, string> = {
  sun: "Irradiance",
  panel: "PV Module",
  battery: "Battery Cell",
  bolt: "Power Flow",
  network: "Quality Data",
  globe: "Project Lifecycle",
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
    pos += normalize(pos + 0.0001) * uTrans * (0.3 + aRand * 0.9);

    float t = uTime * 0.5 + aRand * 62.83;
    pos += vec3(sin(t), cos(t * 1.3), sin(t * 0.7)) * (0.01 + uTrans * 0.14);
    pos *= mix(0.55, 1.0, uIntro);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * uPR / -mv.z;
    vRand = aRand;
    vTw = 0.6 + 0.4 * sin(uTime * 1.5 + aRand * 40.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  varying float vRand;
  varying float vTw;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = pow(1.0 - d * 2.0, 1.7);
    vec3 col = mix(uColA, uColB, vRand) + pow(a, 4.0) * 0.7;
    gl_FragColor = vec4(col, a * vTw);
  }
`;

export default function MorphFigures({ figures }: { figures: FigureKey[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.innerWidth < 860;
    const N = phone ? 7000 : 16000;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 8.4;

    const forms = figures.map((k) => BUILDERS[k](N));
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(forms[0], 3));
    geometry.setAttribute("p1", new THREE.BufferAttribute(forms[Math.min(1, forms.length - 1)], 3));
    geometry.setAttribute("aRand", new THREE.BufferAttribute(randoms(N, 5), 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(randoms(N, 9).map((v) => 0.5 + Math.pow(v, 4) * 1.6), 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);

    const uniforms = {
      uMix: { value: 0 },
      uTrans: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: phone ? 26 : 30 },
      uPR: { value: renderer.getPixelRatio() },
      uIntro: { value: reduceMotion ? 1 : 0 },
      uColA: { value: new THREE.Color("#f2fffa") },
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
    group.scale.setScalar(1.25);
    scene.add(group);

    // the canvas fills its frame, so it sizes from the element rather than the window
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
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
    let labelled = -1;
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;

      progress += (readProgress() - progress) * (reduceMotion ? 1 : 1 - Math.pow(0.004, dt));
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
      const showing = f > 0.5 ? j : i;
      if (showing !== labelled) {
        labelled = showing;
        setActive(showing);
      }

      uniforms.uMix.value = f * f * (3 - 2 * f);
      uniforms.uTrans.value = reduceMotion ? 0 : Math.sin(Math.PI * f);
      uniforms.uTime.value = reduceMotion ? 0 : time;
      uniforms.uIntro.value = Math.min(1, time / 1.6);

      group.rotation.y = Math.sin(time * 0.16) * 0.3 + pointer.x * 0.12;
      group.rotation.x = -pointer.y * 0.08;

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [figures]);

  return (
    <aside className="cine__inst" aria-hidden="true">
      <div className="cine__inst-frame">
        <canvas ref={canvasRef} />
        <span className="cine__inst-corner cine__inst-corner--tl" />
        <span className="cine__inst-corner cine__inst-corner--tr" />
        <span className="cine__inst-corner cine__inst-corner--bl" />
        <span className="cine__inst-corner cine__inst-corner--br" />
      </div>
      <p className="cine__inst-label">
        <span>{String(active + 1).padStart(2, "0")}</span>
        {LABELS[figures[active] ?? figures[0]]}
      </p>
    </aside>
  );
}
