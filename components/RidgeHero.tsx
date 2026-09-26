"use client";

import { useEffect, useRef, useState } from "react";

export type RidgeShot = { src: string; caption: string; sub: string };

/**
 * The hero plate: a rounded dark card that cycles through site photography, with the headline
 * filling from grey to white as the page scrolls, and a shot counter plus preview card in the
 * bottom corner — the Ridgeline pattern, carrying DSR's own material.
 */
export default function RidgeHero({
  shots,
  lead,
  chips,
  headline,
}: {
  shots: RidgeShot[];
  lead: string;
  chips: string[];
  headline: string[];
}) {
  const [index, setIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // the plates advance on their own; the counter and preview follow
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % shots.length), 6000);
    return () => clearInterval(id);
  }, [shots.length]);

  // headline fill: 0 while the hero is at rest, 1 once it has scrolled away
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / (window.innerHeight * 0.75)));
      el.style.setProperty("--fill", t.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const next = shots[(index + 1) % shots.length];

  return (
    <div className="ridge-hero" ref={cardRef}>
      <div className="ridge-hero__plates" aria-hidden="true">
        {shots.map((s, i) => (
          <img key={s.src} src={s.src} alt="" style={{ opacity: i === index ? 1 : 0 }} loading={i ? "lazy" : "eager"} />
        ))}
      </div>

      <div className="ridge-hero__body">
        <h1 className="ridge-hero__title">
          {headline.map((word, i) => (
            <span key={`${word}-${i}`} style={{ "--i": i, "--n": headline.length } as React.CSSProperties}>
              {word}{" "}
            </span>
          ))}
        </h1>
        <p className="ridge-hero__lead">{lead}</p>
      </div>

      <ul className="ridge-hero__chips">
        {chips.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <div className="ridge-hero__counter">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <i>
          <b style={{ transform: `scaleX(${(index + 1) / shots.length})` }} />
        </i>
        <span>{String(shots.length).padStart(2, "0")}</span>
      </div>

      <button
        className="ridge-hero__preview"
        onClick={() => setIndex((i) => (i + 1) % shots.length)}
        aria-label={`Next view: ${next.caption}`}
      >
        <img src={next.src} alt="" />
        <span>
          <strong>{next.caption}</strong>
          <em>{next.sub}</em>
        </span>
      </button>
    </div>
  );
}
