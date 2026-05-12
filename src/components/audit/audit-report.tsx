"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, ExternalLink, Mail, Share2, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuditResult } from "@/lib/types";
import { currency } from "@/lib/utils";

export function AuditReport({ audit, publicView = false }: { audit: AuditResult; publicView?: boolean }) {
  const [summary, setSummary] = useState(audit.aiSummary || audit.fallbackSummary);
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const shareUrl = `${typeof window === "undefined" ? "" : window.location.origin}/audit/${audit.id}`;

  useEffect(() => {
    if (!audit.id || audit.aiSummary) return;
    fetch(`/api/audits/${audit.id}/summary`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => data.summary && setSummary(data.summary))
      .catch(() => setSummary(audit.fallbackSummary));
  }, [audit]);

  async function captureLead(formData: FormData) {
    setLeadStatus("sending");
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch(`/api/audits/${audit.id}/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLeadStatus(res.ok ? "sent" : "error");
  }

  return (
    <section className="mx-auto max-w-6xl px-5 pb-12">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg bg-teal-800 p-6 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">AI spend audit</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">{currency(audit.totalMonthlySavings)}/mo</h1>
          <p className="mt-2 text-xl text-teal-50">{currency(audit.totalAnnualSavings)} potential annual savings</p>
          <p className="mt-5 max-w-2xl text-teal-50">{summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigator.clipboard?.writeText(shareUrl)}
              disabled={!audit.id}
              aria-label="Copy public report link"
            >
              <Share2 size={18} /> Share report
            </Button>
            {audit.highSavings ? (
              <Button asChild className="bg-yellow-400 text-stone-950 hover:bg-yellow-300">
                <a href={process.env.NEXT_PUBLIC_CREDEX_BOOKING_URL || "https://credex.rocks"} target="_blank">
                  <CalendarCheck size={18} /> Book Credex consult
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <Card className="p-5">
          <div className="flex items-center gap-2 text-teal-800">
            <TrendingDown size={20} />
            <h2 className="text-lg font-bold">Spend snapshot</h2>
          </div>
          <dl className="mt-5 space-y-4">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-600">Current monthly</dt>
              <dd className="font-bold">{currency(audit.totalCurrentMonthly)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-600">Recommended monthly</dt>
              <dd className="font-bold">{currency(audit.totalRecommendedMonthly)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-600">Savings rate</dt>
              <dd className="font-bold">{Math.round(audit.savingsRate * 100)}%</dd>
            </div>
          </dl>
          <p className="mt-5 rounded-md bg-stone-100 p-3 text-sm text-stone-700">
            {audit.totalMonthlySavings < 100
              ? "You are spending well. Capture the report and we will flag future pricing changes."
              : audit.highSavings
                ? "This is large enough to justify a procurement conversation with Credex."
                : "These savings are meaningful, but the best moves avoid disrupting active workflows."}
          </p>
        </Card>
      </div>

      <div className="mt-5 grid gap-4">
        {audit.recommendations.map((item) => (
          <Card key={`${item.tool}-${item.currentPlan}`} className="p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_0.5fr] md:items-center">
              <div>
                <p className="text-sm text-stone-500">{item.toolName}</p>
                <h3 className="text-xl font-bold">{item.currentPlan}</h3>
                <p className="mt-2 text-sm text-stone-600">{item.reason}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-500">Recommended action</p>
                <p className="mt-1 font-bold text-teal-800">{item.recommendedAction}</p>
              </div>
              <div className="rounded-md bg-stone-100 p-3 text-right">
                <p className="text-sm text-stone-500">{currency(item.currentSpend)} to {currency(item.recommendedSpend)}</p>
                <p className="text-2xl font-bold">{currency(item.monthlySavings)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!publicView ? (
        <Card className="mt-5 p-5">
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-teal-800" />
            <h2 className="text-lg font-bold">Capture this report</h2>
          </div>
          <form action={captureLead} className="mt-4 grid gap-3 md:grid-cols-4">
            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@company.com" />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" placeholder="Acme AI" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" placeholder="Founder" />
            </div>
            <div className="flex items-end">
              <Button className="w-full" disabled={leadStatus === "sending"}>
                {leadStatus === "sent" ? <CheckCircle2 size={18} /> : <ExternalLink size={18} />}
                {leadStatus === "sent" ? "Sent" : "Email report"}
              </Button>
            </div>
          </form>
          {leadStatus === "error" ? <p className="mt-3 text-sm text-red-700">Could not save the lead. Check env vars and try again.</p> : null}
        </Card>
      ) : null}
    </section>
  );
}
