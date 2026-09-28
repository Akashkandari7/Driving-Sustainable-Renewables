"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type Mode = "dusk" | "dawn";
const KEY = "dsr-cine-mode";

/**
 * Dusk or dawn. The plates are graded warmer and brighter in dawn and the chrome turns light,
 * so the same photography reads as morning rather than golden hour.
 */
export default function CineMode() {
  const path = usePathname();
  // The home page stands on its particle field at night and is not offered the switch.
  const locked = path === "/v2" || path === "/v2/";
  const [mode, setMode] = useState<Mode>("dawn");

  useEffect(() => {
    const host = document.querySelector<HTMLElement>(".cine");
    if (locked) {
      if (host) host.dataset.mode = "dusk";
      setMode("dusk");
      window.dispatchEvent(new CustomEvent<Mode>("cinemode", { detail: "dusk" }));
      return;
    }
    let saved: Mode = host?.dataset.mode === "dusk" ? "dusk" : "dawn";
    try {
      const v = localStorage.getItem(KEY);
      if (v === "dawn" || v === "dusk") saved = v;
    } catch {
      // blocked storage: stay with whatever the markup set
    }
    apply(saved);
    setMode(saved);
  }, [locked]);

  const apply = (next: Mode) => {
    const host = document.querySelector<HTMLElement>(".cine");
    if (host) host.dataset.mode = next;
    window.dispatchEvent(new CustomEvent<Mode>("cinemode", { detail: next }));
  };

  const toggle = () => {
    const next: Mode = mode === "dusk" ? "dawn" : "dusk";
    setMode(next);
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // nothing to persist to; the choice still applies for this visit
    }
  };

  if (locked) return null;

  return (
    <button className="cine__mode" onClick={toggle} aria-label={mode === "dusk" ? "Switch to daylight" : "Switch to dusk"}>
      <span className="cine__mode-dot" aria-hidden="true" />
      {mode === "dusk" ? "Dusk" : "Dawn"}
    </button>
  );
}
