import { Resend } from "resend";
import type { AuditResult, LeadInput } from "./types";
import { currency } from "./utils";

export async function sendAuditEmail(lead: LeadInput, audit: AuditResult) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };

  const resend = new Resend(key);
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/audit/${audit.id}`;

  return resend.emails.send({
    from: process.env.RESEND_FROM || "Credex Audit <onboarding@resend.dev>",
    to: lead.email,
    subject:
      audit.totalMonthlySavings > 500
        ? `Your AI audit found ${currency(audit.totalMonthlySavings)}/mo in savings`
        : "Your AI spend audit is ready",
    html: `<p>Your StackTrim audit is ready.</p><p>Monthly savings: <strong>${currency(
      audit.totalMonthlySavings,
    )}</strong></p><p>Public report: <a href="${url}">${url}</a></p><p>${
      audit.totalMonthlySavings > 500
        ? "Credex can help capture more of this savings through discounted credits."
        : "We will notify you when new optimizations apply to your stack."
    }</p>`,
  });
}
