"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DesignSwitcher from "@/components/DesignSwitcher";

const scenes = [
  {
    id: "scene-bess",
    tag: "01 / UTILITY-SCALE BESS & SOLAR",
    headline: "Where Nature Meets the Future of Energy",
    sub: "Independent quality, engineering and advisory solutions for solar and battery energy storage — from factory floor to the grid.",
    image: "/images/homepage2.png",
    stat: { value: "12+ GW", label: "Verified to Date" },
    accent: "#10b981",
    accentGlow: "rgba(16, 185, 129, 0.45)",
    hotspots: [
      { id: "hs1", x: 55, y: 40, title: "Nature-Integrated Solar", body: "Agrivoltaic design — panels tested to coexist with crops, wildflower habitat & pollinators." },
      { id: "hs2", x: 25, y: 65, title: "Pre-Shipment QA", body: "68% of cell defects caught before modules leave the factory. Zero compromise." },
    ],
  },
  {
    id: "scene-field",
    tag: "02 / FIELD AUDITS & LENDER ADVISORY",
    headline: "Confidence Starts Before the Grid Connects",
    sub: "Boots-on-ground independent audits, electroluminescence scans and lender technical due diligence across 18 countries.",
    image: "/images/dsr-solar-engineers-sunset.png",
    stat: { value: "400+", label: "Factory Audits Completed" },
    accent: "#f59e0b",
    accentGlow: "rgba(245, 158, 11, 0.45)",
    hotspots: [
      { id: "hs3", x: 35, y: 52, title: "Senior QA Engineers", body: "100% independent — zero conflict of interest with OEMs or EPCs." },
      { id: "hs4", x: 65, y: 72, title: "Golden Hour Irradiance", body: "Real-time IV curve calibration against golden reference cells at dusk & dawn." },
    ],
  },
  {
    id: "scene-advisory",
    tag: "03 / GLOBAL TECHNICAL ADVISORY",
    headline: "Better Decisions. Lower Risk. Cleaner World.",
    sub: "Supporting developers, lenders and institutional investors — de-risking 250+ utility-scale portfolios across 5 continents.",
    image: "/images/renewable-field.png",
    stat: { value: "18", label: "Countries Active" },
    accent: "#38bdf8",
    accentGlow: "rgba(56, 189, 248, 0.45)",
    hotspots: [
      { id: "hs5", x: 72, y: 38, title: "Grid Integration", body: "Balance-of-plant, inverter & substation safety review for bankable interconnection." },
      { id: "hs6", x: 44, y: 68, title: "BESS Safety Review", body: "NFPA 855 / UL 9540A thermal runaway prevention and container FAT witness." },
    ],
  },
];

