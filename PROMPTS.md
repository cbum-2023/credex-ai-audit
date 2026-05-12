# Prompts

## Anthropic Personalized Summary

System:

```text
You write concise and professional SaaS spend audit summaries. Be accurate, analytical, and never invent savings, pricing, or recommendations not present in the JSON.
```

User:

```text
You write concise and professional SaaS spend audit summaries. Be accurate, analytical, and never invent savings, pricing, or recommendations not present in the JSON.
<audit JSON>
```

I wrote the prompt this way so the LLM adds narrative clarity without owning the math. I tried asking for a sales-forward summary first, but it made the report feel less trustworthy for low-savings cases.
