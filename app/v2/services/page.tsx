import type { Metadata } from "next";
import Link from "next/link";
import CinemaScene, { type CinemaShot } from "@/components/CinemaScene";
import CineHeading from "@/components/CineHeading";
import { services, servicesIntro } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "Services — Engineering. Quality. Execution. | DSR",
  description: servicesIntro.body,
};

const shots: CinemaShot[] = [
  { plate: "overlook", zoom: 1.06, focus: [0.06, 0], dim: 0.4, move: "push", sun: [0.78, 0.28] },
  { plate: "layout-bonnet", zoom: 1.12, focus: [0.1, 0.02], dim: 0.52, move: "panLeft", sun: [0.8, 0.22] },
  { plate: "crates", zoom: 1.1, focus: [0.08, 0.02], dim: 0.54, move: "panRight", sun: [0.25, 0.14] },
  { plate: "cell-inspect", zoom: 1.14, focus: [0.12, 0], dim: 0.54, move: "tiltUp", sun: [0.35, 0.18] },
  { plate: "construction", zoom: 1.12, focus: [-0.08, 0.02], dim: 0.54, move: "panLeft", sun: [0.18, 0.22] },
  { plate: "switchgear", zoom: 1.12, focus: [0.1, 0.02], dim: 0.54, move: "push", sun: [0.28, 0.2] },
  { plate: "bess-interior", zoom: 1.1, focus: [0.1, 0], dim: 0.54, move: "panRight", sun: [0.6, 0.3] },
  { plate: "meeting", zoom: 1.1, focus: [-0.06, 0], dim: 0.54, move: "tiltUp", sun: [0.3, 0.16] },
  { plate: "tracker-flare", zoom: 1.06, focus: [-0.04, 0], dim: 0.48, move: "pullBack", sun: [0.6, 0.4] },
];

export default function ServicesPage() {
  return (
    <>
      <CinemaScene shots={shots} />

      <main>
        <section data-shot data-label="Overview" className="cine__act cine__act--hero">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{servicesIntro.eyebrow}</p>
            <CineHeading as="h1" text={servicesIntro.title} />
            <p className="cine__lead">{servicesIntro.lead}</p>
            <p className="cine__body">{servicesIntro.body}</p>
            <ol className="cine__index">
              {services.map((s) => (
                <li key={s.num}>
                  <a href={`#service-${s.num}`}>
                    <span className="cine__index-dot" aria-hidden="true" />
                    {s.name}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {services.map((s) => (
          <section key={s.num} id={`service-${s.num}`} data-shot data-label="01 Engineering" className="cine__act cine__act--service">
            <div className="cine__copy reveal">
              <p className="cine__eyebrow">
                <span>Service</span>
              </p>
              <CineHeading text={s.name} />
              <p className="cine__lead">{s.tagline}</p>
              {s.body && <p className="cine__body">{s.body}</p>}
              {s.closing && <p className="cine__note">{s.closing}</p>}
            </div>
            <div className="cine__groups reveal">
              {s.groups.map((g) => (
                <div key={g.name ?? "items"} className="cine__group">
                  {g.name && <h3>{g.name}</h3>}
                  <ul>
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section data-shot data-label="02 Procurement" className="cine__act cine__act--cta">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">Next step</p>
            <CineHeading text="Which stage are you at?" />
            <p className="cine__lead">
              Planning, procurement, manufacturing, construction or commissioning — tell us where the project stands and
              we&apos;ll scope the technical support around it.
            </p>
            <div className="cine__actions">
              <Link href="/v2/contact" className="cine__btn">
                Discuss Your Project <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
