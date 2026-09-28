"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { asset } from "@/lib/asset";

/* A subject the visitor can turn in their hands.

   Each object is a GLB standing on the dark stage. The scene is only built once the section
   is close to view and is torn down again when it is well out of the way, so a page carrying
   ten of them still scrolls like a page of text. */

export type ModelName =
  | "module"
  | "rack"
  | "container"
  | "inverter"
  | "wafer"
  | "crate"
  | "tracker"
  | "bench"
  | "transformer"
  | "report"
  | "combiner"
  | "cell"
  | "weather"
  | "thermal"
  | "pallet"
  | "tester";

/** Breathing room left around each object once it is fitted, as a multiple of its radius.
    A little more for the long, thin subjects so they do not fill the frame edge to edge. */
const MARGIN: Record<ModelName, number> = {
  module: 1.16,
  rack: 1.12,
  container: 1.18,
  inverter: 1.12,
  wafer: 1.1,
  crate: 1.14,
  tracker: 1.2,
  bench: 1.14,
  transformer: 1.14,
  report: 1.14,
  combiner: 1.12,
  cell: 1.1,
  weather: 1.22,
  thermal: 1.12,
  pallet: 1.14,
  tester: 1.12,
};

/* A browser only tolerates a handful of WebGL contexts before it starts dropping the oldest
   ones itself, and a services page carries seven objects. So the scenes are pooled: at most
   two exist at a time, and the one furthest from the viewport is retired to make room. */
const LIVE_LIMIT = 2;
type Live = { el: HTMLElement; close: () => void };
const live: Live[] = [];

const distance = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
};

const makeRoom = (keep: HTMLElement) => {
  while (live.length >= LIVE_LIMIT) {
    let worst = -1;
    let worstAt = -1;
    live.forEach((l, i) => {
      if (l.el === keep) return;
      const d = distance(l.el);
      if (d > worst) {
        worst = d;
        worstAt = i;
      }
    });
    if (worstAt < 0) return;
    const [gone] = live.splice(worstAt, 1);
    gone.close();
  }
};

