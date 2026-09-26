"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Momentum scrolling. The camera work reads as film only if the scroll itself glides, so wheel input
 * is eased into position instead of jumping. Touch keeps the platform's own inertia, and anyone who
 * asks for reduced motion gets plain native scrolling.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
    });

    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // in-page anchors (the services index) should glide too
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const target = document.querySelector(link.getAttribute("href") || "");
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -40 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
