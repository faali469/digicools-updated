import Link from "next/link";
import { ArrowRight, Sparkles, FileUp, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuroraBackground } from "@/components/layout/AuroraBackground";
import { LogoWatermark } from "@/components/brand/logo-watermark";
import { MODULES } from "@/lib/modules";

const PILLARS = [
  {
    icon: FileUp,
    title: "Upload once",
    body: "Drop in a Primavera P6 (.XER), MS Project (.MPP), Excel or CSV schedule.",
  },
  {
    icon: Sparkles,
    title: "AI builds the project",
    body: "WBS, activities, relationships, calendars, critical path and dashboards — generated automatically.",
  },
  {
    icon: Gauge,
    title: "Run the whole business",
    body: "Controls, procurement, site execution and reporting, all connected to the same live schedule.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <LogoWatermark className="-right-24 -top-24 h-[560px] w-[560px] text-foreground md:h-[720px] md:w-[720px]" />
        <div className="container relative flex flex-col items-center py-28 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            The AI Construction Operating System
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Every construction project,
            <span className="text-gradient"> planned, controlled and built</span> in one platform.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Upload a schedule. DigiCools builds the WBS, critical path, dashboards, cashflow and
            risk register automatically — then runs planning, cost, procurement and site execution
            from the same live data.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-gradient-primary shadow-glow hover:opacity-90">
              <Link href="/signup">
                Start free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/30 py-20">
        <div className="container grid gap-8 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="glass-card rounded-2xl p-6">
              <pillar.icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="mb-2 font-display text-lg font-semibold">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-semibold">One platform, every module</h2>
            <p className="mt-3 text-muted-foreground">
              Planning, controls, quantity surveying, procurement, site execution and reporting —
              connected, not stitched together.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <div
                key={mod.slug}
                className="group rounded-2xl border border-border/60 bg-card/50 p-6 transition-colors hover:border-primary/40"
              >
                <mod.icon className="mb-3 h-5 w-5 text-primary" />
                <h3 className="font-display text-base font-semibold">{mod.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="border-t border-border/60 py-24">
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-3xl font-semibold">An AI Copilot on every screen</h2>
          <p className="max-w-2xl text-muted-foreground">
            Explain a delay, prepare a recovery schedule, forecast completion, or draft a client
            report — without leaving the page you&apos;re on.
          </p>
          <Button size="lg" asChild className="bg-gradient-primary shadow-glow hover:opacity-90">
            <Link href="/signup">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
