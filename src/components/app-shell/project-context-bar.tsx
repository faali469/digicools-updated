"use client";

import { CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { projectContext } from "@/lib/executive-dashboard-data";

const FIELDS: { key: keyof typeof projectContext; label: string }[] = [
  { key: "company", label: "Company" },
  { key: "project", label: "Project" },
  { key: "phase", label: "Project Phase" },
  { key: "location", label: "Location" },
  { key: "schedule", label: "Schedule" },
  { key: "baseline", label: "Baseline" },
];

export function ProjectContextBar() {
  return (
    <div className="grid grid-cols-2 gap-3 border-b border-border/60 bg-card/30 p-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {FIELDS.map((field) => (
        <div key={field.key} className="min-w-0">
          <p className="mb-0.5 truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {field.label}
          </p>
          {/* Single-project data today — real switching lands once multi-project selection is built. */}
          <Select defaultValue={projectContext[field.key]}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={projectContext[field.key]}>{projectContext[field.key]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-xs">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-wide text-muted-foreground">Reporting Date</p>
          <p className="truncate font-medium">{projectContext.reportingDate}</p>
        </div>
      </div>
    </div>
  );
}
