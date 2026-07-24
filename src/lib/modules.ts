import type { LucideIcon } from "lucide-react";
import type { SubscriptionPlan } from "@/lib/plan";
import {
  LayoutDashboard,
  Workflow,
  UploadCloud,
  LayoutGrid,
  Activity,
  TrendingUp,
  Ruler,
  ShoppingCart,
  HardHat,
  FileText,
  MessagesSquare,
  ShieldCheck,
  Plug,
} from "lucide-react";

export type ModuleDef = {
  slug: string;
  href: string;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  group: "Plan" | "Build" | "Control" | "Manage";
  minPlan: SubscriptionPlan;
};

export const MODULES: ModuleDef[] = [
  {
    slug: "dashboard",
    href: "/dashboard",
    name: "Executive Dashboard",
    shortName: "Dashboard",
    description: "Portfolio-wide KPIs — progress, cost, risk and delay in one view.",
    icon: LayoutDashboard,
    group: "Plan",
    minPlan: "starter",
  },
  {
    slug: "planning",
    href: "/planning",
    name: "Planning",
    shortName: "Planning",
    description: "WBS, activities, relationships, calendars, baselines and critical path.",
    icon: Workflow,
    group: "Plan",
    minPlan: "starter",
  },
  {
    slug: "imports",
    href: "/imports",
    name: "Schedule Imports",
    shortName: "Imports",
    description: "Upload Primavera P6 (.XER), MS Project (.MPP), Excel, CSV or XML.",
    icon: UploadCloud,
    group: "Plan",
    minPlan: "professional",
  },
  {
    slug: "dashboards",
    href: "/dashboards",
    name: "Dashboard Builder",
    shortName: "Dashboards",
    description: "Drag-and-drop widgets, AI-generated dashboards, Power BI-style reporting.",
    icon: LayoutGrid,
    group: "Plan",
    minPlan: "professional",
  },
  {
    slug: "schedule-analyzer",
    href: "/schedule-analyzer",
    name: "AI Schedule Analyzer",
    shortName: "Analyzer",
    description: "Missing logic, open ends, negative float and schedule health score.",
    icon: Activity,
    group: "Control",
    minPlan: "professional",
  },
  {
    slug: "controls",
    href: "/controls",
    name: "Project Controls",
    shortName: "Controls",
    description: "SPI, CPI, EVM, cashflow, forecast vs. budget vs. actual.",
    icon: TrendingUp,
    group: "Control",
    minPlan: "professional",
  },
  {
    slug: "qs",
    href: "/qs",
    name: "Quantity Surveying",
    shortName: "QS",
    description: "BOQ, measurements, running bills, variation orders.",
    icon: Ruler,
    group: "Control",
    minPlan: "professional",
  },
  {
    slug: "procurement",
    href: "/procurement",
    name: "Procurement",
    shortName: "Procurement",
    description: "Material requests, RFQs, purchase orders, vendor comparison.",
    icon: ShoppingCart,
    group: "Build",
    minPlan: "professional",
  },
  {
    slug: "site",
    href: "/site",
    name: "Site Execution",
    shortName: "Site",
    description: "Daily reports, photos, snag lists, inspections and checklists.",
    icon: HardHat,
    group: "Build",
    minPlan: "starter",
  },
  {
    slug: "reports",
    href: "/reports",
    name: "Reporting",
    shortName: "Reports",
    description: "Daily, weekly, monthly, client and delay reports — auto PDF/Excel.",
    icon: FileText,
    group: "Manage",
    minPlan: "starter",
  },
  {
    slug: "integrations",
    href: "/integrations",
    name: "Integration Hub",
    shortName: "Integrations",
    description: "Power BI, Primavera Cloud, ACC, Procore, SAP, SSO and more.",
    icon: Plug,
    group: "Manage",
    minPlan: "enterprise",
  },
  {
    slug: "collaboration",
    href: "/collaboration",
    name: "Collaboration",
    shortName: "Collaboration",
    description: "Comments, mentions, approvals and activity timeline.",
    icon: MessagesSquare,
    group: "Manage",
    minPlan: "starter",
  },
  {
    slug: "admin",
    href: "/admin",
    name: "Admin & Security",
    shortName: "Admin",
    description: "Roles, permissions, organizations, projects and audit log.",
    icon: ShieldCheck,
    group: "Manage",
    minPlan: "starter",
  },
];

export const MODULE_GROUPS = ["Plan", "Build", "Control", "Manage"] as const;
