# Tests

Run with:

```bash
npm test
```

- `src/lib/audit.test.ts`: detects savings for oversized Cursor Business plans.
- `src/lib/audit.test.ts`: avoids fake savings when Copilot Business spend is already reasonable.
- `src/lib/audit.test.ts`: recommends API direct for data-heavy Claude seat spend.
- `src/lib/audit.test.ts`: flags audits over $500/month savings for Credex follow-up.
- `src/lib/audit.test.ts`: verifies totals across multiple tools.
