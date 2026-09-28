"use client";

import { useEffect, useState } from "react";
import ParticleScene from "@/components/ParticleScene";
import type { Mode } from "@/components/CineMode";

/* The particle field, running on the cinematic home page.

   These pages carry their own dusk and dawn rather than the site-wide light and dark switch,
   so the mode is read here and handed down. It has to be: dusk puts a glowing field on a night
   sky, while dawn turns the sky to daylight and the field to deeper inks that read against it.
   Sending the wrong one leaves the particles invisible. */
export default function CineParticles() {
  const [mode, setMode] = useState<Mode>("dawn");

  useEffect(() => {
    const read = () => {
      const host = document.querySelector<HTMLElement>(".cine");
      setMode(host?.dataset.mode === "dusk" ? "dusk" : "dawn");
    };
    read();
    const onMode = (e: Event) => setMode((e as CustomEvent<Mode>).detail);
    window.addEventListener("cinemode", onMode);
    return () => window.removeEventListener("cinemode", onMode);
  }, []);

  return (
    <ParticleScene
      selector="[data-shot]"
      /* One per figure, in the order they are stepped through: sun, panel, battery, bolt,
         network, globe. The battery sits on the left and its section moves its copy across,
         so the page is not a single column with a figure always to one side of it. */
      sides={["right", "right", "left", "right", "right", "right"]}
      theme={mode === "dusk" ? "dark" : "light"}
    />
  );
}
