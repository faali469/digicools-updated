"use client";

import { TrendingDown, TrendingUp, DollarSign, Target } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { StatTile } from "@/components/app-shell/stat-tile";
import { TrendLine, TrendArea } from "@/components/app-shell/charts";
import { spiCpiTrend, cashflowTrend } from "@/lib/mock-data";

export default function ControlsPage() {
  return (
    <PlanGate minPlan="professional" moduleName="Project Controls">
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Project Controls" description="Earned value, cost and schedule performance across the portfolio." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="SPI" value="0.94" delta="-0.02" trend="down" icon={TrendingDown} />
        <StatTile label="CPI" value="0.89" delta="-0.04" trend="down" icon={TrendingUp} />
        <StatTile label="Budget at Completion" value="$18.4M" icon={DollarSign} />
        <StatTile label="Estimate at Completion" value="$20.1M" delta="+9.2%" trend="down" icon={Target} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">SPI / CPI trend</h3>
          <TrendLine
            data={spiCpiTrend}
            xKey="period"
            series={[
              { key: "spi", label: "SPI" },
              { key: "cpi", label: "CPI" },
            ]}
          />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Cashflow — planned vs. actual ($k)</h3>
          <TrendArea
            data={cashflowTrend}
            xKey="month"
            series={[
              { key: "planned", label: "Planned" },
              { key: "actual", label: "Actual" },
            ]}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Cost Variance</p>
          <p className="mt-2 font-display text-xl font-semibold text-destructive">-$1.7M</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Schedule Variance</p>
          <p className="mt-2 font-display text-xl font-semibold text-warning">-$620K</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm text-muted-foreground">Forecast at Completion (date)</p>
          <p className="mt-2 font-display text-xl font-semibold">Mar 14, 2027</p>
        </div>
      </div>
    </div>
    </PlanGate>
  );
}
