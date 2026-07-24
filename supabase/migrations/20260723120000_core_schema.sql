-- DigiLooks AI — core skeleton schema.
-- Minimal, no deep business rules yet. Extend alongside real module logic.

create extension if not exists "pgcrypto";

create type public.member_role as enum (
  'owner',
  'admin',
  'planner',
  'cost_controller',
  'site_engineer',
  'viewer'
);

-- ---------------------------------------------------------------------------
-- Organizations & people
-- ---------------------------------------------------------------------------

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Planning
-- ---------------------------------------------------------------------------

create table public.calendars (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  is_default boolean not null default false
);

create table public.wbs_nodes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_id uuid references public.wbs_nodes(id) on delete cascade,
  code text not null,
  name text not null,
  sort_order integer not null default 0
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  wbs_id uuid references public.wbs_nodes(id) on delete set null,
  calendar_id uuid references public.calendars(id) on delete set null,
  code text not null,
  name text not null,
  start_date date,
  finish_date date,
  duration_days numeric,
  percent_complete numeric not null default 0,
  total_float_days numeric,
  is_critical boolean not null default false
);

create table public.activity_relationships (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  predecessor_id uuid not null references public.activities(id) on delete cascade,
  successor_id uuid not null references public.activities(id) on delete cascade,
  relationship_type text not null default 'FS',
  lag_days numeric not null default 0
);

create table public.baselines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null default 'labor',
  unit_cost numeric
);

-- Uploaded schedule files (.xer / .mpp / .xlsx / .csv / .xml).
-- Parsing is stubbed — rows are created with status 'stubbed' and the UI
-- falls back to sample activity data. Real parsing lands per-format later.
create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  file_name text not null,
  file_type text not null,
  status text not null default 'stubbed',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Quantity surveying & procurement
-- ---------------------------------------------------------------------------

create table public.boq_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  code text not null,
  description text not null,
  unit text not null,
  quantity numeric not null default 0,
  rate numeric not null default 0,
  percent_billed numeric not null default 0
);

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text,
  rating numeric
);

create table public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  item text not null,
  value numeric not null default 0,
  status text not null default 'on_time',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Site execution
-- ---------------------------------------------------------------------------

create table public.daily_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  report_date date not null,
  crew_count integer not null default 0,
  weather text,
  incident_count integer not null default 0,
  created_by uuid references auth.users(id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Dashboard builder
-- ---------------------------------------------------------------------------

create table public.dashboards (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  dashboard_id uuid not null references public.dashboards(id) on delete cascade,
  type text not null,
  title text not null,
  config jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Notifications & AI copilot
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_name text,
  action text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.ai_copilot_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  module text,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.organization_members
    where org_id = target_org_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_project_member(target_project_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.project_members
    where project_id = target_project_id and user_id = auth.uid()
  ) or exists (
    select 1
    from public.projects p
    join public.organization_members om on om.org_id = p.org_id
    where p.id = target_project_id and om.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- New user bootstrap: profile + personal organization + owner membership
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.organizations (name)
  values (coalesce(new.raw_user_meta_data ->> 'org_name', 'My Organization'))
  returning id into new_org_id;

  insert into public.organization_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.calendars enable row level security;
alter table public.wbs_nodes enable row level security;
alter table public.activities enable row level security;
alter table public.activity_relationships enable row level security;
alter table public.baselines enable row level security;
alter table public.resources enable row level security;
alter table public.import_jobs enable row level security;
alter table public.boq_items enable row level security;
alter table public.vendors enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.daily_reports enable row level security;
alter table public.dashboards enable row level security;
alter table public.dashboard_widgets enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_copilot_messages enable row level security;

create policy "Members view their organizations" on public.organizations
  for select using (public.is_org_member(id));

create policy "Users view their own profile" on public.profiles
  for select using (id = auth.uid());
create policy "Users update their own profile" on public.profiles
  for update using (id = auth.uid());

create policy "Members view org membership" on public.organization_members
  for select using (public.is_org_member(org_id));

create policy "Members view their projects" on public.projects
  for select using (public.is_org_member(org_id));
create policy "Org admins manage projects" on public.projects
  for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

create policy "Members view project membership" on public.project_members
  for select using (public.is_project_member(project_id));

-- Project-scoped planning/controls/procurement/site tables share one shape.
create policy "Project members view calendars" on public.calendars
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view wbs" on public.wbs_nodes
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view activities" on public.activities
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view relationships" on public.activity_relationships
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view baselines" on public.baselines
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view resources" on public.resources
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view import jobs" on public.import_jobs
  for all using (project_id is null or public.is_project_member(project_id))
  with check (project_id is null or public.is_project_member(project_id));
create policy "Project members view boq" on public.boq_items
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Org members view vendors" on public.vendors
  for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy "Project members view purchase orders" on public.purchase_orders
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Project members view daily reports" on public.daily_reports
  for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "Org members view dashboards" on public.dashboards
  for all using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));
create policy "Dashboard owners manage widgets" on public.dashboard_widgets
  for all using (
    exists (select 1 from public.dashboards d where d.id = dashboard_id and public.is_org_member(d.org_id))
  ) with check (
    exists (select 1 from public.dashboards d where d.id = dashboard_id and public.is_org_member(d.org_id))
  );

create policy "Users view their own notifications" on public.notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Users view their own copilot messages" on public.ai_copilot_messages
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
