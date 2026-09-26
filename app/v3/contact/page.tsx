import type { Metadata } from "next";
import RidgeNav from "@/components/RidgeNav";
import RidgeReveal from "@/components/RidgeReveal";
import ContactForm from "@/components/ContactForm";
import { IMAGES, contact } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Contact DSR — Discuss Your Project",
  description: "Tell us about your project — planning, procurement, manufacturing, construction or commissioning.",
};

export default function RidgeContact() {
  return (
    <>
      <section className="ridge__stage">
        <RidgeNav />
        <header className="ridge-top ridge-top--short">
          <img src={IMAGES.office} alt="The DSR office floor" />
          <div className="ridge-top__copy">
            <p className="ridge-label">04 — Contact Us</p>
            <h1>Discuss Your Project.</h1>
          </div>
        </header>
      </section>

      <RidgeReveal />

      <main className="ridge__main">
        <section className="ridge-contact reveal">
          <div className="ridge-contact__copy">
            <p className="ridge-label">Where to find us</p>
            <h2>
              Tell us where you are in the project lifecycle — planning, procurement, manufacturing, construction or
              commissioning.
            </h2>
            <dl>
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
          <div className="ridge-contact__form">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}
