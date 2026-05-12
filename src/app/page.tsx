import { AuditForm } from "@/components/audit/audit-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-100">
      <section className="bg-grid border-b border-stone-300">
        <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-800">StackTrim by Credex</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-stone-950 md:text-6xl">Find wasted AI spend</h1>
            <p className="mt-5 text-lg leading-8 text-stone-700">
              Audit Cursor, Claude, ChatGPT, Copilot, Gemini, API usage, and v0 in minutes. See plan-fit issues,
              cheaper alternatives, and discounted credit opportunities before the next invoice lands.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-8">
        <AuditForm />
      </section>
    </main>
  );
}
