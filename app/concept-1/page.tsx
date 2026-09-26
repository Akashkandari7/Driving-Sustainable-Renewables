import ParticleScene from "@/components/ParticleScene";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import Effects from "@/components/Effects";
import ContactForm from "@/components/ContactForm";
import DesignSwitcher from "@/components/DesignSwitcher";
import { contact, scenes, type Scene } from "@/lib/content";

function StatCard({ stat, index }: { stat: Scene["stats"][number]; index: number }) {
  return (
    <div className={`card card--${index === 0 ? "a" : "b"} reveal`} style={{ transitionDelay: `${0.25 + index * 0.15}s` }}>
      <div className="card__inner glass">
        <p className="card__label">{stat.label}</p>
        <p className="card__value">
          {stat.prefix}
          <span data-count={stat.value}>{stat.value.toLocaleString("en-US")}</span>
          {stat.suffix}
        </p>
        <p className="card__note">{stat.note}</p>
      </div>
    </div>
  );
}

export default function Concept1Page() {
  const [hero, ...rest] = scenes;
  const services = rest.slice(0, -1);
  const cta = scenes[scenes.length - 1];

  return (
    <>
      <DesignSwitcher current="concept-1" />
      <ParticleScene />
      <div className="vignette" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <Header />
      <SideNav />
      <Effects />

      <main>
        <section id={hero.id} data-scene className="scene scene--left scene--hero">
          <div className="scene__text reveal">
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.body}</p>
            <div className="actions">
              <a href="#contact" className="btn btn--primary">
                Discuss a Project <span aria-hidden="true">→</span>
              </a>
              <a href="#quality-assurance" className="btn btn--ghost">
                Explore services
              </a>
            </div>
          </div>
          <div className="scene__cards">
            {hero.stats.map((s, i) => (
              <StatCard key={s.label} stat={s} index={i} />
            ))}
          </div>
          <a href="#quality-assurance" className="scroll-hint" aria-label="Scroll to services">
            <span />
            Scroll
          </a>
        </section>

        {services.map((s) => (
          <section key={s.id} id={s.id} data-scene className={`scene scene--${s.side}`}>
            <div className="scene__text reveal">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2>{s.title}</h2>
              <p className="lead">{s.body}</p>
              {s.points && (
                <ul className="points">
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="scene__cards">
              {s.stats.map((st, i) => (
                <StatCard key={st.label} stat={st} index={i} />
              ))}
            </div>
          </section>
        ))}

        <section id={cta.id} data-scene className="scene scene--left scene--contact">
          <div className="scene__text reveal">
            <p className="eyebrow">{cta.eyebrow}</p>
            <h2>{cta.title}</h2>
            <p className="lead">{cta.body}</p>
            <dl className="contact-list">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Office</dt>
                <dd>{contact.address}</dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} DSR — Driving Sustainable Renewables</p>
        <p>Independent Quality, Engineering &amp; Advisory for Solar and Energy Storage</p>
      </footer>
    </>
  );
}
