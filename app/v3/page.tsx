import type { Metadata } from "next";
import Link from "next/link";
import RidgeNav from "@/components/RidgeNav";
import RidgeHero, { type RidgeShot } from "@/components/RidgeHero";
import RidgeReveal from "@/components/RidgeReveal";
import { IMAGES, home } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "DSR — Building Tomorrow's Trust. With Engineering Intelligence.",
  description: home.hero.lead,
};

const heroShots: RidgeShot[] = [
  { src: IMAGES.hybrid, caption: "Hybrid site, commissioning support", sub: "Solar · wind · storage — day 2" },
  { src: IMAGES.rooftop, caption: "Module installation, rooftop C&I", sub: "Installation monitoring" },
  { src: IMAGES.bess, caption: "Containerised BESS, pre-shipment", sub: "Factory acceptance witnessed" },
];

export default function RidgeHome() {
  const { hero, promise, whatWeDo, approach, why, sectors } = home;

  return (
    <>
      <section className="ridge__stage">
        <RidgeNav />
        <RidgeHero
          shots={heroShots}
          headline={["Building", "Tomorrow's", "Trust.", "With", "Engineering", "Intelligence."]}
          lead={hero.lead}
          chips={["Solar PV", "Energy Storage", "Manufacturing", "EPC & Projects"]}
        />
      </section>

      <RidgeReveal />

      <main className="ridge__main">
        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{promise.eyebrow}</p>
            <h2>{promise.title}</h2>
          </header>
          <div className="ridge-block__body">
            {promise.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ol className="ridge-steps">
            {promise.stages.map((s, i) => (
              <li key={s.key}>
                <span className="ridge-steps__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ridge-steps__key">{s.key}</span>
                <span className="ridge-steps__line">{s.line}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{whatWeDo.eyebrow}</p>
            <h2>{whatWeDo.title}</h2>
          </header>
          <ul className="ridge-rows">
            {whatWeDo.items.map((s, i) => (
              <li key={s.name}>
                <span className="ridge-rows__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ridge-rows__name">{s.name}</span>
                <span className="ridge-rows__body">{s.body}</span>
                <span className="ridge-rows__flow">
                  {s.flow.map((f, k) => (
                    <em key={f}>
                      {f}
                      {k < s.flow.length - 1 && <i aria-hidden="true">→</i>}
                    </em>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ridge-plate reveal">
          <img src={IMAGES.inspection} alt="Engineer inspecting a rooftop array with wind turbines beyond" />
          <div className="ridge-plate__copy">
            <p className="ridge-label">{approach.eyebrow}</p>
            <h2>{approach.title}</h2>
            <div className="ridge-plate__grid">
              {approach.questions.map((q) => (
                <article key={q.q}>
                  <h3>{q.q}</h3>
                  <p>{q.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{why.eyebrow}</p>
            <h2>{why.title}</h2>
          </header>
          <div className="ridge-block__body">
            {why.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="ridge-pillars">
            {why.pillars.map((p) => (
              <div key={p.name}>
                <dt>{p.name}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{sectors.eyebrow}</p>
            <h2>{sectors.title}</h2>
          </header>
          <div className="ridge-sectors">
            {sectors.items.map((s) => (
              <article key={s.name}>
                <h3>{s.name}</h3>
                <ul>
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="ridge-cta reveal">
          <div>
            <p className="ridge-label">Work with DSR</p>
            <h2>Let&apos;s talk about your project.</h2>
          </div>
          <Link href="/v3/contact" className="ridge-cta__btn">
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
