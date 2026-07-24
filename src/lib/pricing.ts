export type PricingPlan = {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  priceNote: string;
  cta: string;
  ctaHref: string;
  highlighted?: boolean;
  features: string[];
};

// Reference points, not live billing — see the Pricing page for the
// "display only, no payment processing wired up" note.
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small teams getting projects onto one platform.",
    monthlyPrice: 49,
    annualPrice: 39,
    priceNote: "per user / month",
    cta: "Start free",
    ctaHref: "/signup",
    features: [
      "Up to 3 active projects",
      "WBS, activities, critical path",
      "Site execution — daily reports, snags",
      "Basic dashboards",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For contractors running full project controls.",
    monthlyPrice: 129,
    annualPrice: 99,
    priceNote: "per user / month",
    cta: "Start free",
    ctaHref: "/signup",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Unlimited projects",
      "Project controls — EVM, SPI/CPI, cashflow",
      "Quantity surveying & procurement",
      "AI Schedule Analyzer + AI Copilot",
      "P6 (.XER) / MS Project (.MPP) imports",
      "Dashboard Builder",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large contractors and developers at scale.",
    monthlyPrice: null,
    annualPrice: null,
    priceNote: "custom pricing",
    cta: "Contact sales",
    ctaHref: "mailto:sales@digicools.com",
    features: [
      "Everything in Professional",
      "Power BI Embedded & custom integrations",
      "Azure AD SSO",
      "Dedicated account manager",
      "Custom SLA & onboarding",
      "Advanced audit & security controls",
    ],
  },
];
