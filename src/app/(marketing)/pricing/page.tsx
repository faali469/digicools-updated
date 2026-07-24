"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/pricing";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Simple, transparent pricing
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Pricing that scales with your projects
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free, upgrade when your portfolio grows. No setup fees, cancel anytime.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-sm", !annual && "font-medium text-foreground")}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
          <span className={cn("text-sm", annual && "font-medium text-foreground")}>
            Annual <span className="text-primary">(save ~20%)</span>
          </span>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8",
                plan.highlighted
                  ? "border-primary/50 bg-card shadow-elegant"
                  : "border-border/60 bg-card/50"
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-8 bg-gradient-primary text-primary-foreground shadow-glow">
                  Most popular
                </Badge>
              )}
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                {price !== null ? (
                  <>
                    <span className="font-display text-4xl font-semibold">${price}</span>
                    <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                  </>
                ) : (
                  <span className="font-display text-4xl font-semibold">Custom</span>
                )}
              </div>

              <Button
                asChild
                className={cn(
                  "mt-6 w-full",
                  plan.highlighted
                    ? "bg-gradient-primary shadow-glow hover:opacity-90"
                    : ""
                )}
                variant={plan.highlighted ? "default" : "outline"}
              >
                <Link href={plan.ctaHref}>{plan.cta}</Link>
              </Button>

              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
        Prices shown are indicative, not live billing — this build doesn&apos;t process real
        payments yet. Starter and Professional plans are self-serve; Enterprise is a custom quote.
      </p>
    </div>
  );
}
