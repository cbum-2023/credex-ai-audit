import Anthropic from "@anthropic-ai/sdk";
import type { AuditResult } from "./types";

export async function generateSummary(audit: AuditResult) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return audit.fallbackSummary;

  try {
    const anthropic = new Anthropic({ apiKey: key });
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 180,
      temperature: 0.3,
      system:
        "You write concise finance-literate SaaS spend audit summaries. Be specific, sober, and never invent savings not in the JSON.",
      messages: [
        {
          role: "user",
          content: `Write one paragraph around 100 words for this AI spend audit. Mention Credex only if monthly savings exceed $500.\n${JSON.stringify(
            {
              useCase: audit.input.useCase,
              teamSize: audit.input.teamSize,
              monthlySavings: audit.totalMonthlySavings,
              annualSavings: audit.totalAnnualSavings,
              recommendations: audit.recommendations,
            },
          )}`,
        },
      ],
    });
    const text = message.content.find((item) => item.type === "text")?.text;
    return text || audit.fallbackSummary;
  } catch {
    return audit.fallbackSummary;
  }
}
