"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, WandSparkles } from "lucide-react";
import { AuditReport } from "./audit-report";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { plansByTool, toolNames } from "@/lib/pricing";
import { auditInputSchema, tools, useCases, type AuditInput, type AuditResult } from "@/lib/types";

const defaultValues: AuditInput = {
  teamSize: 8,
  useCase: "coding",
  tools: [
    { tool: "cursor", plan: "Business", monthlySpend: 320, seats: 8 },
    { tool: "chatgpt", plan: "Team", monthlySpend: 240, seats: 8 },
  ],
};

export function AuditForm() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<AuditInput>({
    resolver: zodResolver(auditInputSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "tools" });
  const watched = useWatch({ control: form.control });
  const serialized = useMemo(() => JSON.stringify(watched), [watched]);

  useEffect(() => {
    const saved = localStorage.getItem("stacktrim-audit-form");
    if (saved) form.reset(JSON.parse(saved));
  }, [form]);

  useEffect(() => {
    localStorage.setItem("stacktrim-audit-form", serialized);
  }, [serialized]);

  async function submit(values: AuditInput) {
    setLoading(true);
    const res = await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setResult(data);
  }

  return (
    <div className="grid gap-6">
      <Card className="p-5">
        <form onSubmit={form.handleSubmit(submit)} className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="teamSize">Team size</Label>
              <Input id="teamSize" type="number" min="1" {...form.register("teamSize", { valueAsNumber: true })} />
            </div>
            <div>
              <Label htmlFor="useCase">Primary use case</Label>
              <select
                id="useCase"
                className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
                {...form.register("useCase")}
              >
                {useCases.map((useCase) => (
                  <option key={useCase} value={useCase}>
                    {useCase}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3">
            {fields.map((field, index) => {
              const selectedTool = watched.tools?.[index]?.tool || "cursor";
              return (
                <div key={field.id} className="grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto]">
                  <div>
                    <Label>Tool</Label>
                    <select className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm" {...form.register(`tools.${index}.tool`)}>
                      {tools.map((tool) => (
                        <option key={tool} value={tool}>
                          {toolNames[tool]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Plan</Label>
                    <select className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm" {...form.register(`tools.${index}.plan`)}>
                      {plansByTool[selectedTool].map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Monthly spend</Label>
                    <Input type="number" min="0" {...form.register(`tools.${index}.monthlySpend`, { valueAsNumber: true })} />
                  </div>
                  <div>
                    <Label>Seats</Label>
                    <Input type="number" min="1" {...form.register(`tools.${index}.seats`, { valueAsNumber: true })} />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove tool">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <Button type="button" variant="secondary" onClick={() => append({ tool: "github-copilot", plan: "Business", monthlySpend: 152, seats: 8 })}>
              <Plus size={18} /> Add tool
            </Button>
            <Button type="submit" size="lg" disabled={loading}>
              <WandSparkles size={18} /> {loading ? "Auditing..." : "Run free audit"}
            </Button>
          </div>
        </form>
      </Card>
      {result ? <AuditReport audit={result} /> : null}
    </div>
  );
}
