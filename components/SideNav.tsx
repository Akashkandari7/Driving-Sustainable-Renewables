"use client";

import { useEffect, useState } from "react";
import { scenes } from "@/lib/content";

export default function SideNav() {
  const [active, setActive] = useState(scenes[0].id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px" },
    );
    scenes.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="sidenav" aria-label="Sections">
      {scenes.map((s, i) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? "is-active" : ""} aria-current={active === s.id}>
          <span className="sidenav__label">{s.nav}</span>
          <span className="sidenav__num">{String(i + 1).padStart(2, "0")}</span>
        </a>
      ))}
    </nav>
  );
}
