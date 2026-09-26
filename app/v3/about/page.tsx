import type { Metadata } from "next";
import RidgeNav from "@/components/RidgeNav";
import RidgeReveal from "@/components/RidgeReveal";
import { IMAGES, about } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "About DSR — Built for the Next Generation of Renewable Energy",
  description: about.hero.body[0],
};

export default function RidgeAbout() {
  const { hero, purpose, vision, mission, values, experience } = about;

  return (
    <>
      <section className="ridge__stage">
        <RidgeNav />
        <header className="ridge-top">
          <img src={IMAGES.office} alt="The DSR office floor" />
          <div className="ridge-top__copy">
            <p className="ridge-label">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
          </div>
        </header>
      </section>

      <RidgeReveal />

      <main className="ridge__main">
        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">Who we are</p>
            <h2>{hero.note}</h2>
          </header>
          <div className="ridge-block__body">
            {hero.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{purpose.eyebrow}</p>
            <h2>{purpose.title}</h2>
          </header>
          <div className="ridge-block__body">
            {purpose.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ol className="ridge-chain">
              {purpose.chain.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            {purpose.after.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section className="ridge-plate reveal">
          <img src={IMAGES.hybrid} alt="Engineer with a tablet on a hybrid solar, wind and storage site" />
          <div className="ridge-plate__copy">
            <p className="ridge-label">{vision.eyebrow}</p>
            <h2>{vision.title}</h2>
            <ul className="ridge-ticks">
              {vision.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{mission.eyebrow}</p>
            <h2>{mission.title}</h2>
          </header>
          <div className="ridge-block__body">
            {mission.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ol className="ridge-steps">
            {mission.items.map((m, i) => (
              <li key={m.name}>
                <span className="ridge-steps__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ridge-steps__key">{m.name}</span>
                <span className="ridge-steps__line">{m.body}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{values.eyebrow}</p>
            <h2>{values.title}</h2>
          </header>
          <dl className="ridge-pillars">
            {values.items.map((v) => (
              <div key={v.name}>
                <dt>{v.name}</dt>
                <dd>{v.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ridge-block reveal">
          <header className="ridge-block__head">
            <p className="ridge-label">{experience.eyebrow}</p>
            <h2>{experience.title}</h2>
          </header>
          <div className="ridge-block__body">
            {experience.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="ridge-sectors">
            {experience.items.map((e) => (
              <article key={e.name}>
                <h3>{e.name}</h3>
                <p className="ridge-sectors__body">{e.body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
