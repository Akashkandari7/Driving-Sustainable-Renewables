// All copy is taken from the client's "DSR Website Content" document.
// Nothing here is invented — no figures are shown anywhere, because the client supplied none.

export const IMAGES = {
  sunset: "/images/dsr-solar-engineers-sunset.png",
  bess: "/images/dsr-bess-container.png",
  blueprint: "/images/dsr-engineers-blueprint.png",
};

export const contact = {
  email: "info@dsrenewables.com",
  address: "C 927, Sector 7, Dwarka, New Delhi 110045",
};

export const nav = [
  { href: "/v2", label: "Home" },
  { href: "/v2/about", label: "About Us" },
  { href: "/v2/services", label: "Services" },
  { href: "/v2/contact", label: "Contact Us" },
];

/* ---------------------------------- home ---------------------------------- */

export const home = {
  hero: {
    eyebrow: "01 — Home",
    title: ["Building Tomorrow's Trust.", "With Engineering Intelligence."],
    lead: "Independent Quality, Engineering & Advisory Solutions for Solar and Energy Storage.",
    body: "From Site planning and Technology selection to Factory Quality Assurance, Construction Monitoring and Commissioning support, DSR works with Renewable Energy Developers, Independent Power Producers (IPPs), EPCs, Investors, Manufacturers and Project Stakeholders and help them make informed decisions, manage technical risk and build confidence across the Asset lifecycle.",
    actions: [
      { href: "/v2/contact", label: "Discuss Your Project", primary: true },
      { href: "/v2/services", label: "Explore Our Services", primary: false },
    ],
  },
  promise: {
    eyebrow: "The DSR Promise",
    title: "From Technical Decisions to Project Delivery.",
    body: [
      "Renewable Energy Projects involve thousands of Technical and Commercial decisions.",
      "The right Technology must be selected. The right Equipment must be procured. Manufacturing Quality must be verified. Construction must follow Design. And Commissioning must deliver what was planned.",
      "DSR brings these critical stages together under one technical framework.",
    ],
    stages: [
      { key: "Engineering", line: "Plan the right Project." },
      { key: "Quality", line: "Verify the right Product." },
      { key: "Execution", line: "Build it the Right way." },
      { key: "Commissioning", line: "Deliver it ready to Perform." },
    ],
  },
  whatWeDo: {
    eyebrow: "What We Do",
    title: "Technical Expertise across the Project lifecycle.",
    items: [
      {
        name: "Engineering Services",
        body: "From Site layouts and Feasibility studies to DPRs, Technology selection and Detailed Engineering support.",
        flow: ["Plan", "Design", "Optimise"],
      },
      {
        name: "Quality Assurance",
        body: "Independent oversight of Suppliers, Factories, Production, Pre-shipment and Material delivery.",
        flow: ["Assess", "Inspect", "Verify"],
      },
      {
        name: "Project & Construction Support",
        body: "On-ground Technical Monitoring to help ensure construction aligns with approved Designs, Specifications and Quality requirements.",
        flow: ["Monitor", "Identify", "Resolve"],
      },
      {
        name: "Commissioning Support",
        body: "Technical support through Pre-commissioning, Testing, Punch-point closure and Project handover.",
        flow: ["Test", "Verify", "Handover"],
      },
    ],
  },
  approach: {
    eyebrow: "Our Approach",
    title: "Engineering-led. Evidence-based. Execution-focused.",
    body: ["We believe Technical services should do more than generate reports.", "They should help answer three questions:"],
    questions: [
      {
        q: "Is it Technically right?",
        a: "We assess Designs, Equipment, Processes and Installations against defined requirements.",
      },
      {
        q: "Is it being Executed correctly?",
        a: "We provide Technical oversight across Manufacturing and Construction.",
      },
      {
        q: "Is it ready to Perform?",
        a: "We support Testing, Commissioning and Technical close-out.",
      },
    ],
  },
  why: {
    eyebrow: "Why DSR",
    title: "Quality, Engineering, Advisory and Digital Intelligence — under one Independent Platform.",
    body: [
      "DSR is an Independent Renewable Energy Company with a simple objective:",
      "Bring experienced Technical thinking, Disciplined execution and Transparent Reporting to every Assignment.",
    ],
    pillars: [
      { name: "Independence", body: "An objective Technical perspective between Buyer and Supplier." },
      {
        name: "Technical Depth",
        body: "Engineering-led Inspection and Assessment based on Specifications, Standards and defined Acceptance criteria.",
      },
      { name: "Execution", body: "Clear Inspection plans, defined Checkpoints and Structured Reporting." },
      { name: "Visibility", body: "Turning field observations into information that Project and Procurement teams can act upon." },
      { name: "Technology", body: "Using Digital tools to make Quality information more accessible, traceable and actionable." },
    ],
  },
  sectors: {
    eyebrow: "Sectors",
    title: "Focused on the technologies shaping the energy transition.",
    items: [
      { name: "Solar PV", tags: ["Modules", "Cells", "Manufacturing", "Projects"] },
      { name: "Energy Storage", tags: ["Cells", "Battery Modules", "BESS"] },
      { name: "Renewable Energy Projects", tags: ["Utility Scale", "C&I", "Infrastructure"] },
      { name: "Manufacturing", tags: ["PV Manufacturing", "Battery Manufacturing", "New Facilities"] },
      { name: "Developers & IPPs", tags: ["Project Development", "Procurement", "Execution"] },
      { name: "EPC & Project Partners", tags: ["Engineering", "Construction", "Quality", "Commissioning"] },
    ],
  },
};

