import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePlans } from "@/hooks/useProducts";

export function PricingSection({ compact = false }: { compact?: boolean }) {
  const [yearly, setYearly] = useState(false);
  const { data: plans } = usePlans();

  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-3 text-muted-foreground">
          Start free, upgrade anytime. Cancel whenever you want.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border/60 bg-card p-1">
          <button
            onClick={() => setYearly(false)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              !yearly ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              yearly ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            Yearly <span className="ml-1 text-xs opacity-80">(save ~17%)</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {plans?.map((plan, i) => {
          const price = yearly ? plan.price_yearly : plan.price_monthly;
          const features = (plan.features as string[]) ?? [];
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1",
                plan.is_popular
                  ? "border-primary bg-card shadow-glow"
                  : "border-border/60 bg-card/60 hover:border-primary/40"
              )}
            >
              {plan.is_popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-glow flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">₹{price}</span>
                <span className="text-sm text-muted-foreground">/{yearly ? "year" : "month"}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "mt-8 w-full",
                  plan.is_popular ? "bg-gradient-primary shadow-glow hover:opacity-90" : ""
                )}
                variant={plan.is_popular ? "default" : "outline"}
                asChild
              >
                <Link to={`/checkout?plan=${plan.id}&cycle=${yearly ? "yearly" : "monthly"}`}>
                  {Number(price) === 0 ? "Get Started" : "Subscribe"}
                </Link>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {compact && (
        <div className="mt-10 text-center">
          <Button variant="ghost" asChild>
            <Link to="/pricing">See full plan comparison</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
