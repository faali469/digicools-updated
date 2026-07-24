-- Point user-reference FKs at public.profiles instead of auth.users so
-- PostgREST can auto-detect embedded joins (e.g. `.select("*, profiles(full_name)")`).
-- profiles.id already 1:1-references auth.users(id), so referential integrity
-- is unchanged — this only helps schema introspection find the relationship.

alter table public.organization_members
  drop constraint organization_members_user_id_fkey,
  add constraint organization_members_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.project_members
  drop constraint project_members_user_id_fkey,
  add constraint project_members_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.import_jobs
  drop constraint import_jobs_uploaded_by_fkey,
  add constraint import_jobs_uploaded_by_fkey
    foreign key (uploaded_by) references public.profiles(id) on delete set null;

alter table public.daily_reports
  drop constraint daily_reports_created_by_fkey,
  add constraint daily_reports_created_by_fkey
    foreign key (created_by) references public.profiles(id) on delete set null;

alter table public.dashboards
  drop constraint dashboards_created_by_fkey,
  add constraint dashboards_created_by_fkey
    foreign key (created_by) references public.profiles(id) on delete set null;

alter table public.notifications
  drop constraint notifications_user_id_fkey,
  add constraint notifications_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.ai_copilot_messages
  drop constraint ai_copilot_messages_user_id_fkey,
  add constraint ai_copilot_messages_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;
