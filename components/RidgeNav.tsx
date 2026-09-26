"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/v3", label: "Home" },
  { href: "/v3/about", label: "About" },
  { href: "/v3/services", label: "Services" },
  { href: "/v3/contact", label: "Contact" },
];

/** Floating pill navigation that sits inside the hero card, Ridgeline-style. */
export default function RidgeNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className={`ridge-nav${open ? " is-open" : ""}`} aria-label="Main">
      <Link href="/v3" className="ridge-nav__badge" aria-label="DSR home" onClick={() => setOpen(false)}>
        <img src="/images/logo-light.png" alt="DSR" width={619} height={197} />
      </Link>

      <div className="ridge-nav__pill">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={path === l.href ? "is-active" : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <Link href="/v3/contact" className="ridge-nav__cta" onClick={() => setOpen(false)}>
        Discuss your project <span aria-hidden="true">↗</span>
      </Link>

      <button className="ridge-nav__burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
        <span />
        <span />
      </button>
    </nav>
  );
}
