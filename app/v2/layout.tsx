import Link from "next/link";
import CineNav from "@/components/CineNav";
import CineReveal from "@/components/CineReveal";
import CineMode from "@/components/CineMode";
import SmoothScroll from "@/components/SmoothScroll";
import { contact, nav } from "@/lib/dsr";
import "./cinema.css";
import { asset } from "@/lib/asset";

export default function CinemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cine" data-mode="dawn">
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){var e=document.currentScript&&document.currentScript.parentElement;if(!e)return;"+
            /* the home page is always night, whatever was chosen elsewhere */
            "var p=location.pathname.replace(/\/+$/,'');if(/\/v2$/.test(p)||p===''){e.dataset.mode='dusk';return;}"+
            "try{var m=localStorage.getItem('dsr-cine-mode');if(m==='dusk'||m==='dawn'){e.dataset.mode=m;}}catch(e2){}})();",
        }}
      />
      <CineNav />
      <CineMode />
      <SmoothScroll />
      <CineReveal />
      <div className="cine__bars" aria-hidden="true" />
      {children}
      <footer className="cine__foot">
        <div>
          <img src={asset("/images/logo-dark.png")} alt="DSR" width={619} height={197} className="cine__foot-logo cine__logo-dusk" />
          <img src={asset("/images/logo-light.png")} alt="" aria-hidden="true" width={619} height={197} className="cine__foot-logo cine__logo-dawn" />
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
