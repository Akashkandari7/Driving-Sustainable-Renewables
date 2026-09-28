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

/** Breathing room left around each object, as a multiple of what it sweeps as it turns.
    Worked back from the module's own dimensions: at 1 it stands about a third larger than it
    used to and runs into the spec card, and by 1.4 it is smaller than it ever was. These sit
    just above 1.2, which reads a little larger than before with air still around it. The
    long, thin subjects gain much more than that from the cylinder fit on their own. */
const MARGIN: Record<ModelName, number> = {
  module: 1.26,
  rack: 1.2,
  container: 1.2,
  inverter: 1.2,
  wafer: 1.18,
  crate: 1.2,
  tracker: 1.22,
  bench: 1.16,
  transformer: 1.2,
  report: 1.16,
  combiner: 1.2,
  cell: 1.18,
  weather: 1.22,
  thermal: 1.18,
  pallet: 1.18,
  tester: 1.16,
};

/** The shape of the box each subject stands in, as width over height. A mast in a landscape
    frame leaves the sides empty and a pallet in a square one leaves the top and bottom empty,
    so the frame is cut to the object instead of the other way round. */
const FRAME: Record<ModelName, number> = {
  module: 0.82,
  rack: 0.78,
  container: 1.5,
  inverter: 0.8,
  wafer: 1.05,
  crate: 1.2,
  tracker: 1.15,
  bench: 1.45,
  transformer: 1.25,
  report: 1.45,
  combiner: 0.95,
  cell: 0.75,
  weather: 0.62,
  thermal: 1.3,
  pallet: 1.45,
  tester: 1.5,
};

/* A browser only tolerates a handful of WebGL contexts at once, and the services page carries
   seven objects. So the scenes are pooled. The rule that matters: a subject the visitor can
   actually see is never retired to make room for another one — only the ones off screen are,
   and a host that is still wanted is rebuilt as soon as room frees up. */
/* A desktop browser copes with well over a dozen WebGL contexts, and an idle one costs
   memory rather than frames. So on a wide screen every subject on the page gets to keep its
   scene, which is what makes reaching one instant; a phone keeps a handful. */
const liveLimit = () => (typeof window !== "undefined" && window.innerWidth >= 900 ? 10 : 3);

type Host = {
  el: HTMLElement;
  /** near enough that it ought to be showing */
  wanted: boolean;
  live: boolean;
  open: () => void;
  close: () => void;
};

const hosts: Host[] = [];

/* The room the objects reflect is the same for all of them, and assembling it is a couple of
   dozen meshes and materials. It is built once and handed to each scene's prefilter, which is
   the part that has to be done per renderer. */
let room: THREE.Scene | null = null;
const sharedRoom = () => (room ??= new RoomEnvironment());

/** Pixels between the element and the viewport — zero while any part of it is on screen. */
const gap = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  const h = window.innerHeight;
  if (r.bottom > 0 && r.top < h) return 0;
  return r.top >= h ? r.top - h : -r.bottom;
};

/* Scenes are built one or two at a time, but the files they need can all be on their way
   long before that. Each host puts its mesh in this queue on mount; once the page has gone
   quiet they are fetched in the background, so by the time a subject is scrolled to, its
   mesh is already in the browser's cache and the scene appears at once. */
const queued = new Set<string>();
let warming = false;

const warm = async () => {
  if (warming) return;
  warming = true;
  for (const url of queued) {
    try {
      await fetch(url, { priority: "low" } as RequestInit);
    } catch {
      // A mesh that cannot be prefetched is simply loaded the slow way later.
    }
  }
  schedule();
};

const prefetch = (url: string) => {
  if (queued.has(url)) return;
  queued.add(url);
  if (typeof window === "undefined") return;
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (idle) idle(warm);
  else window.setTimeout(warm, 1200);
};

let scrolling = false;

const idleRun = (fn: () => void) => {
  const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (idle) idle(fn);
  else window.setTimeout(fn, 200);
};

/* Once the ones in view are up, the rest are built quietly in the background, nearest first
   and one per idle moment, so that scrolling to a subject never starts a build. */
const topUp = () => {
  if (scrolling) return;
  if (hosts.filter((h) => h.live).length >= liveLimit()) return;
  const next = hosts.filter((h) => !h.live).sort((a, b) => gap(a.el) - gap(b.el))[0];
  if (!next) return;
  next.open();
  next.live = true;
  idleRun(topUp);
};

