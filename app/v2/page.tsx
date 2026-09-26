import type { Metadata } from "next";
import Link from "next/link";
import CinemaScene, { type CinemaShot } from "@/components/CinemaScene";
import CineHeading from "@/components/CineHeading";
import { IMAGES, home } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "DSR — Building Tomorrow's Trust. With Engineering Intelligence.",
  description: home.hero.lead,
};

// One plate per act; the same three photographs, framed differently so the scroll reads as a camera move.
const shots: CinemaShot[] = [
  { src: IMAGES.sunset, zoom: 1.04, focus: [0, 0], dim: 0.34, move: "push", sun: [0.86, 0.34] },
  { src: IMAGES.blueprint, zoom: 1.14, focus: [0.1, 0.02], dim: 0.46, move: "panLeft", sun: [0.12, 0.2] },
  { src: IMAGES.bess, zoom: 1.18, focus: [0.12, 0], dim: 0.44, move: "panRight", sun: [0.93, 0.42] },
  { src: IMAGES.sunset, zoom: 1.32, focus: [0.16, -0.04], dim: 0.5, move: "tiltUp", sun: [0.8, 0.3] },
  { src: IMAGES.blueprint, zoom: 1.4, focus: [-0.12, 0.04], dim: 0.5, move: "push", sun: [0.1, 0.18] },
  { src: IMAGES.bess, zoom: 1.46, focus: [0.18, -0.04], dim: 0.52, move: "panLeft", sun: [0.9, 0.4] },
  { src: IMAGES.sunset, zoom: 1.12, focus: [-0.04, 0], dim: 0.5, move: "pullBack", sun: [0.84, 0.36] },
];

export default function Home() {
  const { hero, promise, whatWeDo, approach, why, sectors } = home;

  return (
    <>
      <CinemaScene shots={shots} />

      <main>
        <section data-shot data-label="Site" className="cine__act cine__act--hero">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{hero.eyebrow}</p>
            <CineHeading as="h1" text={hero.title[0]} accent={hero.title[1]} />
            <p className="cine__lead">{hero.lead}</p>
            <p className="cine__body">{hero.body}</p>
            <div className="cine__actions">
              {hero.actions.map((a) => (
                <Link key={a.href} href={a.href} className={`cine__btn${a.primary ? "" : " cine__btn--ghost"}`}>
                  {a.label}
                  {a.primary && <span aria-hidden="true">→</span>}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section data-shot data-label="The Promise" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{promise.eyebrow}</p>
            <CineHeading text={promise.title} />
            {promise.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
          <ol className="cine__stages reveal">
            {promise.stages.map((s, i) => (
              <li key={s.key}>
                <span className="cine__stage-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.key}</h3>
                <p>{s.line}</p>
              </li>
            ))}
          </ol>
        </section>

        <section data-shot data-label="What We Do" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{whatWeDo.eyebrow}</p>
            <CineHeading text={whatWeDo.title} />
          </div>
          <div className="cine__grid cine__grid--2 reveal">
            {whatWeDo.items.map((s) => (
              <article key={s.name} className="cine__card">
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                <p className="cine__flow">
                  {s.flow.map((f, i) => (
                    <span key={f}>
                      {f}
                      {i < s.flow.length - 1 && <i aria-hidden="true">→</i>}
                    </span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section data-shot data-label="Approach" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{approach.eyebrow}</p>
            <CineHeading text={approach.title} />
            {approach.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
          <div className="cine__grid cine__grid--3 reveal">
            {approach.questions.map((q) => (
              <article key={q.q} className="cine__card cine__card--q">
                <h3>{q.q}</h3>
                <p>{q.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-shot data-label="Why DSR" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{why.eyebrow}</p>
            <CineHeading text={why.title} />
            {why.body.map((p) => (
              <p key={p} className="cine__body">
                {p}
              </p>
            ))}
          </div>
          <dl className="cine__pillars reveal">
            {why.pillars.map((p) => (
              <div key={p.name}>
                <dt>{p.name}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section data-shot data-label="Sectors" className="cine__act">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">{sectors.eyebrow}</p>
            <CineHeading text={sectors.title} />
          </div>
          <div className="cine__grid cine__grid--3 reveal">
            {sectors.items.map((s) => (
              <article key={s.name} className="cine__card cine__card--sector">
                <h3>{s.name}</h3>
                <p className="cine__tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section data-shot data-label="Work With Us" className="cine__act cine__act--cta">
          <div className="cine__copy reveal">
            <p className="cine__eyebrow">Work with DSR</p>
            <CineHeading text="Let's talk about your project." />
            <p className="cine__lead">
              Tell us where you are in the project lifecycle — planning, procurement, manufacturing, construction or
              commissioning — and we&apos;ll show you how DSR can support it.
            </p>
            <div className="cine__actions">
              <Link href="/v2/contact" className="cine__btn">
                Discuss Your Project <span aria-hidden="true">→</span>
              </Link>
              <Link href="/v2/services" className="cine__btn cine__btn--ghost">
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
