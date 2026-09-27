import type { Metadata } from "next";
import Link from "next/link";
import BrewNav from "@/components/BrewNav";
import BrewReveal from "@/components/BrewReveal";
import { home, services } from "@/lib/dsr";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "DSR — Independent Quality, Engineering & Advisory for Solar and Storage",
  description: home.hero.lead,
};

/* The hero subject, with the callouts that sit around it. */
const CALLOUTS = [
  { x: 14, y: 26, label: "Factory audit", note: "Capability, process, quality system" },
  { x: 66, y: 46, label: "Pre-shipment", note: "Visual, dimensional, EL witnessing" },
  { x: 24, y: 74, label: "BOM verification", note: "What was specified is what is built" },
];

const TICKER = [
  "Factory audits",
  "Pre-shipment inspection",
  "Construction monitoring",
  "Technical due diligence",
  "BESS factory acceptance",
  "Commissioning support",
  "Supplier assessment",
];

export default function BrewHome() {
  const { promise, whatWeDo, why, sectors } = home;

  return (
    <>
      <BrewNav />
      <BrewReveal />

      <main>
        <section className="brew-hero">
          <div className="brew-hero__glow" aria-hidden="true" />

          <div className="brew-hero__copy reveal">
            <p className="brew-eyebrow">// Independent technical services</p>
            <h1>
              Quality you
              <br />
              can <em>verify</em>
            </h1>
            <p className="brew-hero__body">
              Engineering, inspection and execution support for solar and energy storage — from the drawing to the
              factory floor to the grid.
            </p>
            <Link href="/v4/services" className="brew-link">
              Explore services <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <figure className="brew-hero__subject reveal">
            <img src={asset("/images/dusk/dusk-cell-inspect-w.jpg")} alt="A photovoltaic cell string under inspection light" />
            {CALLOUTS.map((c) => (
              <span key={c.label} className="brew-callout" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
                <i aria-hidden="true" />
                <b>{c.label}</b>
                {c.note}
              </span>
            ))}
          </figure>

          <aside className="brew-spec reveal">
            <p className="brew-spec__kicker">// On the line</p>
            <h2>
              PV module <span>Cells · Glass · Frame</span>
            </h2>
            <dl>
              <div>
                <dt>Checked at</dt>
                <dd>Supplier · Pre-production · Production · Pre-shipment</dd>
              </div>
              <div>
                <dt>Reported as</dt>
                <dd>Findings, evidence, corrective action</dd>
              </div>
            </dl>
          </aside>

          <div className="brew-ticker" aria-hidden="true">
            <div>
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={`${t}-${i}`}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="brew-block reveal">
          <p className="brew-eyebrow">// {promise.eyebrow}</p>
          <h2 className="brew-head">
            From technical decisions
            <br />
            to <em>project delivery</em>
          </h2>
          <ol className="brew-stages">
            {promise.stages.map((s) => (
              <li key={s.key}>
                <span>{s.key}</span>
                <p>{s.line}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="brew-split reveal">
          <figure>
            <img src={asset("/images/dusk/dusk-bess-interior-w.jpg")} alt="Battery racks inside a storage container" />
          </figure>
          <div>
            <p className="brew-eyebrow">// {whatWeDo.eyebrow}</p>
            <h2 className="brew-head">
              Technical expertise across
              <br />
              the <em>project lifecycle</em>
            </h2>
            <ul className="brew-list">
              {whatWeDo.items.map((s) => (
                <li key={s.name}>
                  <b>{s.name}</b>
                  <p>{s.body}</p>
                  <span>{s.flow.join(" / ")}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="brew-block reveal">
          <p className="brew-eyebrow">// {why.eyebrow}</p>
          <h2 className="brew-head">
            Independent. Technical.
            <br />
            <em>Evidence-based</em>
          </h2>
          <div className="brew-grid">
            {why.pillars.map((p) => (
              <article key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brew-block brew-block--tight reveal">
          <p className="brew-eyebrow">// Services</p>
          <ol className="brew-index">
            {services.map((s) => (
              <li key={s.num}>
                <Link href="/v4/services">
                  <b>{s.name}</b>
                  <span>{s.tagline}</span>
                  <i aria-hidden="true">↗</i>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section className="brew-block reveal">
          <p className="brew-eyebrow">// {sectors.eyebrow}</p>
          <div className="brew-sectors">
            {sectors.items.map((s) => (
              <article key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.tags.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brew-cta reveal">
          <div className="brew-hero__glow" aria-hidden="true" />
          <h2 className="brew-head">
            Tell us where the
            <br />
            project <em>stands</em>
          </h2>
          <Link href="/v4/contact" className="brew-btn">
            Discuss your project <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
