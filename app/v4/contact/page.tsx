import type { Metadata } from "next";
import BrewNav from "@/components/BrewNav";
import BrewReveal from "@/components/BrewReveal";
import ContactForm from "@/components/ContactForm";
import { contact } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Contact DSR — Discuss Your Project",
  description: "Tell us where you are in the project lifecycle.",
};

export default function BrewContact() {
  return (
    <>
      <BrewNav />
      <BrewReveal />

      <main>
        <section className="brew-contact reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <div>
            <p className="brew-eyebrow">// Contact</p>
            <h1 className="brew-head">
              Discuss your
              <br />
              <em>project</em>
            </h1>
            <p className="brew-top__lead">
              Tell us where you are in the project lifecycle — planning, procurement, manufacturing, construction or
              commissioning.
            </p>
            <dl className="brew-contact__details">
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
              <div>
                <dt>Hours</dt>
                <dd>Mon–Sat</dd>
              </div>
            </dl>
          </div>
          <div className="brew-contact__form">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
