"use client";

import {
  Clock,
  DollarSign,
  Target,
  Wallet,
  Users,
  ShieldCheck,
  ListChecks,
  Cloud,
  Wind,
  Droplets,
} from "lucide-react";
import { ProjectContextBar } from "@/components/app-shell/project-context-bar";
import { TrendLine, CashflowChart, DonutChart } from "@/components/app-shell/charts";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  projectOverview,
  execKpis,
  sCurve,
  evmTrend,
  criticalActivitiesFull,
  lookAhead,
  manpowerDistribution,
  costSummary,
  cashflowForecast,
  procurementStatus,
  materialStatus,
  riskSummary,
  recentIssues,
  recentDocuments,
  milestonesTable,
  liveNotifications,
} from "@/lib/executive-dashboard-data";

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass-card rounded-2xl p-5", className)}>{children}</div>;
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {children}
      </h3>
      {action}
    </div>
  );
}

const activityStatusVariant: Record<string, "destructive" | "outline"> = {
  Critical: "destructive",
  "Near Critical": "outline",
};

const issueStatusVariant: Record<string, "destructive" | "secondary" | "outline"> = {
  Open: "destructive",
  "In Progress": "outline",
  Closed: "secondary",
};

const milestoneStatusVariant: Record<string, "secondary" | "destructive"> = {
  Achieved: "secondary",
  "At Risk": "destructive",
};

