import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditReport } from "@/components/audit/audit-report";
import { Button } from "@/components/ui/button";
import { getAudit } from "@/lib/storage";
import { currency } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return {};
  const title = `${currency(audit.totalMonthlySavings)}/mo AI savings found`;
  const description = `StackTrim found ${currency(audit.totalAnnualSavings)} in annual AI spend savings.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) notFound();

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="text-sm font-bold text-teal-800">
          StackTrim
        </Link>
        <Button asChild variant="secondary" size="sm">
          <Link href="/">Run another audit</Link>
        </Button>
      </div>
      <AuditReport audit={audit} publicView />
    </main>
  );
}
