import { pricing, toolNames, type Plan } from "./pricing";
import type { AuditInput, AuditResult, Recommendation, ToolInput } from "./types";

function planCost(plan: Plan, seats: number) {
  return plan.perSeat ? plan.monthly * seats : plan.monthly;
}

function findPlan(tool: ToolInput) {
  const plans = pricing[tool.tool];
  return plans.find((plan) => plan.name.toLowerCase() === tool.plan.toLowerCase()) || plans[0];
}

function bestSameVendorPlan(tool: ToolInput, teamSize: number, useCase: AuditInput["useCase"], currentSpend: number) {
  const plans = pricing[tool.tool].filter((plan) => (plan.minSeats || 1) <= teamSize && (currentSpend === 0 || plan.monthly > 0));
  const suitable = plans.filter((plan) => plan.bestFor.includes(useCase) || plan.bestFor.includes("mixed"));
  return (suitable.length ? suitable : plans).sort((a, b) => planCost(a, tool.seats) - planCost(b, tool.seats))[0];
}

function alternativeFor(tool: ToolInput, input: AuditInput): { action: string; spend: number; reason: string } | null {
  const seats = Math.min(tool.seats, input.teamSize);
  if (input.useCase === "coding") {
    if (tool.tool === "cursor" && tool.plan !== "Pro" && seats <= 2) {
      return { action: "downgrade to Cursor Pro", spend: 20 * seats, reason: "Pro covers individual coding without team admin overhead." };
    }
    if (tool.tool === "v0" && tool.plan === "Business" && seats < 10) {
      return { action: "move v0 users to Team", spend: 30 * seats, reason: "Business controls are usually premature below 10 builders." };
    }
  }
  if (input.useCase === "research" && tool.tool === "gemini" && tool.plan === "Ultra") {
    return { action: "downgrade Gemini Ultra to Pro", spend: 19.99 * seats, reason: "Ultra is hard to justify unless Deep Think/video limits are used daily." };
  }
  if (input.useCase === "data" && (tool.tool === "chatgpt" || tool.tool === "claude") && tool.plan !== "API direct") {
    return { action: `use ${toolNames[tool.tool]} API direct`, spend: 45, reason: "Data workflows are often cheaper as metered API usage than full seats." };
  }
  return null;
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: Recommendation[] = input.tools.map((tool) => {
    const actual = findPlan(tool);
    const currentSpend = tool.monthlySpend || planCost(actual, tool.seats);
    const sameVendor = bestSameVendorPlan(tool, input.teamSize, input.useCase, currentSpend);
    const sameVendorSpend = planCost(sameVendor, tool.seats);
    const alternative = alternativeFor(tool, input);
    const creditDiscountSpend = currentSpend * 0.72;

    const options = [
      {
        action: `switch to ${sameVendor.name}`,
        spend: sameVendorSpend,
        reason: `${sameVendor.name} is the lowest fitting ${toolNames[tool.tool]} plan for ${input.teamSize} people and ${input.useCase} work.`,
      },
      alternative,
      {
        action: "source equivalent spend through discounted credits",
        spend: creditDiscountSpend,
        reason: "Credex-style credits can capture savings without changing tools when usage is already a fit.",
      },
    ].filter(Boolean) as { action: string; spend: number; reason: string }[];

    const best = options.sort((a, b) => a.spend - b.spend)[0];
    const monthlySavings = Math.max(0, Math.round(currentSpend - best.spend));
    const isOptimal = monthlySavings < Math.max(25, currentSpend * 0.08);

    return {
      tool: tool.tool,
      toolName: toolNames[tool.tool],
      currentPlan: tool.plan,
      currentSpend: Math.round(currentSpend),
      recommendedAction: isOptimal ? "keep current setup" : best.action,
      recommendedSpend: isOptimal ? Math.round(currentSpend) : Math.round(best.spend),
      monthlySavings: isOptimal ? 0 : monthlySavings,
      annualSavings: isOptimal ? 0 : monthlySavings * 12,
      reason: isOptimal ? "Your current spend is within a reasonable band for the declared use case." : best.reason,
      severity: monthlySavings >= 500 ? "high" : monthlySavings > 0 ? "watch" : "ok",
    };
  });

  const totalCurrentMonthly = recommendations.reduce((sum, item) => sum + item.currentSpend, 0);
  const totalMonthlySavings = recommendations.reduce((sum, item) => sum + item.monthlySavings, 0);
  const totalRecommendedMonthly = Math.max(0, totalCurrentMonthly - totalMonthlySavings);
  const savingsRate = totalCurrentMonthly ? totalMonthlySavings / totalCurrentMonthly : 0;
  const status =
    totalMonthlySavings >= 500 ? "major" : totalMonthlySavings >= 100 ? "meaningful" : totalMonthlySavings > 0 ? "minor" : "optimized";

  return {
    input,
    recommendations,
    totalCurrentMonthly,
    totalRecommendedMonthly,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    savingsRate,
    highSavings: totalMonthlySavings > 500,
    status,
    fallbackSummary:
      totalMonthlySavings > 0
        ? `Your AI stack has roughly $${totalMonthlySavings.toLocaleString()} in monthly savings available. The biggest wins come from matching plan level to seat count, moving data-heavy work to API pricing, and using discounted credits where switching tools would create churn.`
        : "Your AI stack looks disciplined for the declared team size and use case. The best next move is to monitor pricing changes and new credit opportunities rather than forcing a downgrade that could slow the team down.",
  };
}
