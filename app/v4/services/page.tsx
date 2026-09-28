import type { Metadata } from "next";
import Link from "next/link";
import BrewNav from "@/components/BrewNav";
import BrewReveal from "@/components/BrewReveal";
import BrewSubject, { SERVICE_SUBJECTS } from "@/components/BrewSubject";
import BrewModel, { type ModelName } from "@/components/BrewModel";

/* One object per service, in the order the services are listed. */
const SERVICE_MODELS: ModelName[] = [
  "transformer",
  "crate",
  "wafer",
  "tracker",
  "inverter",
  "container",
  "report",
];
import { services, servicesIntro } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Services — Engineering. Quality. Execution. | DSR",
  description: servicesIntro.body,
};


export default function BrewServices() {
  return (
    <>
      <BrewNav />
      <BrewReveal />

      <main>
        <section className="brew-top brew-top--withobject reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <div>
            <p className="brew-eyebrow">// {servicesIntro.eyebrow}</p>
            <h1 className="brew-head">
              Engineering. Quality.
              <br />
              <em>Execution</em>
            </h1>
            <p className="brew-top__lead">{servicesIntro.body}</p>
          </div>
          <figure className="is-subject brew-top__object">
            <BrewModel name="tester" label="Electrical test instruments">
              <BrewSubject name="dashboard" label="" />
            </BrewModel>
          </figure>
        </section>

        {services.map((s, i) => (
          <section key={s.num} className="brew-service reveal">
            <div className="brew-service__head">
              <p className="brew-eyebrow">// Service</p>
              <h2 className="brew-head">{s.name}</h2>
              <p className="brew-service__tag">{s.tagline}</p>
              {s.body && <p className="brew-service__body">{s.body}</p>}
              {s.closing && <p className="brew-service__note">{s.closing}</p>}
              <figure className="is-subject">
                <BrewModel name={SERVICE_MODELS[i % SERVICE_MODELS.length]} label={s.name}>
                  <BrewSubject name={SERVICE_SUBJECTS[i % SERVICE_SUBJECTS.length]} label="" />
                </BrewModel>
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
