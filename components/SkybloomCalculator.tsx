"use client";

import { useState } from "react";

export default function SkybloomCalculator() {
  const [capacity, setCapacity] = useState(150);
  const [capex, setCapex] = useState(90);

  // DSR empirical metrics:
  // ~4.5 critical defects/MW caught pre-shipment
  // Avg defect downtime / warranty loss prevented = ~2.2% of Capex
  const defectsPrevented = Math.round(capacity * 4.2);
  const costSavedM = (capex * 0.024).toFixed(1);

  return (
    <div className="sky-calculator-box sky-glass">
      <div className="sky-calc-grid">
        <div>
          <div className="sky-badge">
            <span className="sky-badge-pulse" />
            Interactive Value Calculator
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontSize: "1.85rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "12px",
              lineHeight: 1.2,
            }}
          >
            Calculate Your Risk Mitigation &amp; Capex Protection
          </h3>
          <p style={{ color: "var(--sky-text-muted)", fontSize: "0.95rem", marginBottom: "32px" }}>
            Based on empirical audit data across 12+ GW of PV module and BESS container inspections worldwide.
          </p>

          <div className="sky-calc-range">
            <label>
              <span>Project Capacity</span>
              <strong style={{ color: "var(--sky-emerald-light)" }}>{capacity} MW / MWh</strong>
            </label>
            <input
              type="range"
              min="20"
              max="1000"
              step="10"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="sky-slider"
            />
          </div>

          <div className="sky-calc-range">
            <label>
              <span>Estimated Portfolio Capex</span>
              <strong style={{ color: "var(--sky-cyan-light)" }}>${capex} Million</strong>
            </label>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={capex}
              onChange={(e) => setCapex(Number(e.target.value))}
              className="sky-slider"
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="sky-result-box">
            <div className="sky-result-val">{defectsPrevented.toLocaleString()}</div>
            <div className="sky-result-label">Manufacturing Defects Caught Before Shipment</div>
            <div style={{ fontSize: "0.82rem", color: "var(--sky-text-faint)" }}>
              Micro-cracks, PID vulnerability, busbar voids &amp; cell soldering flaws intercepted at factory gates.
            </div>
          </div>

          <div className="sky-result-box" style={{ borderColor: "rgba(14, 165, 233, 0.3)" }}>
            <div className="sky-result-val" style={{ color: "var(--sky-cyan-light)" }}>
              ${costSavedM}M+
            </div>
            <div className="sky-result-label">Estimated Downtime &amp; Replacement Capex Saved</div>
            <div style={{ fontSize: "0.82rem", color: "var(--sky-text-faint)" }}>
              Protecting asset bankability and lender warranty performance over 25+ years.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