/* --------------------------------- about ---------------------------------- */

export const about = {
  hero: {
    eyebrow: "02 — About Us",
    title: "Built for the Next Generation of Renewable Energy.",
    body: [
      "DSR — Driving Sustainable Renewables — is an Independent Renewable Energy Technical Services Company combining Engineering, Quality Assurance and Project Execution support.",
      "We work with Developers, IPPs, EPCs, Govt./Utilities, Lenders/Financial Institutions, Manufacturers, and other Industry Stakeholders across critical stages of Renewable Energy Projects.",
    ],
    note: "Our objective is straightforward: help clients make better Technical Decisions and execute Renewable Energy Projects with greater confidence.",
  },
  purpose: {
    eyebrow: "Our Purpose",
    title: "Make Renewable Energy projects more Transparent, Measurable and Reliable.",
    body: ["Renewable Energy projects operate across complex interfaces:"],
    chain: ["Engineering", "Procurement", "Manufacturing", "Logistics", "Construction", "Commissioning"],
    after: [
      "A weakness at one stage can create problems at another.",
      "A Design decision affects Procurement. Procurement affects Manufacturing. Manufacturing affects Installation. Installation affects Commissioning.",
      "DSR connects these Technical interfaces through one integrated approach.",
    ],
  },
  vision: {
    eyebrow: "Our Vision",
    title: "A Renewable Energy Industry where Technical decisions are driven by Evidence, not Assumptions.",
    body: ["We want to contribute to a Project environment where:"],
    points: [
      "Specifications are clear",
      "Suppliers are properly assessed",
      "Quality is verified",
      "Construction is monitored",
      "Issues are identified early",
      "Decisions are evidence-based",
      "And Project handovers are properly documented",
    ],
  },
  mission: {
    eyebrow: "Our Mission",
    title: "To bring Engineering discipline, Independent Assurance and Execution visibility to Renewable Energy Projects.",
    body: ["We achieve this through:"],
    items: [
      { name: "Engineering", body: "Designing and evaluating Technically sound solutions." },
      { name: "Assurance", body: "Verifying products, processes and installations." },
      { name: "Execution", body: "Supporting teams where engineering meets the real world." },
      { name: "Technology", body: "Using digital tools to improve visibility and decision-making." },
    ],
  },
  values: {
    eyebrow: "Our Values",
    title: "How we work on every assignment.",
    items: [
      { name: "Integrity", body: "We Report what we observe and assess what the evidence supports." },
      { name: "Independence", body: "We maintain an objective technical perspective." },
      { name: "Technical Rigour", body: "We work against defined specifications, standards and acceptance criteria." },
      { name: "Accountability", body: "Every observation should lead to clarity, action and closure." },
      { name: "Practicality", body: "Engineering recommendations must work in the field — not just on paper." },
      { name: "Continuous Improvement", body: "Every project should generate learning that improves the next one." },
    ],
  },
  experience: {
    eyebrow: "Our Experience",
    title: "Experience behind the company.",
    body: [
      "DSR is an Organisation built around Professionals with Experience across Renewable Energy Manufacturing, Quality Assurance, Inspection, Procurement and Project execution.",
      "Our Team's experience encompasses areas including:",
    ],
    items: [
      { name: "Engineering", body: "Site Planning, Technical Assessment and Project Engineering." },
      { name: "Manufacturing", body: "PV Module and Battery Manufacturing environments." },
      { name: "Quality", body: "Factory Audits, Production monitoring and Inspection." },
      { name: "Procurement", body: "Technical specifications, Supplier Assessment and Technical evaluation." },
      { name: "Projects", body: "Construction Monitoring, Project coordination and Execution support." },
      { name: "Technology", body: "Digital Reporting, Analytics and Data-driven quality management." },
    ],
  },
};

