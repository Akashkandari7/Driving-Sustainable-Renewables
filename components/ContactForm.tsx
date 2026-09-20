"use client";

import { FormEvent } from "react";
import { contact } from "@/lib/content";

const services = ["Quality Assurance", "Energy Storage (BESS)", "Engineering", "Advisory / Due Diligence", "Digital Intelligence", "Other"];

// No backend yet: the form opens the visitor's mail app with the enquiry pre-filled.
export default function ContactForm() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = `Project enquiry — ${d.get("service")} — ${d.get("company") || d.get("name")}`;
    const body = [
      `Name: ${d.get("name")}`,
      `Company: ${d.get("company")}`,
      `Email: ${d.get("email")}`,
      `Service: ${d.get("service")}`,
      "",
      String(d.get("message")),
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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
        <textarea name="message" rows={4} required placeholder="Capacity, location, timeline, what you need verified…" />
      </label>
      <button className="btn btn--primary" type="submit">
        Send enquiry <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
