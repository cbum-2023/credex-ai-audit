Data Flow

Users submit details such as tools used, monthly spend, team size, and use cases through the audit form. The backend validates the input using Zod, processes the data through the audit engine, and stores the generated report in Supabase. A unique report page is then created for each audit.

The report page can optionally generate an AI-based summary. If the AI service fails, the application falls back to a deterministic summary to ensure reliability.

Stack Choice

* Next.js handles frontend pages, API routes, and deployment in a single application.
* TypeScript + Zod provide type safety and request validation.
* Tailwind CSS enables fast and responsive UI development.
* Supabase is used for storing audit reports and lead information.
* Resend manages transactional emails.
* Vitest is used for testing core business and financial logic.

Scalability (10k+ Audits/Day)

To support high traffic and scale efficiently:

* Add rate limiting using Redis or Upstash
* Optimize database queries with indexes
* Cache public audit pages for faster load times
* Move email sending and AI summary generation to background jobs
* Version audit rules and pricing logic for consistency across old reports