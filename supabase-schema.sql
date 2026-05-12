create table if not exists audits (
  id text primary key,
  input jsonb not null,
  result jsonb not null,
  total_monthly_savings numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  audit_id text references audits(id) on delete set null,
  email text not null,
  company text,
  role text,
  team_size integer,
  total_monthly_savings numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table audits enable row level security;
alter table leads enable row level security;

create policy "Public audits are readable" on audits for select using (true);
