import { NextResponse } from "next/server";

/**
 * Takes an enquiry from the contact form and delivers it, so the visitor never leaves the page.
 *
 * Delivery needs one of these set in the environment (Vercel → Settings → Environment Variables):
 *   WEB3FORMS_KEY  — free access key from web3forms.com, no card, arrives by email
 *   RESEND_API_KEY — resend.com key, with ENQUIRY_FROM set to a verified sender
 *
 * With neither, the route says so and the form falls back to the visitor's mail app.
 */

const TO = "info@dsrenewables.com";

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const company = (body.company || "").trim();
  const service = (body.service || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (body.website) {
    // honeypot: quietly accept and drop
    return NextResponse.json({ ok: true });
  }

  const subject = `Project enquiry — ${service || "General"} — ${company || name}`;
  const lines = [
    `Name: ${name}`,
    `Company: ${company || "—"}`,
    `Email: ${email}`,
    `Service: ${service || "—"}`,
    "",
    message,
  ].join("\n");

  const web3 = process.env.WEB3FORMS_KEY;
  if (web3) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3,
        subject,
        from_name: "DSR website",
        replyto: email,
        name,
        email,
        company,
        service,
        message,
      }),
    }).catch(() => null);

    if (res?.ok) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  const resend = process.env.RESEND_API_KEY;
  if (resend) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM || "DSR website <onboarding@resend.dev>",
        to: [TO],
        reply_to: email,
        subject,
        text: lines,
      }),
    }).catch(() => null);

    if (res?.ok) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
}
