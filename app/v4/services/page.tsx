import type { Metadata } from "next";
import Link from "next/link";
import BrewNav from "@/components/BrewNav";
import BrewReveal from "@/components/BrewReveal";
import { asset } from "@/lib/asset";
import { services, servicesIntro } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Services — Engineering. Quality. Execution. | DSR",
  description: servicesIntro.body,
};

const PLATES = [
  "/images/dusk/dusk-layout-bonnet-w.jpg",
  "/images/dusk/dusk-crates-w.jpg",
  "/images/dusk/dusk-cell-inspect-w.jpg",
  "/images/dusk/dusk-construction-w.jpg",
  "/images/dusk/dusk-switchgear-w.jpg",
  "/images/dusk/dusk-bess-interior-w.jpg",
  "/images/dusk/dusk-meeting-w.jpg",
];

export default function BrewServices() {
  return (
    <>
      <BrewNav />
      <BrewReveal />

      <main>
        <section className="brew-top reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <p className="brew-eyebrow">// {servicesIntro.eyebrow}</p>
          <h1 className="brew-head">
            Engineering. Quality.
            <br />
            <em>Execution</em>
          </h1>
          <p className="brew-top__lead">{servicesIntro.body}</p>
        </section>

        {services.map((s, i) => (
          <section key={s.num} className="brew-service reveal">
            <div className="brew-service__head">
              <p className="brew-eyebrow">// Service</p>
              <h2 className="brew-head">{s.name}</h2>
              <p className="brew-service__tag">{s.tagline}</p>
              {s.body && <p className="brew-service__body">{s.body}</p>}
              {s.closing && <p className="brew-service__note">{s.closing}</p>}
              <figure>
                <img src={asset(PLATES[i % PLATES.length])} alt="" />
              </figure>
            </div>
            <div className="brew-service__groups">
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

        <section className="brew-cta reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <h2 className="brew-head">
            Which stage are
            <br />
            you <em>at?</em>
          </h2>
          <Link href="/v4/contact" className="brew-btn">
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
