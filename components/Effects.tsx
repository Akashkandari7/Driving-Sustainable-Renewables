"use client";

import { useEffect } from "react";

// Page-wide behaviours: reveal-on-scroll, animated stat counters, and pointer-driven card tilt.
export default function Effects() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const count = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (reduceMotion) {
        el.textContent = target.toLocaleString("en-US");
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1600);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4))).toLocaleString("en-US");
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add("in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
          io.unobserve(el);
        }),
      { threshold: 0.25 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const root = document.documentElement;
    const onPointer = (e: PointerEvent) => {
      root.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      root.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    };
    if (!reduceMotion) window.addEventListener("pointermove", onPointer);

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return null;
}
