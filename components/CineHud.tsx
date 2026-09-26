"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Scene index down the right edge plus a progress line at the foot of the frame — the page reads as
 * a reel of shots rather than a stack of sections. Labels come from each act's data-label.
 */
export default function CineHud() {
  const path = usePathname();
  const [scenes, setScenes] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const acts = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"));
    setScenes(acts.map((el, i) => el.dataset.label || String(i + 1).padStart(2, "0")));
    setActive(0);

    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let current = 0;
      acts.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) current = i;
      });
      setActive(current);
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  if (scenes.length < 2) return null;

  return (
    <>
      <div className="cine__hud" aria-hidden="true">
        <span className="cine__hud-count">
          {String(active + 1).padStart(2, "0")} <i>/</i> {String(scenes.length).padStart(2, "0")}
        </span>
        <ul>
          {scenes.map((label, i) => (
            <li key={`${label}-${i}`} className={i === active ? "is-active" : undefined}>
              <span className="cine__hud-tick" />
              <span className="cine__hud-label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="cine__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress.toFixed(4)})` }} />
      </div>
    </>
  );
}
