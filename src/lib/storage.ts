import { compactId } from "./utils";
import { getSupabaseAdmin } from "./supabase";
import type { AuditInput, AuditResult, LeadInput } from "./types";

const memoryAudits = new Map<string, AuditResult>();

export async function saveAudit(result: AuditResult) {
  const id = result.id || compactId();
  const payload = { ...result, id, createdAt: result.createdAt || new Date().toISOString() };
  const supabase = getSupabaseAdmin();

  if (supabase) {
    await supabase.from("audits").upsert({
      id,
      input: payload.input,
      result: payload,
      total_monthly_savings: payload.totalMonthlySavings,
    });
  } else {
    memoryAudits.set(id, payload);
  }

  return payload;
}

export async function getAudit(id: string) {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase.from("audits").select("result").eq("id", id).single();
    return (data?.result as AuditResult | undefined) || null;
  }
  return memoryAudits.get(id) || null;
}

export async function saveLead(auditId: string, lead: LeadInput, input: AuditInput, savings: number) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  await supabase.from("leads").insert({
    audit_id: auditId,
    email: lead.email,
    company: lead.company,
    role: lead.role,
    team_size: lead.teamSize || input.teamSize,
    total_monthly_savings: savings,
  });
}
