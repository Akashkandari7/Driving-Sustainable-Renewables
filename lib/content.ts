// Site copy. Service text is taken from the current dsrenewables.com.
// PLACEHOLDER: every `stats` value below is a sample figure for the prototype — replace with numbers
// the client confirms before this goes live.

export type Stat = { label: string; value: number; prefix?: string; suffix?: string; note: string };

export type Scene = {
  id: string;
  nav: string;
  eyebrow: string;
  title: string;
  body: string;
  points?: string[];
  stats: Stat[];
  side: "left" | "right"; // which side the text sits on; the particles sit opposite
};

export const scenes: Scene[] = [
  {
    id: "home",
    nav: "Home",
    eyebrow: "Independent. Technical. Data-driven.",
    title: "Driving Confidence in Renewable Energy",
    body: "Independent quality, engineering and advisory solutions for solar and energy storage — from the factory floor to the grid.",
    stats: [
      { label: "Projects supported", value: 250, suffix: "+", note: "Across solar and storage portfolios." },
      { label: "Capacity verified", value: 12, suffix: " GW", note: "Modules, cells and BESS inspected." },
    ],
    side: "left",
  },
  {
    id: "quality-assurance",
    nav: "Quality Assurance",
    eyebrow: "01 — Quality Assurance",
    title: "Confidence starts with knowing what you're buying.",
    body: "Independent verification of product quality and manufacturing processes, so what arrives on site is what you paid for.",
    points: ["Factory inspections", "Quality audits", "Supplier assessments", "PV modules, cells & balance-of-plant"],
    stats: [
      { label: "Factory audits", value: 400, suffix: "+", note: "Tier-1 and emerging manufacturers." },
      { label: "Defects caught pre-shipment", value: 68, suffix: "%", note: "Of issues found before leaving the factory." },
    ],
    side: "right",
  },
  {
    id: "energy-storage",
    nav: "Energy Storage",
    eyebrow: "02 — Battery Energy Storage",
    title: "Storage you can bank on.",
    body: "The same independent rigour applied to battery energy storage systems — cells, modules, racks and containerised BESS.",
    points: ["Cell & module inspections", "BESS factory acceptance", "Compliance & safety review"],
    stats: [
      { label: "Storage capacity reviewed", value: 3, suffix: " GWh", note: "Utility-scale and C&I systems." },
      { label: "Manufacturers assessed", value: 60, suffix: "+", note: "Cell and system integrators." },
    ],
    side: "left",
  },
  {
    id: "engineering",
    nav: "Engineering & Advisory",
    eyebrow: "03 — Engineering & Advisory",
    title: "Better technical decisions. Lower project risk.",
    body: "From technical specification reviews to procurement and construction support — and the due diligence that de-risks every decision in between.",
    points: ["Specification reviews", "Supplier evaluation", "Technical due diligence", "Procurement & construction support"],
    stats: [
      { label: "Due diligence reports", value: 150, suffix: "+", note: "For developers, lenders and investors." },
      { label: "Countries", value: 18, note: "Where our engineers have worked." },
    ],
    side: "right",
  },
  {
    id: "digital-intelligence",
    nav: "Digital Intelligence",
    eyebrow: "04 — Digital Intelligence",
    title: "Turning quality data into intelligence.",
    body: "Analytics dashboards, AI-enabled analysis and industry benchmarking built on real inspection data. AI doesn't replace engineering judgement — it strengthens it.",
    points: ["Quality dashboards", "AI-enabled analysis", "Industry benchmarking"],
    stats: [
      { label: "Data points analysed", value: 2, suffix: "M+", note: "From inspections and projects." },
      { label: "Faster reporting", value: 40, suffix: "%", note: "With automated insights." },
    ],
    side: "left",
  },
  {
    id: "contact",
    nav: "Contact",
    eyebrow: "Discuss a project",
    title: "A trusted technical partner for the energy transition.",
    body: "Tell us about your project — procurement, inspection, due diligence or data. We'll get back to you within one business day.",
    stats: [],
    side: "left",
  },
];

export const contact = {
  email: "info@dsrenewables.com",
  address: "C 927, Sector 7, Dwarka, New Delhi 110045",
};
