"use client";

import { FormEvent, useState } from "react";
import { contact } from "@/lib/dsr";

const services = [
  "Engineering Services",
  "Technical Procurement & Supplier Advisory",
  "Quality Assurance & Inspection",
  "Construction Monitoring",
  "Commissioning Support",
  "Energy Storage & BESS",
  "Technical Advisory",
  "Other",
];

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const payload = Object.fromEntries(d.entries()) as Record<string, string>;

    setState("sending");
    setNote("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };

      if (data.ok) {
        setState("sent");
        form.reset();
        return;
      }

      // Delivery isn't wired up yet (or failed): hand the enquiry to the visitor's mail app
      // rather than losing what they typed.
      const subject = `Project enquiry — ${payload.service} — ${payload.company || payload.name}`;
      const lines = [
        `Name: ${payload.name}`,
        `Company: ${payload.company}`,
        `Email: ${payload.email}`,
        `Service: ${payload.service}`,
        "",
        payload.message,
      ].join("\n");
      setState("error");
      setNote("We couldn't send that from here — opening your mail app instead.");
      window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    } catch {
      setState("error");
      setNote(`Something went wrong. Please email us at ${contact.email}.`);
    }
  };

  if (state === "sent") {
    return (
      <div className="form glass form--sent" role="status">
        <p className="form__tick" aria-hidden="true">
          ✓
        </p>
        <h3>Thank you — your enquiry is on its way.</h3>
        <p>We&apos;ll come back to you within one business day.</p>
        <button className="btn btn--primary" type="button" onClick={() => setState("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="form glass reveal" onSubmit={onSubmit}>
      <div className="form__row">
        <label>
          <span>Name</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <div className="form__row">
        <label>
          <span>Work email</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          <span>Service</span>
          <select name="service" defaultValue={services[0]}>
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>Project details</span>
        <textarea name="message" rows={4} required placeholder="Capacity, location, stage, what you need supported…" />
      </label>

      {/* honeypot: real people never fill this in */}
      <input name="website" tabIndex={-1} autoComplete="off" className="form__trap" aria-hidden="true" />

      <button className="btn btn--primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send enquiry"} <span aria-hidden="true">→</span>
      </button>

      {note && (
        <p className="form__note" role="alert">
          {note}
        </p>
      )}
    </form>
  );
}
