-- Integration Hub — connection status per organization. Real table, real
-- RLS; the actual OAuth/API wiring for each provider is not implemented
-- (see src/lib/integrations.ts) since it needs each vendor's credentials.

create type public.integration_status as enum ('available', 'not_connected', 'coming_soon');

create table public.org_integrations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null,
  status public.integration_status not null default 'not_connected',
  connected_at timestamptz,
  connected_by uuid references public.profiles(id) on delete set null,
  config jsonb not null default '{}'::jsonb,
  unique (org_id, provider)
);

alter table public.org_integrations enable row level security;

create policy "Org members manage integrations" on public.org_integrations
  for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