export default function BrewModel({
  name,
  label,
  children,
}: {
  name: ModelName;
  label: string;
  /** The drawn subject, shown while the mesh loads and kept if WebGL never arrives. */
  children?: React.ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    // WebGL isn't a given — a stage with no object on it is worse than a still picture.
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2") && !probe.getContext("webgl")) {
      setState("failed");
      return;
    }

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let teardown: (() => void) | null = null;

    const build = () => {
      if (teardown) return;
      makeRoom(el);
      setState("loading");

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      // Capped at 1.5: a turntable gains nothing from a full retina buffer and costs a lot.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      renderer.domElement.className = "brew-model__canvas";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);

      // A neutral room gives the metal and glass something to reflect; the lights below then
      // put the stage's own warm key back on top of it.
      // A bright neutral room is what the metal and glass actually reflect. Turned up well
      // past the default so the objects read as new equipment under work lights.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.02);
      scene.environment = env.texture;
      scene.environmentIntensity = 1.5;

      const key = new THREE.DirectionalLight(0xfff4e2, 3.4);
      key.position.set(3.2, 4.2, 3);
      scene.add(key);

      // Cool counter-light from behind separates the object from the dark stage.
      const rim = new THREE.DirectionalLight(0xbfd8ff, 2);
      rim.position.set(-3.6, 2.2, -3);
      scene.add(rim);

      // A low warm bounce, the colour of the pool the object stands in.
      const bounce = new THREE.DirectionalLight(0xffc27a, 1.1);
      bounce.position.set(-1.2, -2.6, 2);
      scene.add(bounce);

      const fill = new THREE.HemisphereLight(0xf2f6ff, 0x141a20, 1.15);
      scene.add(fill);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.075;
      controls.rotateSpeed = 0.75;
      // Kept above the floor and below the ceiling, so the object never ends up on its head.
      controls.minPolarAngle = 0.55;
      controls.maxPolarAngle = Math.PI / 2 + 0.12;
      controls.autoRotate = !calm;
      controls.autoRotateSpeed = 0.9;

      // The turntable stops while the visitor is steering and picks up again once they let go.
      const hold = () => (controls.autoRotate = false);
      const release = () => (controls.autoRotate = !calm);
      controls.addEventListener("start", hold);
      controls.addEventListener("end", release);

      const root = new THREE.Group();
      scene.add(root);

      let frame = 0;
      let running = false;
      const render = () => {
        controls.update();
        renderer.render(scene, camera);
      };
      const loop = () => {
        frame = requestAnimationFrame(loop);
        render();
      };
      const start = () => {
        if (running) return;
        running = true;
        loop();
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };

      // The object is normalised to a unit sphere, so the distance that frames it is the one
      // that fits a sphere of radius 1 in the narrower of the two fields of view. Fitting the
      // sphere rather than the box means no corner can swing out of frame while it turns.
      let fitted = false;
      const fit = () => {
        const vFov = (camera.fov * Math.PI) / 180;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        const tight = Math.min(vFov, hFov);
        const reach = (MARGIN[name] / Math.sin(tight / 2)) * 1.02;
        camera.position.setLength(reach);
        camera.near = Math.max(reach - 2.5, 0.05);
        camera.far = reach + 4;
        camera.updateProjectionMatrix();
        controls.update();
      };

      const size = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (fitted) fit();
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(el);

      let disposed = false;
      // The meshes ship Draco-compressed — a few hundred KB each instead of tens of MB.
      const draco = new DRACOLoader().setDecoderPath(asset("/draco/"));
      const loader = new GLTFLoader().setDRACOLoader(draco);
      loader.load(
        asset(`/models/${name}.glb`),
        (gltf) => {
          if (disposed) return;
          const object = gltf.scene;

          // Centre it on the origin and scale it so its bounding sphere has radius 1,
          // whatever size and offset it arrived in.
          const box = new THREE.Box3().setFromObject(object);
          const sphere = box.getBoundingSphere(new THREE.Sphere());
          const unit = 1 / (sphere.radius || 1);
          object.position.sub(sphere.center);
          object.scale.setScalar(unit);
          object.position.multiplyScalar(unit);
          root.add(object);

          // A three-quarter view to start from; fit() sets how far back that sits.
          camera.position.set(0.62, 0.42, 0.78);
          controls.target.set(0, 0, 0);
          fitted = true;
          fit();

          setState("ready");
          start();
        },
        undefined,
        () => {
          if (!disposed) setState("failed");
        },
      );

      // Nothing renders while the section is off screen.
      let onScreen = false;
      const vis = new IntersectionObserver(
        ([e]) => {
          onScreen = e.isIntersecting;
          if (onScreen) start();
          else stop();
        },
        { rootMargin: "40% 0px" },
      );
      vis.observe(el);
      const onHidden = () => (document.hidden ? stop() : onScreen && start());
      document.addEventListener("visibilitychange", onHidden);

      // Turning the object and scrolling the page both want the main thread. While the page
      // is moving the turntable gives way, and picks up again once the scroll settles.
      let settle = 0;
      const onScroll = () => {
        stop();
        clearTimeout(settle);
        settle = window.setTimeout(() => {
          if (onScreen && !document.hidden) start();
        }, 140);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const close = () => {
        disposed = true;
        stop();
        vis.disconnect();
        ro.disconnect();
        clearTimeout(settle);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onHidden);
        controls.removeEventListener("start", hold);
        controls.removeEventListener("end", release);
        controls.dispose();
        scene.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => {
            if (!mat) return;
            Object.values(mat).forEach((v) => {
              if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose();
            });
            mat.dispose();
          });
        });
        env.texture.dispose();
        pmrem.dispose();
        draco.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        setState("idle");
      };

      teardown = () => {
        const at = live.findIndex((l) => l.el === el);
        if (at >= 0) live.splice(at, 1);
        close();
      };
      live.push({ el, close: () => {
        close();
        teardown = null;
      } });
    };

    // Build a little before the section arrives, and let it go once it is far behind.
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) build();
        else if (teardown && Math.abs(e.boundingClientRect.top) > window.innerHeight * 1.6) {
          teardown();
          teardown = null;
        }
      },
      { rootMargin: "60% 0px" },
    );
    near.observe(el);

    return () => {
      near.disconnect();
      teardown?.();
      teardown = null;
    };
  }, [name]);

  return (
    <div
      ref={host}
      className={`brew-model is-${state}`}
      data-model={name}
      role="img"
      aria-label={`${label}. Drag to turn it.`}
    >
      {children && (
        <div className="brew-model__still" aria-hidden="true">
          {children}
        </div>
      )}
      <span className="brew-model__hint" aria-hidden="true">
        Drag to turn
      </span>
    </div>
  );
}
