import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/anthropic";
import { getAudit, saveAudit } from "@/lib/storage";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return NextResponse.json({ error: "Audit not found." }, { status: 404 });

  const aiSummary = await generateSummary(audit);
  const updated = await saveAudit({ ...audit, aiSummary });
  return NextResponse.json({ summary: updated.aiSummary || updated.fallbackSummary });
}
