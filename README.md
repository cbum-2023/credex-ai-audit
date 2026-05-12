# Credex AI Audit

Credex AI Audit is a Next.js app for auditing AI tool spend across Cursor, Copilot, Claude, ChatGPT, Gemini, v0, and API usage. It helps founders and engineering teams find plan-fit issues, downgrade opportunities, duplicate seats, and potential discounted credit paths, then generates a shareable public savings report.

Live app: https://credex-ai-spend-audit-mocha.vercel.app

## Features

- Multi-tool AI spend audit form with validation
- Deterministic savings engine for debuggable recommendations
- Public audit report pages that exclude private company and email data
- Optional Anthropic-generated summary with a deterministic fallback
- Supabase-backed audit and lead storage
- Resend-powered lead follow-up email flow
- Basic rate limiting and honeypot protection for the MVP surface

## Tech Stack

- Next.js 16 and React 19
- TypeScript
- Tailwind CSS
- Supabase
- Anthropic SDK
- Resend
- Vitest

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

## Environment

Create the Supabase tables with `supabase-schema.sql`, then add the required keys to `.env.local`.

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
```

Use the same environment variables when deploying to Vercel.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
```

## Project Notes

- See `ARCHITECTURE.md` for the system flow and scaling notes.
- See `PRICING_DATA.md` for audit pricing assumptions.
- See `METRICS.md`, `ECONOMICS.md`, and `GTM.md` for product and business context.
- See `TESTS.md` for the current testing approach.

## Product Decisions

- Email capture happens after the audit result so users get value before lead capture.
- The core audit math is deterministic TypeScript because pricing recommendations must be explainable.
- Anthropic is used only for the personalized report summary.
- Public reports strip company and email data from the shareable URL.
