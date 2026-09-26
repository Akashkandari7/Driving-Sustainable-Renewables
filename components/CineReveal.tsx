"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveal-on-scroll for the cinematic pages. Keyed to the pathname: client-side navigation swaps the
 * page without remounting the layout, so the observer has to be rebuilt for each route's elements —
 * otherwise a newly navigated page keeps its copy at opacity 0.
 */
export default function CineReveal() {
  const path = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".cine .reveal"));
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((el) => {
      el.classList.remove("in");
      io.observe(el);
    });

    return () => io.disconnect();
  }, [path]);

  return null;
}
