"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Reveal-on-scroll for the Ridgeline pages, rebuilt per route. */
export default function RidgeReveal() {
  const path = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".ridge .reveal"));
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
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    targets.forEach((el) => {
      el.classList.remove("in");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);

  return null;
}
