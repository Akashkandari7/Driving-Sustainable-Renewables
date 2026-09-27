import Link from "next/link";
import { contact } from "@/lib/dsr";
import "./ridge.css";
import { asset } from "@/lib/asset";

/** The light page frame: a utility strip across the top, everything else inside rounded cards. */
export default function RidgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ridge">
      <div className="ridge__strip">
        <p>
          <span>Gurugram, IN</span>
          <i>\</i>
          <span>Solar &amp; Energy Storage</span>
          <i>\</i>
          <span className="ridge__status">
            <b aria-hidden="true" /> Independent technical advisory
          </span>
        </p>
        <p>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <i>\</i>
          <span>Mon–Sat</span>
        </p>
      </div>

      {children}

      <footer className="ridge__foot">
        <div>
          <img src={asset("/images/logo-light.png")} alt="DSR" width={619} height={197} />
          <p>Independent Quality, Engineering &amp; Advisory Solutions for Solar and Energy Storage.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/v3">Home</Link>
          <Link href="/v3/about">About Us</Link>
          <Link href="/v3/services">Services</Link>
          <Link href="/v3/contact">Contact Us</Link>
        </nav>
        <div className="ridge__foot-contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <p>{contact.address}</p>
          <p className="ridge__copy">© {new Date().getFullYear()} DSR — Driving Sustainable Renewables</p>
        </div>
      </footer>
    </div>
  );
}
