"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrg } from "@/lib/org-context";
import { hasPlanAccess, PLAN_LABEL, type SubscriptionPlan } from "@/lib/plan";

export function PlanGate({
  minPlan,
  moduleName,
  children,
}: {
  minPlan: SubscriptionPlan;
  moduleName: string;
  children: React.ReactNode;
}) {
  const org = useOrg();

  if (hasPlanAccess(org.plan, minPlan)) return <>{children}</>;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/50 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
        <Lock className="h-5 w-5" />
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold">{moduleName} requires {PLAN_LABEL[minPlan]}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your organization is on the {PLAN_LABEL[org.plan]} plan. Upgrade to unlock {moduleName.toLowerCase()}.
        </p>
      </div>
      <Button asChild className="bg-gradient-primary shadow-glow hover:opacity-90">
        <Link href="/pricing">View plans</Link>
      </Button>
    </div>
  );
}
