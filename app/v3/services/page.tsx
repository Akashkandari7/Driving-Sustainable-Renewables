import type { Metadata } from "next";
import Link from "next/link";
import RidgeNav from "@/components/RidgeNav";
import RidgeReveal from "@/components/RidgeReveal";
import { IMAGES, services, servicesIntro } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Services — Engineering. Quality. Execution. | DSR",
  description: servicesIntro.body,
};

const PLATES = [IMAGES.panels, IMAGES.blueprint, IMAGES.bess, IMAGES.rooftop, IMAGES.inspection, IMAGES.reservoir, IMAGES.hybrid];

export default function RidgeServices() {
  return (
    <>
      <section className="ridge__stage">
        <RidgeNav />
        <header className="ridge-top">
          <img src={IMAGES.panels} alt="Module rows catching the sun" />
          <div className="ridge-top__copy">
            <p className="ridge-label">{servicesIntro.eyebrow}</p>
            <h1>{servicesIntro.title}</h1>
            <p className="ridge-top__lead">{servicesIntro.lead}</p>
          </div>
        </header>
      </section>

      <RidgeReveal />

      <main className="ridge__main">
        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">The list</p>
            <h2>Seven services across the project lifecycle.</h2>
          </header>
          <div className="ridge-block__body">
            <p>{servicesIntro.body}</p>
          </div>
          <ol className="ridge-index">
            {services.map((s) => (
              <li key={s.num}>
                <a href={`#service-${s.num}`}>
                  <span>{s.num}</span>
                  <strong>{s.name}</strong>
                  <em>{s.tagline}</em>
                </a>
              </li>
            ))}
          </ol>
        </section>

        {services.map((s, i) => (
          <section key={s.num} id={`service-${s.num}`} className="ridge-service reveal">
            <div className="ridge-service__intro">
              <p className="ridge-label">Service {s.num}</p>
              <h2>{s.name}</h2>
              <p className="ridge-service__tag">{s.tagline}</p>
              {s.body && <p className="ridge-service__body">{s.body}</p>}
              {s.closing && <p className="ridge-service__note">{s.closing}</p>}
              <img src={PLATES[i % PLATES.length]} alt="" className="ridge-service__plate" />
            </div>
            <div className="ridge-service__groups">
              {s.groups.map((g) => (
                <div key={g.name ?? "items"}>
                  {g.name && <h3>{g.name}</h3>}
                  <ul>
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="ridge-cta reveal">
          <div>
            <p className="ridge-label">Next step</p>
            <h2>Which stage are you at?</h2>
          </div>
          <Link href="/v3/contact" className="ridge-cta__btn">
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
