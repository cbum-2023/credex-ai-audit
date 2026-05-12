# Prompts

## Anthropic Personalized Summary

System:

```text
You write concise finance-literate SaaS spend audit summaries. Be specific, sober, and never invent savings not in the JSON.
```

User:

```text
Write one paragraph around 100 words for this AI spend audit. Mention Credex only if monthly savings exceed $500.
<audit JSON>
```

I wrote the prompt this way so the LLM adds narrative clarity without owning the math. I tried asking for a sales-forward summary first, but it made the report feel less trustworthy for low-savings cases.