/* -------------------------------- services -------------------------------- */

export type ServiceGroup = { name?: string; items: string[] };

export type Service = {
  num: string;
  name: string;
  tagline: string;
  body?: string;
  groups: ServiceGroup[];
  closing?: string;
};

export const servicesIntro = {
  eyebrow: "03 — Services",
  title: "Engineering. Quality. Execution.",
  lead: "Technical Services across the Renewable Energy project lifecycle.",
  body: "DSR supports clients from early-stage Planning and Engineering through Procurement, Manufacturing, Construction and Commissioning.",
};

export const services: Service[] = [
  {
    num: "01",
    name: "Engineering Services",
    tagline: "From Concept to Construction-ready.",
    body: "DSR provides practical Engineering support to help clients Evaluate, Design and Prepare Renewable Energy Projects.",
    groups: [
      {
        name: "Site & Layout Engineering",
        items: [
          "Site Assessment",
          "Site Feasibility",
          "Plant Layout",
          "Module/Block layout",
          "Equipment positioning",
          "Inverter & Transformer placement",
          "Cable-routing concepts",
          "Access & Infrastructure planning",
          "Preliminary BOQ",
        ],
      },
      {
        name: "DPR & Technical Feasibility",
        items: [
          "Technical Feasibility",
          "Project Configuration",
          "System sizing",
          "Energy-yield considerations",
          "Technology Assessment",
          "Technical Assumptions",
          "Preliminary Technical costing inputs",
          "Detailed Project Report",
        ],
      },
      {
        name: "Technology Selection",
        items: [
          "PV Module Selection",
          "Inverter Selection",
          "Tracker / fixed-tilt evaluation",
          "BESS Technology selection",
          "Equipment comparison",
          "Technical specification",
          "Technical-commercial evaluation",
        ],
      },
      {
        name: "Engineering Review",
        items: [
          "Design Review",
          "SLD Review",
          "Equipment Specifications",
          "Datasheet Review",
          "Electrical Design Review",
          "Civil/structural Interface",
          "Protection & Control Review",
          "Engineering Documentation",
        ],
      },
    ],
  },
  {
    num: "02",
    name: "Technical Procurement & Supplier Advisory",
    tagline: "Choose the Right Technology. Evaluate the Right Supplier.",
    body: "DSR supports clients at the interface between Engineering and Procurement.",
    groups: [
      {
        name: "Services",
        items: [
          "Technical Specifications",
          "Technical Bid evaluation",
          "Vendor Technical comparison",
          "Supplier Capability Assessment",
          "Factory Capability Assessment",
          "Technical Deviation Analysis",
          "BOM Review",
          "Supplier Qualification",
          "QAP / ITP Review",
          "Procurement Technical Support",
        ],
      },
    ],
    closing: "The objective: make procurement decisions based on technical fit — not just commercial comparison.",
  },
  {
    num: "03",
    name: "Quality Assurance & Inspection",
    tagline: "Verify Quality before it becomes a project problem.",
    groups: [
      {
        name: "Supplier & Factory",
        items: [
          "Factory Audits",
          "Manufacturing Capability Assessment",
          "Quality-system Review",
          "Supplier Assessment",
          "Technical Documentation Review",
        ],
      },
      {
        name: "Pre-Production",
        items: ["Pre-Production Audit", "BOM Verification", "QAP / ITP review", "Manufacturing Readiness", "Raw-material Verification"],
      },
      {
        name: "Production",
        items: [
          "Production Monitoring",
          "Process Inspection",
          "Workmanship Assessment",
          "Testing Verification",
          "Defect Identification",
          "NCR Monitoring",
        ],
      },
      {
        name: "Pre-Shipment",
        items: [
          "Pre-Shipment Inspection",
          "Visual & Dimensional inspection",
          "Testing / EL witnessing where applicable",
          "Packaging verification",
          "Documentation verification",
        ],
      },
      {
        name: "Logistics & Site",
        items: [
          "Container Loading Check",
          "Dispatch verification",
          "Unloading Monitoring",
          "Material receipt inspection",
          "Storage verification",
        ],
      },
    ],
  },
  {
    num: "04",
    name: "Construction Monitoring",
    tagline: "Make sure what was Engineered is what gets built.",
    body: "DSR provides independent technical monitoring during construction.",
    groups: [
      {
        name: "Services",
        items: [
          "Construction progress monitoring",
          "Design compliance checks",
          "Material verification",
          "Installation inspection",
          "Module installation monitoring",
          "Structure / tracker inspection",
          "Electrical installation monitoring",
          "Cable routing & termination checks",
          "Equipment installation verification",
          "Workmanship assessment",
          "Quality observations",
          "NCR / punch-point tracking",
          "Progress reporting",
        ],
      },
    ],
    closing: "Field reality matters. Our role is to identify deviations early — while they can still be corrected efficiently.",
  },
  {
    num: "05",
    name: "Commissioning Support",
    tagline: "From construction complete to operational readiness.",
    body: "DSR supports clients through the final technical stages of project execution.",
    groups: [
      {
        name: "Pre-Commissioning",
        items: ["Installation completion verification", "Equipment readiness", "Documentation review", "Punch-point verification"],
      },
      {
        name: "Commissioning",
        items: ["Testing coordination", "Test witnessing", "Equipment verification", "Performance-test support", "Technical documentation"],
      },
      {
        name: "Handover",
        items: [
          "Punch-list closure",
          "Quality dossier review",
          "As-built documentation review",
          "Test certificate verification",
          "Handover support",
          "Final technical reporting",
        ],
      },
    ],
  },
  {
    num: "06",
    name: "Energy Storage & BESS",
    tagline: "Technical assurance for the evolving energy system.",
    body: "DSR provides technical support across Battery Cells (Manufacturing • Quality • Testing), Battery Modules (Assembly • Inspection • Process Verification) and BESS (Factory inspection • FAT • System inspection • Documentation • Pre-shipment).",
    groups: [
      {
        name: "Services include",
        items: [
          "Supplier assessment",
          "Factory audit",
          "Production monitoring",
          "FAT witnessing",
          "Quality inspection",
          "Technical documentation review",
          "System-level assessment",
          "Pre-shipment inspection",
          "Project support",
        ],
      },
    ],
  },
  {
    num: "07",
    name: "Technical Advisory",
    tagline: "Independent insight when technical decisions matter most.",
    groups: [
      {
        name: "Technical Due Diligence",
        items: [
          "Project assessment",
          "Technology assessment",
          "Manufacturing assessment",
          "Supplier assessment",
          "Technical risk identification",
        ],
      },
      {
        name: "Owner's Technical Support",
        items: [
          "Technical review",
          "Procurement support",
          "Supplier evaluation",
          "Construction monitoring",
          "Quality oversight",
          "Commissioning support",
        ],
      },
      {
        name: "Technical Problem Solving",
        items: [
          "Root-cause assessment",
          "Technical deviation review",
          "Quality issue investigation",
          "Corrective-action assessment",
          "Engineering recommendations",
        ],
      },
    ],
  },
];
