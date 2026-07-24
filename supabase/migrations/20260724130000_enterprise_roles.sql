-- Expand member_role with the enterprise role vocabulary. Existing values
-- (owner, admin, planner, cost_controller, site_engineer, viewer) are kept
-- as-is for backward compatibility with existing rows/policies; these are
-- additions, not renames.

alter type public.member_role add value if not exists 'developer';
alter type public.member_role add value if not exists 'platform_owner';
alter type public.member_role add value if not exists 'super_admin';
alter type public.member_role add value if not exists 'org_admin';
alter type public.member_role add value if not exists 'business_unit_admin';
alter type public.member_role add value if not exists 'project_admin';
alter type public.member_role add value if not exists 'planning_engineer';
alter type public.member_role add value if not exists 'senior_planning_engineer';
alter type public.member_role add value if not exists 'project_controls_manager';
alter type public.member_role add value if not exists 'project_manager';
alter type public.member_role add value if not exists 'construction_manager';
alter type public.member_role add value if not exists 'site_supervisor';
alter type public.member_role add value if not exists 'quantity_surveyor';
alter type public.member_role add value if not exists 'cost_engineer';
alter type public.member_role add value if not exists 'cost_control_manager';
alter type public.member_role add value if not exists 'procurement_engineer';
alter type public.member_role add value if not exists 'contracts_engineer';
alter type public.member_role add value if not exists 'commercial_manager';
alter type public.member_role add value if not exists 'qa_qc_engineer';
alter type public.member_role add value if not exists 'safety_engineer';
alter type public.member_role add value if not exists 'bim_engineer';
alter type public.member_role add value if not exists 'design_manager';
alter type public.member_role add value if not exists 'client';
alter type public.member_role add value if not exists 'consultant';
alter type public.member_role add value if not exists 'executive_management';
alter type public.member_role add value if not exists 'finance_team';
