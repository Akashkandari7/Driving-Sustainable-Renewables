import type { Metadata } from "next";
import Link from "next/link";
import BrewNav from "@/components/BrewNav";
import BrewReveal from "@/components/BrewReveal";
import BrewSubject from "@/components/BrewSubject";
import BrewModel from "@/components/BrewModel";
import { about } from "@/lib/dsr";

export const metadata: Metadata = {
  title: "About DSR — Built for the Next Generation of Renewable Energy",
  description: about.hero.body[0],
};

export default function BrewAbout() {
  const { hero, purpose, vision, mission, values, experience } = about;

  return (
    <>
      <BrewNav />
      <BrewReveal />

      <main>
        <section className="brew-top brew-top--withobject reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <div>
            <p className="brew-eyebrow">// {hero.eyebrow}</p>
            <h1 className="brew-head">
              Built for the next
              <br />
              generation of <em>renewables</em>
            </h1>
            <p className="brew-top__lead">{hero.note}</p>
          </div>
          <figure className="is-subject brew-top__object">
            <BrewModel name="pallet" label="Solar modules stacked on a pallet">
              <BrewSubject name="crate" label="" />
            </BrewModel>
          </figure>
        </section>

        <section className="brew-split reveal">
          <figure className="is-subject">
            <BrewModel name="bench" label="Site equipment: a hard hat, rolled drawings and a caliper">
              <BrewSubject name="bench" label="" />
            </BrewModel>
          </figure>
          <div>
            <p className="brew-eyebrow">// Who we are</p>
            {hero.body.map((p) => (
              <p key={p} className="brew-service__body">
                {p}
              </p>
            ))}
            <p className="brew-eyebrow" style={{ marginTop: 34 }}>
              // {purpose.eyebrow}
            </p>
            <h2 className="brew-head" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", marginBottom: 20 }}>
              {purpose.title}
            </h2>
            <ol className="brew-chain">
              {purpose.chain.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
            {purpose.after.map((p) => (
              <p key={p} className="brew-service__body">
                {p}
              </p>
            ))}
          </div>
        </section>

        <section className="brew-split brew-split--flip reveal">
          <div>
            <p className="brew-eyebrow">// {vision.eyebrow}</p>
            <h2 className="brew-head">
              Decisions driven by
              <br />
              <em>evidence</em>, not assumptions
            </h2>
            <ul className="brew-ticks">
              {vision.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <figure className="is-subject">
            <BrewModel name="thermal" label="A thermal imaging camera used on inspections">
              <BrewSubject name="dashboard" label="" />
            </BrewModel>
          </figure>
        </section>

        <section className="brew-block reveal">
          <p className="brew-eyebrow">// {mission.eyebrow}</p>
          <h2 className="brew-head">{mission.title}</h2>
          <ol className="brew-stages">
            {mission.items.map((m) => (
              <li key={m.name}>
                <span>{m.name}</span>
                <p>{m.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="brew-block reveal">
          <p className="brew-eyebrow">// {values.eyebrow}</p>
          <div className="brew-grid">
            {values.items.map((v) => (
              <article key={v.name}>
                <h3>{v.name}</h3>
                <p>{v.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brew-block reveal">
          <p className="brew-eyebrow">// {experience.eyebrow}</p>
          <h2 className="brew-head">{experience.title}</h2>
          <div className="brew-grid">
            {experience.items.map((e) => (
              <article key={e.name}>
                <h3>{e.name}</h3>
                <p>{e.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brew-cta reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <h2 className="brew-head">
            Work with <em>DSR</em>
          </h2>
          <Link href="/v4/contact" className="brew-btn">
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
