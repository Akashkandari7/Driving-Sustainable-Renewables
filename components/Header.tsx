"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#quality-assurance", label: "Services" },
  { href: "#energy-storage", label: "Storage" },
  { href: "#digital-intelligence", label: "Intelligence" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`header${open ? " header--open" : ""}`}>
      <div className="header__bar glass">
        <a href="#home" className="logo" onClick={close} aria-label="DSR — Driving Sustainable Renewables, home">
          {/* Which variant shows is decided in CSS from html[data-theme], so it matches the server HTML */}
          <img className="logo__img logo__img--light" src="/images/logo-light.png" alt="DSR" width={619} height={197} />
          <img className="logo__img logo__img--dark" src="/images/logo-dark.png" alt="" aria-hidden="true" width={619} height={197} />
          <span className="logo__tag">Driving Sustainable Renewables</span>
        </a>
        <nav className="header__nav" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
        <a href="#contact" className="btn btn--primary header__cta" onClick={close}>
          Discuss a Project
        </a>
        <button
          className="icon-btn header__toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
