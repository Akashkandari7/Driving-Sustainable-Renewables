"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ElementType } from "react";

/**
 * Headings rise out of a mask, word by word, once the act comes into view — the type feels directed
 * rather than simply faded in. Each word sits in its own overflow-hidden box so wrapping stays clean.
 */
export default function CineHeading({
  as: Tag = "h2",
  text,
  accent,
  className = "",
}: {
  as?: ElementType;
  text: string;
  /** optional second line, rendered in the accent colour */
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const path = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }

    el.classList.remove("in");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }),
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [path, text, accent]);

  let i = 0;
  const line = (value: string, isAccent: boolean) =>
    value.split(" ").map((word) => {
      const delay = `${(i++ * 0.055).toFixed(3)}s`;
      return (
        <span className="cine-word" key={`${word}-${delay}`}>
          <span style={{ transitionDelay: delay }} className={isAccent ? "is-accent" : undefined}>
            {word}
          </span>
        </span>
      );
    });

  return (
    <Tag ref={ref} className={`cine-head ${className}`.trim()}>
      {line(text, false)}
      {accent && (
        <>
          <br />
          {line(accent, true)}
        </>
      )}
    </Tag>
  );
}
