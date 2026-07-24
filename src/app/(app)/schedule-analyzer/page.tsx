"use client";

import { AlertTriangle, AlertOctagon, CheckCircle2, Gauge } from "lucide-react";
import { PageHeader, StubBadge } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { scheduleHealthChecks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const severityStyle = {
  good: { icon: CheckCircle2, className: "text-success" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  critical: { icon: AlertOctagon, className: "text-destructive" },
};

export default function ScheduleAnalyzerPage() {
  const score = 78;

  return (
    <PlanGate minPlan="professional" moduleName="AI Schedule Analyzer">
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="AI Schedule Analyzer"
        description="Automatic logic, float and constraint checks with a schedule health score."
        actions={<StubBadge>Heuristic scoring — full DCMA 14-point check coming later</StubBadge>}
      />

      <div className="glass-card mb-4 flex items-center gap-6 rounded-2xl p-6">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <span className="font-display text-2xl font-bold text-primary-foreground">{score}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            <h3 className="font-display text-lg font-semibold">Schedule Health Score</h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Meridian Tower — Phase 2. Cost and negative float are the biggest risks to the current
            finish date — see recommendations below.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="mb-4 font-display text-sm font-semibold">Checks</h3>
        <div className="divide-y divide-border/60">
          {scheduleHealthChecks.map((c) => {
            const { icon: Icon, className } = severityStyle[c.severity];
            return (
              <div key={c.label} className="flex items-center justify-between py-3 text-sm">
                <div className="flex items-center gap-2.5">
                  <Icon className={cn("h-4 w-4", className)} />
                  <span>{c.label}</span>
                </div>
                <span className={cn("font-mono text-xs font-medium", className)}>{c.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 glass-card rounded-2xl p-5">
        <h3 className="mb-2 font-display text-sm font-semibold">AI recommendations</h3>
        <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
          <li>Add a successor to Foundation activities A-1140 and A-1142 to close open ends.</li>
          <li>Review negative-float activities on the MEP rough-in path — 2 days of recovery needed.</li>
          <li>Constraint on A-1220 (&ldquo;Must Finish On&rdquo;) conflicts with baseline B2 — confirm intent.</li>
        </ul>
      </div>
    </div>
    </PlanGate>
  );
}
