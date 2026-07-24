-- Real audit log — the Admin page previously showed hardcoded mock rows for
-- this even though nothing wrote to it. Org/profile update actions now
-- insert here (see src/app/(app)/admin/actions.ts).

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "Org members view and write audit log" on public.audit_log
  for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
