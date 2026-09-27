import type { Metadata } from "next";
import CinemaScene, { type CinemaShot } from "@/components/CinemaScene";
import CineHeading from "@/components/CineHeading";
import { about } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "About DSR — Built for the Next Generation of Renewable Energy",
  description: about.hero.body[0],
};

const shots: CinemaShot[] = [
  { plate: "office", zoom: 1.06, focus: [0.06, 0.02], dim: 0.44, move: "push", sun: [0.2, 0.15] },
  { plate: "corridor", zoom: 1.12, focus: [0.06, 0], dim: 0.48, move: "panRight", sun: [0.5, 0.3] },
  { plate: "reservoir", zoom: 1.1, focus: [0.08, 0], dim: 0.46, move: "tiltUp", sun: [0.88, 0.25] },
  { plate: "rooftop-laptop", zoom: 1.12, focus: [-0.08, 0.02], dim: 0.5, move: "panLeft", sun: [0.75, 0.2] },
  { plate: "container-check", zoom: 1.1, focus: [0.1, 0.02], dim: 0.5, move: "push", sun: [0.62, 0.3] },
  { plate: "factory-line", zoom: 1.08, focus: [0.04, 0], dim: 0.5, move: "pullBack", sun: [0.3, 0.12] },
];

export default function AboutPage() {
  const { hero, purpose, vision, mission, values, experience } = about;

  return (
    <>
      <CinemaScene shots={shots} />

      <main>
        <section data-shot data-label="About" className="cine__act cine__act--hero">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{hero.eyebrow}</p>
            <CineHeading as="h1" text={hero.title} />
            {hero.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
            <p className="cine__note">{hero.note}</p>
          </div>
        </section>

        <section data-shot data-label="Purpose" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{purpose.eyebrow}</p>
            <CineHeading text={purpose.title} />
            {purpose.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
            <ol className="cine__chain">
              {purpose.chain.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            {purpose.after.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section data-shot data-label="Vision" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{vision.eyebrow}</p>
            <CineHeading text={vision.title} />
            {vision.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
          <ul className="cine__ticks reveal">
            {vision.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <section data-shot data-label="Mission" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{mission.eyebrow}</p>
            <CineHeading text={mission.title} />
            {mission.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
          <div className="cine__grid cine__grid--4 reveal">
            {mission.items.map((m) => (
              <article key={m.name} className="cine__card">
                <h3>{m.name}</h3>
                <p>{m.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-shot data-label="Values" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{values.eyebrow}</p>
            <CineHeading text={values.title} />
          </div>
          <dl className="cine__pillars cine__pillars--2 reveal">
            {values.items.map((v) => (
              <div key={v.name}>
                <dt>{v.name}</dt>
                <dd>{v.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section data-shot data-label="Experience" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{experience.eyebrow}</p>
            <CineHeading text={experience.title} />
            {experience.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
          <div className="cine__grid cine__grid--3 reveal">
            {experience.items.map((e) => (
              <article key={e.name} className="cine__card cine__card--sector">
                <h3>{e.name}</h3>
                <p>{e.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