const schedule = () => {
  // Only what is a long way off is given up; anything near stays built.
  const far = window.innerHeight * 5;
  hosts.forEach((h) => {
    if (h.live && !h.wanted && gap(h.el) > far) {
      h.close();
      h.live = false;
    }
  });

  let count = hosts.filter((h) => h.live).length;
  const pending = hosts.filter((h) => h.wanted && !h.live).sort((a, b) => gap(a.el) - gap(b.el));

  for (const h of pending) {
    // Never start a build while the page is moving.
    if (scrolling) break;
    if (count >= liveLimit()) {
      const furthest = hosts.filter((x) => x.live).sort((a, b) => gap(b.el) - gap(a.el))[0];
      // Only give up a scene that is further away than the one asking for room. Two subjects
      // both on screen are both at zero, so neither can evict the other.
      if (!furthest || gap(furthest.el) <= gap(h.el)) break;
      furthest.close();
      furthest.live = false;
      count -= 1;
    }
    h.open();
    h.live = true;
    count += 1;
  }

  idleRun(topUp);
};

// The observers only fire as an element crosses the margin, which is not enough on its own:
// a host retired under pressure never crosses anything again. Re-running the scheduler once
// the scroll settles is what brings those back.
if (typeof window !== "undefined") {
  let settleAll = 0;
  window.addEventListener(
    "scroll",
    () => {
      scrolling = true;
      clearTimeout(settleAll);
      settleAll = window.setTimeout(() => {
        scrolling = false;
        schedule();
      }, 90);
    },
    { passive: true },
  );
}

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
      setState("loading");

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      // Capped at 1.5: a turntable gains nothing from a full retina buffer and costs a lot.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
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
      const env = pmrem.fromScene(sharedRoom(), 0.02);
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
      let spin = 1;
      let rise = 1;
      const fit = () => {
        const vFov = (camera.fov * Math.PI) / 180;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        // Across the frame the silhouette is a circle of the swept radius; up the frame it is
        // just the object's own height. Whichever needs more room decides the distance.
        const reach = Math.max(spin / Math.sin(hFov / 2), rise / Math.sin(vFov / 2)) * MARGIN[name];
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

          // Centre it on the origin, then measure the cylinder it sweeps as it turns rather
          // than the sphere around it. The visitor can only spin it about the upright axis,
          // so the sphere is far too generous for anything tall and thin — it pushed the
          // camera back until a mast or a panel was a sliver in the middle of the frame.
          const box = new THREE.Box3().setFromObject(object);
          const mid = box.getCenter(new THREE.Vector3());
          const half = box.getSize(new THREE.Vector3()).multiplyScalar(0.5);
          const unit = 1 / (Math.max(half.x, half.y, half.z) || 1);
          object.position.sub(mid);
          object.scale.setScalar(unit);
          object.position.multiplyScalar(unit);
          root.add(object);

          // radius it sweeps horizontally, and how far it reaches up and down
          spin = Math.hypot(half.x, half.z) * unit;
          rise = half.y * unit;

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

      teardown = close;
    };

    const shut = () => {
      if (!teardown) return;
      const go = teardown;
      teardown = null;
      go();
    };

    prefetch(asset("/draco/draco_decoder.wasm"));
    prefetch(asset(`/models/${name}.glb`));

    const entry: Host = { el, wanted: false, live: false, open: build, close: shut };
    hosts.push(entry);

    // Wanted a little before the section arrives; the scheduler works out what can be built.
    const near = new IntersectionObserver(
      ([e]) => {
        entry.wanted = e.isIntersecting;
        schedule();
      },
      { rootMargin: "60% 0px" },
    );
    near.observe(el);

    return () => {
      near.disconnect();
      const at = hosts.indexOf(entry);
      if (at >= 0) hosts.splice(at, 1);
      shut();
    };
  }, [name]);

  return (
    <div
      ref={host}
      className={`brew-model is-${state}`}
      /* Height is capped as a share of the window, and the width follows from the object's
         own proportions. Without the cap an upright subject in a wide column grew taller
         than the window itself: too large to read as one object, and a canvas that size is
         also what made turning it stutter. */
      style={{
        aspectRatio: String(FRAME[name]),
        maxWidth: `calc(52vh * ${FRAME[name]})`,
        marginInline: "auto",
      }}
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
