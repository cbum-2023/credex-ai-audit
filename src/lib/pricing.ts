import type { ToolId, UseCase } from "./types";

export type Plan = {
  name: string;
  monthly: number;
  perSeat: boolean;
  minSeats?: number;
  bestFor: UseCase[];
  notes: string;
};

export const toolNames: Record<ToolId, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  v0: "v0",
};

export const pricing: Record<ToolId, Plan[]> = {
  cursor: [
    { name: "Hobby", monthly: 0, perSeat: true, bestFor: ["coding"], notes: "Limited personal coding." },
    { name: "Pro", monthly: 20, perSeat: true, bestFor: ["coding"], notes: "Best default for individual developers." },
    { name: "Business", monthly: 40, perSeat: true, minSeats: 3, bestFor: ["coding"], notes: "Admin controls and team billing." },
    { name: "Enterprise", monthly: 80, perSeat: true, minSeats: 25, bestFor: ["coding"], notes: "Assumed floor for custom enterprise packaging." },
  ],
  "github-copilot": [
    { name: "Individual", monthly: 10, perSeat: true, bestFor: ["coding"], notes: "Individual coding assistant." },
    { name: "Business", monthly: 19, perSeat: true, minSeats: 2, bestFor: ["coding"], notes: "Org policy controls." },
    { name: "Enterprise", monthly: 39, perSeat: true, minSeats: 25, bestFor: ["coding"], notes: "GitHub.com customization and enterprise controls." },
  ],
  claude: [
    { name: "Free", monthly: 0, perSeat: true, bestFor: ["writing", "research"], notes: "Light usage only." },
    { name: "Pro", monthly: 20, perSeat: true, bestFor: ["writing", "research", "mixed"], notes: "Best default for regular individual use." },
    { name: "Max", monthly: 100, perSeat: true, bestFor: ["research", "mixed"], notes: "Heavy daily usage." },
    { name: "Team", monthly: 30, perSeat: true, minSeats: 5, bestFor: ["writing", "research", "mixed"], notes: "Team collaboration and admin." },
    { name: "Enterprise", monthly: 60, perSeat: true, minSeats: 25, bestFor: ["mixed"], notes: "Estimated custom enterprise floor." },
    { name: "API direct", monthly: 45, perSeat: false, bestFor: ["data", "mixed"], notes: "Usage-based estimate for token workflows." },
  ],
  chatgpt: [
    { name: "Plus", monthly: 20, perSeat: true, bestFor: ["writing", "research", "mixed"], notes: "Individual productivity." },
    { name: "Team", monthly: 30, perSeat: true, minSeats: 2, bestFor: ["writing", "research", "mixed", "data"], notes: "Shared workspace and admin." },
    { name: "Enterprise", monthly: 60, perSeat: true, minSeats: 25, bestFor: ["mixed"], notes: "Estimated custom enterprise floor." },
    { name: "API direct", monthly: 45, perSeat: false, bestFor: ["data", "mixed"], notes: "Usage-based estimate for product/API workflows." },
  ],
  "anthropic-api": [
    { name: "API direct", monthly: 45, perSeat: false, bestFor: ["data", "mixed", "research"], notes: "Sonnet-class API usage estimate." },
  ],
  "openai-api": [
    { name: "API direct", monthly: 45, perSeat: false, bestFor: ["data", "mixed"], notes: "GPT mini/large blended usage estimate." },
  ],
  gemini: [
    { name: "Pro", monthly: 19.99, perSeat: true, bestFor: ["research", "mixed", "data"], notes: "Individual Google AI Pro." },
    { name: "Ultra", monthly: 249.99, perSeat: true, bestFor: ["research"], notes: "Highest limits; rarely efficient for teams." },
    { name: "API", monthly: 30, perSeat: false, bestFor: ["data", "mixed"], notes: "Gemini API usage estimate." },
  ],
  v0: [
    { name: "Free", monthly: 0, perSeat: true, bestFor: ["coding"], notes: "Limited daily prototyping." },
    { name: "Premium", monthly: 20, perSeat: true, bestFor: ["coding"], notes: "Individual app generation." },
    { name: "Team", monthly: 30, perSeat: true, minSeats: 2, bestFor: ["coding"], notes: "Collaboration and centralized billing." },
    { name: "Business", monthly: 100, perSeat: true, minSeats: 10, bestFor: ["coding"], notes: "Training opt-out and business controls." },
    { name: "Enterprise", monthly: 150, perSeat: true, minSeats: 25, bestFor: ["coding"], notes: "Estimated custom enterprise floor." },
  ],
};

export const plansByTool = Object.fromEntries(
  Object.entries(pricing).map(([tool, plans]) => [tool, plans.map((plan) => plan.name)]),
) as Record<ToolId, string[]>;