export default function DashboardPage() {
  const k = execKpis;

  return (
    <div className="-m-4 md:-m-6">
      <ProjectContextBar />

      <div className="space-y-4 p-4 md:p-6">
        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          <Card>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>TIME PERFORMANCE</span>
              <Clock className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">{k.timePerformance.percent}%</p>
            <p className="text-xs text-muted-foreground">SPI: {k.timePerformance.spi}</p>
            <p className="mt-1 text-xs font-medium text-destructive">{k.timePerformance.trend}</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>COST PERFORMANCE</span>
              <DollarSign className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">{k.costPerformance.percent}%</p>
            <p className="text-xs text-muted-foreground">CPI: {k.costPerformance.cpi}</p>
            <p className="mt-1 text-xs font-medium text-success">{k.costPerformance.trend}</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>PHYSICAL PROGRESS</span>
              <div className="h-6 w-6 shrink-0">
                <DonutChart
                  data={[
                    { label: "Complete", value: k.physicalProgress.actual, color: "hsl(var(--success))" },
                    { label: "Remaining", value: 100 - k.physicalProgress.actual, color: "hsl(var(--muted))" },
                  ]}
                  height={24}
                  showLegend={false}
                />
              </div>
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">{k.physicalProgress.actual}%</p>
            <p className="text-xs text-muted-foreground">Planned: {k.physicalProgress.planned}%</p>
            <p className="mt-1 text-xs font-medium text-destructive">Behind {k.physicalProgress.variance}%</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>TOTAL COST (BUDGET)</span>
              <Wallet className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 font-display text-xl font-semibold">₹ {k.totalBudgetCr.budget.toLocaleString()} Cr</p>
            <p className="text-[11px] text-muted-foreground">Committed: ₹{k.totalBudgetCr.committed.toLocaleString()} Cr</p>
            <p className="text-[11px] text-muted-foreground">Spent: ₹{k.totalBudgetCr.spent.toLocaleString()} Cr</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>MANPOWER ON SITE</span>
              <Users className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">{k.manpower.onSite.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground">Planned: {k.manpower.planned.toLocaleString()}</p>
            <p className="text-[11px] font-medium text-destructive">{k.manpower.variancePct}%</p>
          </Card>
          <Card>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>SAFETY (THIS MONTH)</span>
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold">{k.safety.trir}</p>
            <p className="text-[11px] text-muted-foreground">TRIR</p>
            <p className="text-[11px] font-medium text-success">Target: &lt; {k.safety.target}</p>
          </Card>
        </div>

        {/* Overview + S-curve + EVM */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-3">
            <SectionTitle>Project Overview</SectionTitle>
            <dl className="space-y-1.5 text-xs">
              {[
                ["Project Start", projectOverview.start],
                ["Planned Finish", projectOverview.plannedFinish],
                ["Time Elapsed", `${projectOverview.elapsedDays} Days`],
                ["Time Remaining", `${projectOverview.remainingDays} Days`],
                ["Total Duration", `${projectOverview.totalDuration} Days`],
                ["Completed", `${projectOverview.completedDays} Days`],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/60 p-3">
              <Cloud className="h-6 w-6 text-primary" />
              <div className="text-xs">
                <p className="font-medium">
                  {projectOverview.weather.tempC}°C — {projectOverview.weather.condition}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Wind className="h-3 w-3" /> {projectOverview.weather.windKmh} km/h
                  <Droplets className="h-3 w-3" /> {projectOverview.weather.rainChance}%
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="font-display text-sm font-semibold">{projectOverview.activities.total.toLocaleString()}</p>
                <p className="text-muted-foreground">Activities</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="font-display text-sm font-semibold text-success">
                  {projectOverview.activities.completed.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Done</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="font-display text-sm font-semibold text-warning">
                  {projectOverview.activities.inProgress.toLocaleString()}
                </p>
                <p className="text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-5">
            <SectionTitle>Progress Curve (S-Curve)</SectionTitle>
            <TrendLine
              data={sCurve}
              xKey="month"
              series={[
                { key: "planned", label: "Planned" },
                { key: "actual", label: "Actual" },
                { key: "forecast", label: "Forecast" },
              ]}
              height={260}
            />
          </Card>

          <Card className="lg:col-span-4">
            <SectionTitle>Cost Performance (PV / EV / AC)</SectionTitle>
            <TrendLine
              data={evmTrend}
              xKey="month"
              series={[
                { key: "pv", label: "Planned Value" },
                { key: "ev", label: "Earned Value" },
                { key: "ac", label: "Actual Cost" },
              ]}
              height={260}
            />
          </Card>
        </div>

        {/* Critical / Look ahead / donuts */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-4">
            <SectionTitle>Critical Activities</SectionTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Float</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalActivitiesFull.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="text-xs font-medium">{a.name}</TableCell>
                    <TableCell className="text-xs">{a.float}</TableCell>
                    <TableCell>
                      <Badge variant={activityStatusVariant[a.status]} className="text-[10px]">
                        {a.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="lg:col-span-4">
            <SectionTitle>Look Ahead (Next 2 Weeks)</SectionTitle>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Finish</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lookAhead.map((a) => (
                  <TableRow key={a.name}>
                    <TableCell className="text-xs font-medium">{a.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.finish}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {a.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <Card className="lg:col-span-2">
            <SectionTitle>Manpower Distribution</SectionTitle>
            <DonutChart
              data={manpowerDistribution.map((d) => ({ label: d.label, value: d.value }))}
              centerLabel="Total"
              centerValue={manpowerDistribution.reduce((s, d) => s + d.value, 0).toLocaleString()}
              height={140}
            />
          </Card>

          <Card className="lg:col-span-2">
            <SectionTitle>Cost Summary</SectionTitle>
            <DonutChart
              data={costSummary.map((d) => ({ label: d.label, value: d.value }))}
              centerLabel="Budget"
              centerValue="₹12,350 Cr"
              height={140}
            />
          </Card>
        </div>

        {/* Cashflow + procurement/material/risk */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-6">
            <SectionTitle>Cash Flow Forecast</SectionTitle>
            <CashflowChart data={cashflowForecast} xKey="month" height={240} />
          </Card>
          <Card className="lg:col-span-2">
            <SectionTitle>Procurement Status</SectionTitle>
            <DonutChart data={procurementStatus.map((d) => ({ label: d.label, value: d.value }))} centerLabel="Total PO Value" centerValue="₹6,842 Cr" height={140} />
          </Card>
          <Card className="lg:col-span-2">
            <SectionTitle>Material Status</SectionTitle>
            <DonutChart data={materialStatus.map((d) => ({ label: d.label, value: d.value }))} centerLabel="Total Inventory" centerValue="₹2,345 Cr" height={140} />
          </Card>
          <Card className="lg:col-span-2">
            <SectionTitle>Risk Summary</SectionTitle>
            <DonutChart
              data={riskSummary.map((d) => ({
                label: d.label,
                value: `${d.value} (${d.pct}%)`,
                color: d.label === "High" ? "hsl(var(--destructive))" : d.label === "Medium" ? "hsl(var(--warning))" : "hsl(var(--success))",
              }))}
              centerLabel="Total Risks"
              centerValue={riskSummary.reduce((s, d) => s + d.value, 0).toString()}
              height={140}
            />
          </Card>
        </div>

        {/* Issues / documents / milestones / notifications */}
        <div className="grid gap-4 lg:grid-cols-4">
          <Card>
            <SectionTitle>Recent Issues</SectionTitle>
            <div className="space-y-3">
              {recentIssues.map((i) => (
                <div key={i.id} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{i.issue}</span>
                    <Badge variant={issueStatusVariant[i.status]} className="text-[10px]">
                      {i.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {i.id} · {i.reportedBy} · {i.date}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>Recent Documents</SectionTitle>
            <div className="space-y-3">
              {recentDocuments.map((d) => (
                <div key={d.name} className="text-xs">
                  <p className="font-medium">{d.name}</p>
                  <p className="text-muted-foreground">
                    {d.category} · {d.uploadedBy} · {d.date}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>Milestones</SectionTitle>
            <div className="space-y-3">
              {milestonesTable.map((m) => (
                <div key={m.name} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{m.name}</span>
                    <Badge variant={milestoneStatusVariant[m.status]} className="text-[10px]">
                      {m.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Baseline {m.baseline} → {m.actualForecast}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle action={<ListChecks className="h-3.5 w-3.5 text-muted-foreground" />}>
              Notifications
            </SectionTitle>
            <div className="space-y-3">
              {liveNotifications.map((n) => (
                <div key={n.id} className="text-xs">
                  <p>{n.text}</p>
                  <p className="text-muted-foreground">{n.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
