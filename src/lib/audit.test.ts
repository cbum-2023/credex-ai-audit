import { describe, expect, it } from "vitest";
import { runAudit } from "./audit";
import type { AuditInput } from "./types";

function base(overrides: Partial<AuditInput> = {}): AuditInput {
  return {
    teamSize: 8,
    useCase: "coding",
    tools: [{ tool: "cursor", plan: "Business", monthlySpend: 320, seats: 8 }],
    ...overrides,
  };
}

describe("audit engine", () => {
  it("finds monthly and annual savings for oversized coding plans", () => {
    const audit = runAudit(base({ teamSize: 2, tools: [{ tool: "cursor", plan: "Business", monthlySpend: 80, seats: 2 }] }));
    expect(audit.totalMonthlySavings).toBe(40);
    expect(audit.totalAnnualSavings).toBe(480);
  });

  it("does not manufacture savings when spend is already reasonable", () => {
    const audit = runAudit(base({ tools: [{ tool: "github-copilot", plan: "Business", monthlySpend: 38, seats: 2 }] }));
    expect(audit.totalMonthlySavings).toBe(0);
    expect(audit.status).toBe("optimized");
  });

  it("recommends API direct for data-heavy Claude seat spend", () => {
    const audit = runAudit(
      base({
        useCase: "data",
        tools: [{ tool: "claude", plan: "Team", monthlySpend: 300, seats: 10 }],
      }),
    );
    expect(audit.recommendations[0].recommendedAction).toContain("API direct");
    expect(audit.totalMonthlySavings).toBeGreaterThan(200);
  });

  it("flags high-savings audits for Credex follow-up", () => {
    const audit = runAudit(
      base({
        teamSize: 30,
        tools: [{ tool: "v0", plan: "Business", monthlySpend: 3000, seats: 30 }],
      }),
    );
    expect(audit.highSavings).toBe(true);
    expect(audit.status).toBe("major");
  });

  it("calculates totals across multiple tools", () => {
    const audit = runAudit(
      base({
        teamSize: 3,
        tools: [
          { tool: "cursor", plan: "Business", monthlySpend: 120, seats: 3 },
          { tool: "gemini", plan: "Ultra", monthlySpend: 750, seats: 3 },
        ],
      }),
    );
    expect(audit.totalCurrentMonthly).toBe(870);
    expect(audit.totalRecommendedMonthly).toBe(audit.totalCurrentMonthly - audit.totalMonthlySavings);
  });
});
