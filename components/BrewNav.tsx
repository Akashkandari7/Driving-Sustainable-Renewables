"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { asset } from "@/lib/asset";

const links = [
  { href: "/v4", label: "Home" },
  { href: "/v4/services", label: "Services" },
  { href: "/v4/about", label: "About" },
  { href: "/v4/contact", label: "Contact" },
];

/** Plain words at the edges, the wordmark held in the middle. */
export default function BrewNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  // The bar turns solid as soon as anything starts passing behind it.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`brew-nav${open ? " is-open" : ""}${solid ? " is-solid" : ""}`}>
      <nav aria-label="Main">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
      </nav>

      <Link href="/v4" className="brew-nav__mark" aria-label="DSR, home">
        <img src={asset("/images/logo-dark.png")} alt="DSR" width={619} height={197} />
      </Link>

      <p className="brew-nav__meta">
        <span>Gurugram, IN</span>
        <i aria-hidden="true">/</i>
        <span>Solar &amp; Storage</span>
      </p>

      <button className="brew-nav__burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
        <span />
        <span />
      </button>
    </header>
  );
}
