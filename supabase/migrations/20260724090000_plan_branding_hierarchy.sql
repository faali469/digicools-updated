-- Subscription plan + org branding, and multi-level project hierarchy.

create type public.subscription_plan as enum ('starter', 'professional', 'enterprise');

alter table public.organizations
  add column plan public.subscription_plan not null default 'starter',
  add column logo_url text,
  add column brand_color text not null default '#5B5FEF';

alter table public.projects
  add column parent_project_id uuid references public.projects(id) on delete set null;

-- Org owners/admins can update their own organization's branding/plan.
-- (plan is admin-editable here since there's no live billing yet — see
-- src/app/(app)/admin/page.tsx for the UI and its "not wired to real
-- billing" note.)
create policy "Org admins update organization" on public.organizations
  for update using (
    exists (
      select 1 from public.organization_members om
      where om.org_id = organizations.id
        and om.user_id = auth.uid()
        and om.role in ('owner', 'admin')
    )
  );
