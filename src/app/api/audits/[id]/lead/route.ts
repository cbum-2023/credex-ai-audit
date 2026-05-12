import { NextRequest, NextResponse } from "next/server";
import { sendAuditEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getAudit, saveLead } from "@/lib/storage";
import { leadSchema } from "@/lib/types";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`lead:${ip}`, 6, 60_000)) {
    return NextResponse.json({ error: "Too many lead submissions. Try again later." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success || parsed.data.website) {
    return NextResponse.json({ error: "Invalid lead payload." }, { status: 400 });
  }

  const audit = await getAudit(id);
  if (!audit) return NextResponse.json({ error: "Audit not found." }, { status: 404 });

  await saveLead(id, parsed.data, audit.input, audit.totalMonthlySavings);
  await sendAuditEmail(parsed.data, audit);
  return NextResponse.json({ ok: true });
}
