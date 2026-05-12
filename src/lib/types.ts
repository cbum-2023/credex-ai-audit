import { z } from "zod";

export const tools = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "v0",
] as const;

export const useCases = ["coding", "writing", "data", "research", "mixed"] as const;

export type ToolId = (typeof tools)[number];
export type UseCase = (typeof useCases)[number];

export const toolInputSchema = z.object({
  tool: z.enum(tools),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0).max(250000),
  seats: z.number().int().min(1).max(5000),
});

export const auditInputSchema = z.object({
  teamSize: z.number().int().min(1).max(5000),
  useCase: z.enum(useCases),
  tools: z.array(toolInputSchema).min(1).max(12),
});

export const leadSchema = z.object({
  email: z.string().email(),
  company: z.string().max(120).optional().default(""),
  role: z.string().max(120).optional().default(""),
  teamSize: z.coerce.number().int().min(1).max(5000).optional(),
  website: z.string().max(0).optional().default(""),
});

export type ToolInput = z.infer<typeof toolInputSchema>;
export type AuditInput = z.infer<typeof auditInputSchema>;
export type LeadInput = z.infer<typeof leadSchema>;

export type Recommendation = {
  tool: ToolId;
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: "ok" | "watch" | "high";
};

export type AuditResult = {
  id?: string;
  input: AuditInput;
  recommendations: Recommendation[];
  totalCurrentMonthly: number;
  totalRecommendedMonthly: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsRate: number;
  highSavings: boolean;
  status: "optimized" | "minor" | "meaningful" | "major";
  fallbackSummary: string;
  aiSummary?: string;
  createdAt?: string;
};
