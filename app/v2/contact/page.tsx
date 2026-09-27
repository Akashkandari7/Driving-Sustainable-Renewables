import type { Metadata } from "next";
import CinemaScene, { type CinemaShot } from "@/components/CinemaScene";
import CineHeading from "@/components/CineHeading";
import ContactForm from "@/components/ContactForm";
import { contact } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Contact DSR — Discuss Your Project",
  description: "Tell us about your project — planning, procurement, manufacturing, construction or commissioning.",
};

const shots: CinemaShot[] = [
  { plate: "reception", zoom: 1.1, focus: [0.08, 0.02], dim: 0.56, move: "pullBack", sun: [0.24, 0.16] },
];

export default function ContactPage() {
  return (
    <>
      <CinemaScene shots={shots} />

      <main>
        <section data-shot data-label="Contact" className="cine__act cine__act--contact">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">Contact Us</p>
            <CineHeading as="h1" text="Discuss Your Project." />
            <p className="cine__lead">
              Tell us where you are in the project lifecycle — planning, procurement, manufacturing, construction or
              commissioning.
            </p>
            <dl className="cine__contact">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Office</dt>
                <dd>{contact.address}</dd>
              </div>
            </dl>
          </div>
          <div className="cine__panel reveal">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
