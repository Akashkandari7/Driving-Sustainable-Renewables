import type { Metadata } from "next";
import { asset } from "@/lib/asset";
import "./samples.css";

export const metadata: Metadata = {
  title: "DSR — Website design concepts",
  description: "Four directions for the DSR website, each built with the full content.",
};

const concepts = [
  {
    id: "A",
    href: "/v2/",
    name: "Cinematic",
    line: "Photography in three dimensions",
    body: "Every section is a place. The photographs carry real depth, so the camera moves through them as you scroll and the change of scene is a flight rather than a fade. Opens in daylight; a switch in the corner turns the whole site to dusk, photographs and all.",
    tags: ["Full-bleed photography", "Dawn / dusk", "3D camera"],
    shot: "/images/samples/concept-a.jpg",
  },
  {
    id: "B",
    href: "/v3/",
    name: "Editorial",
    line: "Light, structured, quietly premium",
    body: "A white page with everything set inside rounded plates: a mono strip of live detail across the top, a floating pill navigation over the hero, and a headline that fills with colour as the hero scrolls away. Services read as an index, the way a technical firm lists its work.",
    tags: ["Light", "Editorial rows", "Pill navigation"],
    shot: "/images/samples/concept-b.jpg",
  },
  {
    id: "C",
    href: "/v4/",
    name: "Product house",
    line: "The work shown like a catalogue",
    body: "A near-black stage with a warm pool of light, annotated callouts with leader lines, and a spec card that names what is being checked. Borrowed from how premium product brands present a single object — turned on the things DSR inspects.",
    tags: ["Dark stage", "Annotated", "Mono detail"],
    shot: "/images/samples/concept-c.jpg",
  },
  {
    id: "D",
    href: "/",
    name: "Technical",
    line: "The earlier direction, kept for comparison",
    body: "A particle field that forms a different figure for each section — sun, module, cell, network, globe — morphing as you scroll, with glass cards over it. Light and dark themes throughout.",
    tags: ["Particles", "Light / dark", "Abstract"],
    shot: "/images/samples/concept-d.jpg",
  },
];

export default function Samples() {
  return (
    <div className="samples">
      <header>
        <img src={asset("/images/logo-light.png")} alt="DSR" width={619} height={197} />
        <p className="samples__kicker">Website design concepts</p>
        <h1>Four directions, one set of content.</h1>
        <p className="samples__lead">
          Each one is a working site, not a picture of one — built with the approved copy, the same photography and the
          same contact details. Open them, scroll, and tell us which way to go.
        </p>
      </header>

      <main>
        {concepts.map((c) => (
          <a key={c.id} className="samples__card" href={asset(c.href)}>
            <figure>
              <img src={asset(c.shot)} alt={`${c.name} concept`} loading="lazy" />
            </figure>
            <div>
              <p className="samples__id">Concept {c.id}</p>
              <h2>{c.name}</h2>
              <p className="samples__line">{c.line}</p>
              <p className="samples__body">{c.body}</p>
              <ul>
                {c.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span className="samples__open">
                Open concept {c.id} <i aria-hidden="true">→</i>
              </span>
            </div>
          </a>
        ))}
      </main>

      <footer>
        <p>Prepared for DSR — Driving Sustainable Renewables</p>
        <p>Every concept carries the same pages: Home, About Us, Services and Contact Us.</p>
      </footer>
    </div>
  );
}
