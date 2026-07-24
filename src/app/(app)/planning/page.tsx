"use client";

import Link from "next/link";
import { GitBranch, Layers, Calendar, Flag, AlertTriangle, AlertOctagon, LayoutGrid, UploadCloud } from "lucide-react";
import { PageHeader, StubBadge } from "@/components/app-shell/page-header";
import { StatTile } from "@/components/app-shell/stat-tile";
import { ProjectContextBar } from "@/components/app-shell/project-context-bar";
import { ComparisonBar, TrendLine } from "@/components/app-shell/charts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { progressByDiscipline, scheduleHealthChecks } from "@/lib/mock-data";
import { sCurve, criticalActivitiesFull, lookAhead } from "@/lib/executive-dashboard-data";
import { wbsBreakdown, resourceLoading } from "@/lib/planning-data";
import { cn } from "@/lib/utils";

const activityStatusVariant: Record<string, "destructive" | "outline"> = {
  Critical: "destructive",
  "Near Critical": "outline",
};

export default function PlanningPage() {
  const openEnds = scheduleHealthChecks.find((c) => c.label === "Open ends")?.count ?? 0;
  const negFloat = scheduleHealthChecks.find((c) => c.label === "Negative float activities")?.count ?? 0;

  return (
    <div className="-m-4 md:-m-6">
      <ProjectContextBar />

      <div className="space-y-4 p-4 md:p-6">
        <PageHeader
          title="Planning"
          description="WBS, activities, relationships, calendars, baselines and critical path."
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link href="/imports">
                  <UploadCloud className="h-3.5 w-3.5" /> Import Schedule
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link href="/dashboards">
                  <LayoutGrid className="h-3.5 w-3.5" /> Add to Dashboard
                </Link>
              </Button>
              <StubBadge>Gantt view coming soon</StubBadge>
            </div>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile label="WBS nodes" value="86" icon={Layers} />
          <StatTile label="Activities" value="12,745" icon={GitBranch} />
          <StatTile label="Baselines" value="2" icon={Calendar} />
          <StatTile label="Critical path" value="214 days" icon={Flag} />
          <StatTile label="Open ends" value={openEnds.toString()} icon={AlertTriangle} trend="down" />
          <StatTile label="Negative float" value={negFloat.toString()} icon={AlertOctagon} trend="down" />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="glass-card rounded-2xl p-5 lg:col-span-5">
            <h3 className="mb-4 font-display text-sm font-semibold">Progress curve (S-Curve)</h3>
            <TrendLine
              data={sCurve}
              xKey="month"
              series={[
                { key: "planned", label: "Planned" },
                { key: "actual", label: "Actual" },
              ]}
              height={240}
            />
          </div>
          <div className="glass-card rounded-2xl p-5 lg:col-span-4">
            <h3 className="mb-4 font-display text-sm font-semibold">Progress by discipline (%)</h3>
            <ComparisonBar
              data={progressByDiscipline}
              xKey="discipline"
              series={[
                { key: "planned", label: "Planned" },
                { key: "actual", label: "Actual" },
              ]}
              height={240}
            />
          </div>
          <div className="glass-card rounded-2xl p-5 lg:col-span-3">
            <h3 className="mb-3 font-display text-sm font-semibold">WBS breakdown</h3>
            <div className="space-y-2.5">
              {wbsBreakdown.map((w) => (
                <div key={w.code} className={cn("text-xs", w.level === 1 && "pl-4")}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className={cn(w.level === 0 && "font-medium")}>
                      <span className="mr-1.5 font-mono text-muted-foreground">{w.code}</span>
                      {w.name}
                    </span>
                    <span className="text-muted-foreground">{w.progress}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", w.progress === 100 ? "bg-success" : "bg-primary")}
                      style={{ width: `${w.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="glass-card rounded-2xl p-5 lg:col-span-7">
            <h3 className="mb-4 font-display text-sm font-semibold">Critical path activities</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>Finish</TableHead>
                  <TableHead>Float</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalActivitiesFull.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.id}</TableCell>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-muted-foreground">{a.start}</TableCell>
                    <TableCell>{a.finish}</TableCell>
                    <TableCell>
                      <Badge variant={a.float === 0 ? "destructive" : "secondary"}>{a.float}d</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={activityStatusVariant[a.status]}>{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="glass-card rounded-2xl p-5 lg:col-span-5">
            <h3 className="mb-4 font-display text-sm font-semibold">Look ahead (next 2 weeks)</h3>
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
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Resource loading — headcount</h3>
          <ComparisonBar
            data={resourceLoading}
            xKey="week"
            series={[
              { key: "planned", label: "Planned" },
              { key: "actual", label: "Actual" },
            ]}
            height={220}
          />
        </div>
      </div>
    </div>
  );
}
