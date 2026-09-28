"use client";

import { useEffect, useState } from "react";
import ParticleScene from "@/components/ParticleScene";
import type { Mode } from "@/components/CineMode";
import { FORMS } from "@/lib/era";

/* The field on the cinematic home page.

   Every form is the same sheet of panels bent a different way — a ring to open on, the drum you
   pass through, rows running to the horizon, a ripple, and a spiral to end on. The ring is
   hollow, so the copy sits in the dark middle of it. */

/* Blue on one hand, solar orange on the other, warming as the journey goes on. */
const NIGHT: [string, string][] = [
  ["#2a6ff5", "#ff6a1f"],
  ["#3b82f6", "#ffa62b"],
  ["#2563eb", "#ff7a18"],
  ["#1d4ed8", "#ff8c2b"],
  ["#4338ca", "#ff5e1a"],
  ["#4338ca", "#ff5e1a"],
];

/* The same journey under daylight, in inks deep enough to read on a pale sky. */
const DAY: [string, string][] = [
  ["#1e40af", "#c2410c"],
  ["#1d4ed8", "#b45309"],
  ["#1e3a8a", "#c2410c"],
  ["#172554", "#9a3412"],
  ["#312e81", "#b91c1c"],
  ["#312e81", "#b91c1c"],
];

export default function CineParticles() {
  const [mode, setMode] = useState<Mode>("dusk");

  useEffect(() => {
    const read = () => {
      const host = document.querySelector<HTMLElement>(".cine");
      setMode(host?.dataset.mode === "dawn" ? "dawn" : "dusk");
    };
    read();
    const onMode = (e: Event) => setMode((e as CustomEvent<Mode>).detail);
    window.addEventListener("cinemode", onMode);
    return () => window.removeEventListener("cinemode", onMode);
  }, []);

  const dusk = mode === "dusk";

  return (
    <ParticleScene
      selector="[data-shot]"
      figures={FORMS}
      palette={dusk ? NIGHT : DAY}
      spread
      /* Centred, because the page now stands inside the body rather than beside it. */
      field="centre"
      theme={dusk ? "dark" : "light"}
    />
  );
}
