import { NextRequest, NextResponse } from "next/server";
import { runAudit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import { saveAudit } from "@/lib/storage";
import { auditInputSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`audit:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many audit attempts. Try again in a minute." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = auditInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const audit = await saveAudit(runAudit(parsed.data));
  return NextResponse.json(audit);
}
