import Link from "next/link";
import CineNav from "@/components/CineNav";
import CineReveal from "@/components/CineReveal";
import SmoothScroll from "@/components/SmoothScroll";
import CineHud from "@/components/CineHud";
import { contact, nav } from "@/lib/dsr";
import "./cinema.css";

export default function CinemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cine">
      <CineNav />
      <SmoothScroll />
      <CineReveal />
      <CineHud />
      <div className="cine__bars" aria-hidden="true" />
      {children}
      <footer className="cine__foot">
        <div>
          <img src="/images/logo-dark.png" alt="DSR" width={619} height={197} className="cine__foot-logo" />
          <p>Independent Quality, Engineering &amp; Advisory Solutions for Solar and Energy Storage.</p>
        </div>
        <nav aria-label="Footer">
          {nav.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <p>{contact.address}</p>
          <p className="cine__copyright">© {new Date().getFullYear()} DSR — Driving Sustainable Renewables</p>
        </div>
      </footer>
    </div>
  );
}
