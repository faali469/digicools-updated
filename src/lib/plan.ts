export type SubscriptionPlan = "starter" | "professional" | "enterprise";

const PLAN_RANK: Record<SubscriptionPlan, number> = {
  starter: 0,
  professional: 1,
  enterprise: 2,
};

export function hasPlanAccess(orgPlan: SubscriptionPlan, minPlan: SubscriptionPlan): boolean {
  return PLAN_RANK[orgPlan] >= PLAN_RANK[minPlan];
}

export const PLAN_LABEL: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};
