"use client";

import { X, Flag, AlertTriangle, GripVertical } from "lucide-react";
import { StatTile } from "@/components/app-shell/stat-tile";
import { TrendArea, ComparisonBar } from "@/components/app-shell/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Widget } from "@/lib/dashboard-widgets";
import { cashflowTrend, progressByDiscipline, projects, milestones, riskRegister } from "@/lib/mock-data";

const milestoneDot = {
  "on-track": "bg-success",
  "at-risk": "bg-warning",
  delayed: "bg-destructive",
};

export function DashboardWidget({ widget, onRemove }: { widget: Widget; onRemove: () => void }) {
  return (
    <div className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl p-5">
      <div className="drag-handle absolute left-0 right-0 top-0 flex h-6 cursor-grab items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <button
        onClick={onRemove}
        className="absolute right-3 top-3 z-10 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
        aria-label="Remove widget"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {widget.type === "kpi" && <StatTile label={widget.title} value="—" />}

      {widget.type === "chart" && (
        <>
          <h3 className="mb-3 font-display text-sm font-semibold">{widget.title}</h3>
          <div className="min-h-0 flex-1">
            <TrendArea
              data={cashflowTrend}
              xKey="month"
              series={[{ key: "actual", label: "Actual" }]}
              height="100%"
            />
          </div>
        </>
      )}

      {widget.type === "bar-chart" && (
        <>
          <h3 className="mb-3 font-display text-sm font-semibold">{widget.title}</h3>
          <div className="min-h-0 flex-1">
            <ComparisonBar
              data={progressByDiscipline}
              xKey="discipline"
              series={[
                { key: "planned", label: "Planned" },
                { key: "actual", label: "Actual" },
              ]}
              height="100%"
            />
          </div>
        </>
      )}

      {widget.type === "table" && (
        <>
          <h3 className="mb-3 font-display text-sm font-semibold">{widget.title}</h3>
          <div className="min-h-0 flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.progress}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {widget.type === "milestones" && (
        <>
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-semibold">
            <Flag className="h-3.5 w-3.5 text-primary" />
            {widget.title}
          </h3>
          <div className="min-h-0 flex-1 space-y-3 overflow-auto">
            {milestones.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", milestoneDot[m.status])} />
                  {m.name}
                </div>
                <span className="text-xs text-muted-foreground">{m.date}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {widget.type === "risk" && (
        <>
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-sm font-semibold">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            {widget.title}
          </h3>
          <div className="min-h-0 flex-1 space-y-3 overflow-auto">
            {riskRegister.map((r) => (
              <div key={r.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{r.label}</span>
                  <span className="text-muted-foreground">{r.severity}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      r.severity >= 70 ? "bg-destructive" : r.severity >= 40 ? "bg-warning" : "bg-success"
                    )}
                    style={{ width: `${r.severity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
