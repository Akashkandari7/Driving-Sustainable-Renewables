"use client";

import { useState } from "react";
import { contact } from "@/lib/content";

export default function SkybloomContact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "Quality Assurance (PV Modules)",
    capacity: "50-200 MW",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Project Advisory Inquiry] ${formData.service} — ${formData.company || formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nService: ${formData.service}\nCapacity: ${formData.capacity}\n\nProject Scope:\n${formData.message}`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div id="contact" className="sky-section">
      <div className="sky-container">
        <div className="sky-section-header">
          <div className="sky-badge">
            <span className="sky-badge-pulse" />
            Direct Technical Advisory
          </div>
          <h2 className="sky-section-title">
            Discuss Your Next <span className="sky-gradient-text">Solar or Storage Asset</span>
          </h2>
          <p className="sky-section-desc">
            Independent due diligence, factory inspections, or BESS safety verification. Connect directly with our senior engineering team.
          </p>
        </div>

        <div className="sky-contact-grid">
          {/* Info Card */}
          <div className="sky-contact-info sky-glass">
            <h3 style={{ fontFamily: "var(--font-display, sans-serif)", fontSize: "1.6rem", color: "#fff", marginBottom: "16px" }}>
              Global Technical Footprint
            </h3>
            <p style={{ color: "var(--sky-text-muted)", marginBottom: "32px", fontSize: "0.98rem" }}>
              Supporting asset developers, IPPs, multilateral lenders, and tier-1 manufacturers across 18 countries.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "40px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div className="sky-badge-icon">📍</div>
                <div>
                  <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0 0 4px" }}>Headquarters</h4>
                  <p style={{ color: "var(--sky-text-muted)", fontSize: "0.88rem", margin: 0 }}>
                    {contact.address}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div className="sky-badge-icon" style={{ color: "var(--sky-cyan-light)" }}>✉️</div>
                <div>
                  <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0 0 4px" }}>Inquiries &amp; RFP Submissions</h4>
                  <a
                    href={`mailto:${contact.email}`}
                    style={{ color: "var(--sky-cyan-light)", fontSize: "0.88rem", textDecoration: "none" }}
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                <div className="sky-badge-icon">⏱️</div>
                <div>
                  <h4 style={{ color: "#fff", fontSize: "0.95rem", margin: "0 0 4px" }}>Rapid Deployment SLA</h4>
                  <p style={{ color: "var(--sky-text-muted)", fontSize: "0.88rem", margin: 0 }}>
                    Senior engineering response within 24 hours. Factory audit teams deployed in &lt;5 business days.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: "20px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <div style={{ fontWeight: 600, color: "var(--sky-emerald-light)", fontSize: "0.9rem", marginBottom: "4px" }}>
                🔒 100% Independent &amp; Uncompromised
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--sky-text-muted)" }}>
                DSR holds zero commercial interest in equipment manufacturing or EPC contracting. Our allegiance is solely to asset quality and investor bankability.
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="sky-contact-form-wrap sky-glass">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "12px" }}>Inquiry Dispatched</h3>
                <p style={{ color: "var(--sky-text-muted)", fontSize: "0.95rem", marginBottom: "24px" }}>
                  Your email client has opened with pre-filled technical specifications. We look forward to reviewing your project parameters.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="sky-btn sky-btn-secondary"
                >
                  Submit Another Project
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="sky-input-group">
                    <label className="sky-label">Full Name *</label>
                    <input
                      required
                      type="text"
                      className="sky-input"
                      placeholder="e.g. Rachel Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="sky-input-group">
                    <label className="sky-label">Work Email *</label>
                    <input
                      required
                      type="email"
                      className="sky-input"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "16px" }}>
                  <div className="sky-input-group">
                    <label className="sky-label">Company / Organization *</label>
                    <input
                      required
                      type="text"
                      className="sky-input"
                      placeholder="e.g. Apex Clean Power IPP"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>

                  <div className="sky-input-group">
                    <label className="sky-label">Estimated Capacity</label>
                    <select
                      className="sky-select"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    >
                      <option value="Under 20 MW">&lt; 20 MW</option>
                      <option value="20-100 MW">20 - 100 MW</option>
                      <option value="100-300 MW">100 - 300 MW</option>
                      <option value="300+ MW">300+ MW / GWh</option>
                    </select>
                  </div>
                </div>

                <div className="sky-input-group">
                  <label className="sky-label">Primary Technical Service *</label>
                  <select
                    className="sky-select"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="Quality Assurance (PV Modules)">PV Module Quality Assurance &amp; Factory Audit</option>
                    <option value="BESS Storage Acceptance">Battery Energy Storage (BESS) Safety &amp; FAT</option>
                    <option value="Technical Due Diligence">Technical Due Diligence for Lenders / Investors</option>
                    <option value="Digital Intelligence Platform">Digital Intelligence &amp; Defect Analytics</option>
                    <option value="Comprehensive Owner's Engineer">Comprehensive Owner&apos;s Engineering</option>
                  </select>
                </div>

                <div className="sky-input-group">
                  <label className="sky-label">Project Details &amp; Timeline</label>
                  <textarea
                    rows={4}
                    className="sky-textarea"
                    placeholder="Tell us about the project stage, manufacturer, location, or target COD..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="sky-btn sky-btn-primary"
                  style={{ width: "100%", padding: "16px", fontSize: "1rem" }}
                >
                  Transmit Technical Inquiry →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
