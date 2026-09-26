"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/lib/dsr";

export default function CineNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const close = () => setOpen(false);

  // The bar turns solid as soon as content starts passing behind it.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`cine__bar${open ? " is-open" : ""}${solid ? " is-solid" : ""}`}>
      <Link href="/v2" className="cine__logo" onClick={close} aria-label="DSR — Driving Sustainable Renewables, home">
        <img src="/images/logo-dark.png" alt="DSR" width={619} height={197} />
        <span>Driving Sustainable Renewables</span>
      </Link>

      <nav className="cine__nav" aria-label="Main">
        {nav.map((l) => (
          <Link key={l.href} href={l.href} onClick={close} aria-current={path === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>

      <Link href="/v2/contact" className="cine__cta" onClick={close}>
        Discuss Your Project <span aria-hidden="true">→</span>
      </Link>

      <button
        className="cine__burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