function Hotspot({ data, active, onToggle, accent }: {
  data: (typeof scenes)[0]["hotspots"][0];
  active: boolean;
  onToggle: () => void;
  accent: string;
}) {
  return (
    <div style={{ position: "absolute", left: `${data.x}%`, top: `${data.y}%`, transform: "translate(-50%,-50%)", zIndex: 20 }}>
      {!active && (
        <span style={{
          position: "absolute", inset: "-10px", borderRadius: "50%",
          border: `1.5px solid ${accent}`, animation: "hs-ring 2.4s ease-out infinite", pointerEvents: "none",
        }} />
      )}
      <button
        onClick={onToggle}
        style={{
          position: "relative", width: 38, height: 38, borderRadius: "50%",
          border: `1.5px solid ${active ? accent : "rgba(255,255,255,0.55)"}`,
          background: active ? accent : "rgba(10,18,32,0.6)",
          backdropFilter: "blur(14px)",
          color: active ? "#fff" : accent,
          fontSize: 20, fontWeight: 300, lineHeight: "1", cursor: "pointer",
          transition: "all 0.25s ease",
          boxShadow: active ? `0 0 24px ${accent}88, 0 4px 16px rgba(0,0,0,0.5)` : `0 0 16px ${accent}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.18)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
      >
        {active ? "✕" : "+"}
      </button>
      {active && (
        <div style={{
          position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)",
          width: 260, padding: "14px 18px",
          background: "rgba(6,15,28,0.93)", backdropFilter: "blur(28px) saturate(180%)",
          border: `1px solid ${accent}55`, borderRadius: 16,
          boxShadow: `0 16px 40px rgba(0,0,0,0.75), 0 0 24px ${accent}22`,
          animation: "hs-pop 0.22s cubic-bezier(0.34,1.56,0.64,1)", zIndex: 30,
        }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: accent, textTransform: "uppercase", margin: "0 0 5px" }}>
            ● INSPECTED & VERIFIED
          </p>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>{data.title}</h4>
          <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>{data.body}</p>
        </div>
      )}
    </div>
  );
}

const TICKER = [
  "● INDEPENDENT QA & ENGINEERING",
  "  ///  12+ GW SOLAR VERIFIED",
  "  ///  400+ FACTORY AUDITS",
  "  ///  BESS SAFETY: NFPA 855 / UL 9540A",
  "  ///  LENDER TECHNICAL DUE DILIGENCE",
  "  ///  18 COUNTRIES ACTIVE",
  "  ///  AGRIVOLTAIC & BIODIVERSITY DESIGN",
  "  ///  OWNER'S ENGINEERING",
];

export default function SkybloomPage() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [showContact, setShowContact] = useState(false);

  const scene = scenes[sceneIdx];

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const goToScene = (idx: number) => {
    if (idx === sceneIdx || transitioning) return;
    setTransitioning(true);
    setActiveHotspot(null);
    setTimeout(() => { setSceneIdx(idx); setTransitioning(false); }, 500);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#060f1c", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif", userSelect: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes hs-ring { 0% { transform:scale(1); opacity:0.8; } 100% { transform:scale(2.2); opacity:0; } }
        @keyframes hs-pop { from { opacity:0; transform:translateX(-50%) scale(0.88) translateY(6px); } to { opacity:1; transform:translateX(-50%) scale(1) translateY(0); } }
        @keyframes float-y { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
        @keyframes beacon-pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes fade-slide-up { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes ticker-scroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        .sb-text-enter { animation: fade-slide-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .sb-fade-in { animation: fade-in 0.6s ease both; }
        .contact-input { width:100%; padding:12px 16px; border-radius:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); color:#fff; font-size:14px; outline:none; font-family:inherit; transition:border-color 0.2s; }
        .contact-input:focus { border-color:#10b981; }
        .contact-input::placeholder { color:#475569; }
      `}</style>

      <DesignSwitcher current="skybloom" />

      {/* BG IMAGE */}
      <div
        key={`bg-${sceneIdx}`}
        className="sb-fade-in"
        style={{
          position: "absolute", inset: 0, zIndex: 0,
          transform: `scale(1.07) translate(${mouse.x * -14}px, ${mouse.y * -9}px)`,
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          filter: "saturate(1.15) brightness(1.05)",
        }}
      >
        <Image src={scene.image} alt={scene.headline} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 42%" }} />
      </div>

      {/* Overlays */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to top, rgba(4,10,22,0.92) 0%, rgba(4,10,22,0.45) 35%, rgba(4,10,22,0.1) 60%, rgba(4,10,22,0.25) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to right, rgba(4,10,22,0.7) 0%, rgba(4,10,22,0.3) 30%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `radial-gradient(ellipse 55% 45% at 78% 20%, ${scene.accentGlow} 0%, transparent 65%)`, transition: "background 0.8s ease", pointerEvents: "none" }} />

      {/* HOTSPOTS */}
      <div style={{ position: "absolute", inset: 0, zIndex: 15, pointerEvents: "none" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", pointerEvents: "all" }}>
          {scene.hotspots.map((hs) => (
            <Hotspot key={hs.id} data={hs} accent={scene.accent} active={activeHotspot === hs.id}
              onToggle={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)} />
          ))}
        </div>
      </div>

      {/* DRONE / FOCAL ELEMENT */}
      <div style={{ position: "absolute", right: "15%", top: "26%", transform: `translate(${mouse.x * 22}px, ${mouse.y * 14}px)`, transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)", zIndex: 12, pointerEvents: "none" }}>
        <div style={{ position: "relative", animation: "float-y 3.8s ease-in-out infinite" }}>
          <div style={{ position: "absolute", inset: "-30px", borderRadius: "50%", background: `radial-gradient(circle, ${scene.accentGlow} 0%, transparent 70%)`, transition: "background 0.8s ease" }} />
          <svg width={100} height={100} viewBox="0 0 100 100" fill="none"
            style={{ filter: `drop-shadow(0 0 20px ${scene.accent}) drop-shadow(0 0 8px ${scene.accent})`, transform: `rotate(${mouse.x * 10}deg)`, transition: "transform 0.4s ease, filter 0.8s ease" }}>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            {([[20,20],[80,20],[20,80],[80,80]] as [number,number][]).map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r={11} stroke={scene.accent} strokeWidth="1.5" strokeDasharray="4 3" fill="none" opacity={0.85}
                style={{ animation: `spin ${1.2 + i * 0.2}s linear infinite ${i % 2 === 0 ? "" : "reverse"}` }} />
            ))}
            <polygon points="50,36 62,43 62,57 50,64 38,57 38,43" fill="#070e1e" stroke={scene.accent} strokeWidth="2" />
            <circle cx="50" cy="50" r="7" fill={scene.accent} style={{ animation: "beacon-pulse 1.8s ease-in-out infinite" }} />
            <circle cx="50" cy="50" r="3" fill="#fff" opacity={0.9} />
          </svg>
          <div style={{ position: "absolute", bottom: -36, left: "50%", transform: "translateX(-50%)", background: "rgba(4,10,22,0.82)", backdropFilter: "blur(16px)", border: `1px solid ${scene.accent}55`, borderRadius: 9999, padding: "3px 12px", whiteSpace: "nowrap", fontSize: 10, fontWeight: 700, color: scene.accent, letterSpacing: "0.08em", transition: "color 0.8s, border-color 0.8s" }}>
            ● DSR LIVE FIELD SCAN
          </div>
        </div>
      </div>

      {/* TOP NAV */}
      <header style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 40px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg, #10b981, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff" }}>D</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", color: "#fff", lineHeight: "1" }}>DSR RENEWABLES</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 500, marginTop: 2 }}>INDEPENDENT TECHNICAL ADVISORY</div>
          </div>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(6,12,26,0.55)", backdropFilter: "blur(24px) saturate(180%)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 9999, padding: "6px 8px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          {["BESS & SOLAR", "AUDIT & ADVISORY", "GLOBAL REACH"].map((label, i) => (
            <button key={i} onClick={() => goToScene(i)} style={{ background: sceneIdx === i ? `linear-gradient(135deg, ${scene.accent}cc, ${scene.accent}77)` : "transparent", border: "none", borderRadius: 9999, padding: "7px 18px", fontSize: 11, fontWeight: sceneIdx === i ? 700 : 500, color: sceneIdx === i ? "#fff" : "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.3s ease", letterSpacing: "0.06em" }}>
              {label}
            </button>
          ))}
          <button onClick={() => setShowContact(true)} style={{ background: "transparent", border: "none", borderRadius: 9999, padding: "7px 18px", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.55)", cursor: "pointer", letterSpacing: "0.06em" }}>ABOUT</button>
        </nav>
        <button onClick={() => setShowContact(true)} style={{ background: "rgba(6,12,26,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 9999, padding: "10px 24px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: "0.07em", transition: "all 0.25s ease" }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = `linear-gradient(135deg, ${scene.accent}, #0284c7)`; b.style.borderColor = "transparent"; }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(6,12,26,0.55)"; b.style.borderColor = "rgba(255,255,255,0.22)"; }}>
          START A PROJECT →
        </button>
      </header>

      {/* VERTICAL STATS LEFT */}
      <div style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", zIndex: 40, display: "flex", flexDirection: "column", gap: 24 }}>
        {[{ n: "12+ GW", l: "Verified" }, { n: "400+", l: "Audits" }, { n: "18", l: "Countries" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center", opacity: 0.75 }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: scene.accent, lineHeight: "1", transition: "color 0.8s" }}>{s.n}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 }}>{s.l}</div>
            {i < 2 && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "12px auto 0" }} />}
          </div>
        ))}
      </div>

      {/* BOTTOM EDITORIAL */}
      <div style={{ position: "absolute", bottom: 44, left: 72, right: 44, zIndex: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
        <div key={`text-${sceneIdx}`} className="sb-text-enter" style={{ maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: scene.accent, boxShadow: `0 0 12px ${scene.accent}`, display: "inline-block", animation: "beacon-pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: scene.accent, letterSpacing: "0.14em", textTransform: "uppercase", transition: "color 0.8s" }}>{scene.tag}</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 3.4vw, 3.4rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 14px", color: "#fff", textShadow: "0 4px 24px rgba(0,0,0,0.9)", fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: "-0.02em" }}>{scene.headline}</h1>
          <p style={{ fontSize: "0.98rem", color: "rgba(255,255,255,0.78)", lineHeight: 1.65, margin: "0 0 22px", maxWidth: 520, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{scene.sub}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setShowContact(true)} style={{ background: `linear-gradient(135deg, ${scene.accent}, #0369a1)`, border: "none", borderRadius: 9999, padding: "12px 28px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", letterSpacing: "0.05em", boxShadow: `0 4px 24px ${scene.accentGlow}`, transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.transform = "translateY(0)"; }}>
              Request an Audit →
            </button>
            <button onClick={() => goToScene((sceneIdx + 1) % scenes.length)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.22)", backdropFilter: "blur(12px)", borderRadius: 9999, padding: "12px 24px", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}>
              Explore All Services
            </button>
          </div>
        </div>
        <div key={`metrics-${sceneIdx}`} className="sb-text-enter" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, flexShrink: 0 }}>
          <div style={{ background: "rgba(4,10,22,0.72)", backdropFilter: "blur(28px) saturate(200%)", border: `1px solid ${scene.accent}44`, borderRadius: 20, padding: "16px 24px", textAlign: "right", boxShadow: `0 16px 40px rgba(0,0,0,0.6)`, minWidth: 180 }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: scene.accent, lineHeight: "1", fontFamily: "'Outfit', sans-serif", transition: "color 0.8s" }}>{scene.stat.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4, letterSpacing: "0.05em" }}>{scene.stat.label}</div>
            <div style={{ width: "100%", height: 2, background: `linear-gradient(to right, transparent, ${scene.accent})`, borderRadius: 1, marginTop: 10, transition: "background 0.8s" }} />
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 5, letterSpacing: "0.08em" }}>EMPIRICAL FIELD DATA</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {scenes.map((s, i) => (
              <button key={i} onClick={() => goToScene(i)} style={{ height: 5, width: sceneIdx === i ? 44 : 16, borderRadius: 3, background: sceneIdx === i ? scene.accent : "rgba(255,255,255,0.28)", boxShadow: sceneIdx === i ? `0 0 12px ${scene.accent}` : "none", border: "none", cursor: "pointer", transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)", padding: 0 }} title={s.tag} />
            ))}
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, zIndex: 45, background: "rgba(4,10,22,0.88)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker-scroll 28s linear infinite" }}>
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: i % TICKER.length === 0 ? scene.accent : "rgba(255,255,255,0.4)", transition: "color 0.8s", padding: "0 2px" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* CONTACT MODAL */}
      {showContact && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(3,7,18,0.88)", backdropFilter: "blur(24px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fade-in 0.25s ease" }} onClick={() => setShowContact(false)}>
          <div style={{ width: "100%", maxWidth: 540, background: "rgba(8,16,34,0.97)", border: `1px solid ${scene.accent}44`, borderRadius: 28, padding: "40px 40px 36px", boxShadow: `0 32px 64px rgba(0,0,0,0.85), 0 0 48px ${scene.accentGlow}` }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: scene.accent, letterSpacing: "0.12em", marginBottom: 6 }}>INDEPENDENT TECHNICAL ADVISORY</div>
                <h3 style={{ fontSize: "1.9rem", fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'Outfit',sans-serif" }}>Start a Project</h3>
              </div>
              <button onClick={() => setShowContact(false)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 36, height: 36, color: "#94a3b8", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.6 }}>Independent factory audits, BESS safety review, lender TDD or Owner&apos;s Engineering.</p>
            <form onSubmit={(e) => { e.preventDefault(); window.location.href = "mailto:info@dsrenewables.com?subject=Project Inquiry"; setShowContact(false); }} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input required type="text" placeholder="Your Name / Organization" className="contact-input" />
              <input required type="email" placeholder="Work Email" className="contact-input" />
              <select className="contact-input" style={{ background: "#0a1120" }}>
                <option>PV Module Quality Assurance & Factory Audit</option>
                <option>Battery Energy Storage (BESS) Safety Review</option>
                <option>Lender Technical Due Diligence</option>
                <option>Owner&apos;s Engineering / Project Management</option>
                <option>Digital Intelligence Platform Demo</option>
              </select>
              <textarea placeholder="Brief project scope..." className="contact-input" rows={3} style={{ resize: "vertical" }} />
              <button type="submit" style={{ padding: "14px", borderRadius: 9999, background: `linear-gradient(135deg, ${scene.accent} 0%, #0284c7 100%)`, color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 6px 24px ${scene.accentGlow}`, letterSpacing: "0.04em", marginTop: 4 }}>
                Transmit Technical Inquiry →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
