export type MemberRole =
  | "owner"
  | "admin"
  | "planner"
  | "cost_controller"
  | "site_engineer"
  | "viewer"
  | "developer"
  | "platform_owner"
  | "super_admin"
  | "org_admin"
  | "business_unit_admin"
  | "project_admin"
  | "planning_engineer"
  | "senior_planning_engineer"
  | "project_controls_manager"
  | "project_manager"
  | "construction_manager"
  | "site_supervisor"
  | "quantity_surveyor"
  | "cost_engineer"
  | "cost_control_manager"
  | "procurement_engineer"
  | "contracts_engineer"
  | "commercial_manager"
  | "qa_qc_engineer"
  | "safety_engineer"
  | "bim_engineer"
  | "design_manager"
  | "client"
  | "consultant"
  | "executive_management"
  | "finance_team";

export const ROLE_LABEL: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  planner: "Planner",
  cost_controller: "Cost Controller",
  site_engineer: "Site Engineer",
  viewer: "Read-only Viewer",
  developer: "Developer",
  platform_owner: "Platform Owner",
  super_admin: "Super Admin",
  org_admin: "Organization Admin",
  business_unit_admin: "Business Unit Admin",
  project_admin: "Project Admin",
  planning_engineer: "Planning Engineer",
  senior_planning_engineer: "Senior Planning Engineer",
  project_controls_manager: "Project Controls Manager",
  project_manager: "Project Manager",
  construction_manager: "Construction Manager",
  site_supervisor: "Site Supervisor",
  quantity_surveyor: "Quantity Surveyor",
  cost_engineer: "Cost Engineer",
  cost_control_manager: "Cost Control Manager",
  procurement_engineer: "Procurement Engineer",
  contracts_engineer: "Contracts Engineer",
  commercial_manager: "Commercial Manager",
  qa_qc_engineer: "QA/QC Engineer",
  safety_engineer: "Safety Engineer",
  bim_engineer: "BIM Engineer",
  design_manager: "Design Manager",
  client: "Client",
  consultant: "Consultant",
  executive_management: "Executive Management",
  finance_team: "Finance Team",
};

// Grouped for role-picker UIs — organization-level vs. project-functional vs. external.
export const ROLE_GROUPS: { label: string; roles: MemberRole[] }[] = [
  {
    label: "Organization",
    roles: ["owner", "platform_owner", "super_admin", "org_admin", "business_unit_admin", "admin"],
  },
  {
    label: "Project leadership",
    roles: ["project_admin", "project_manager", "construction_manager", "project_controls_manager"],
  },
  {
    label: "Planning & controls",
    roles: ["planning_engineer", "senior_planning_engineer", "planner", "cost_engineer", "cost_control_manager", "cost_controller"],
  },
  {
    label: "Site & QA",
    roles: ["site_engineer", "site_supervisor", "qa_qc_engineer", "safety_engineer"],
  },
  {
    label: "Commercial & procurement",
    roles: ["quantity_surveyor", "procurement_engineer", "contracts_engineer", "commercial_manager", "finance_team"],
  },
  {
    label: "Design & technical",
    roles: ["bim_engineer", "design_manager", "developer"],
  },
  {
    label: "External & executive",
    roles: ["client", "consultant", "executive_management", "viewer"],
  },
];
