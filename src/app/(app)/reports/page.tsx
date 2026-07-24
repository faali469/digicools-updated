"use client";

import { FileText, FileSpreadsheet, Presentation, Download } from "lucide-react";
import { PageHeader, StubBadge } from "@/components/app-shell/page-header";
import { Button } from "@/components/ui/button";

const REPORT_TYPES = [
  { name: "Daily Report", desc: "Crew, weather, incidents, progress for a single day.", icon: FileText },
  { name: "Weekly Report", desc: "Rolled-up progress, cost and risk for the week.", icon: FileText },
  { name: "Monthly Report", desc: "Full management report with EVM and forecast.", icon: FileSpreadsheet },
  { name: "Client Report", desc: "Client-ready summary — progress, photos, milestones.", icon: Presentation },
  { name: "Delay Report", desc: "Critical path impact and time-extension analysis.", icon: FileText },
  { name: "Executive Presentation", desc: "AI-drafted slide deck for leadership review.", icon: Presentation },
];

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Reporting"
        description="Generate reports from live project data — PDF, Excel or PowerPoint."
        actions={<StubBadge>Export wiring pending</StubBadge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORT_TYPES.map((r) => (
          <div key={r.name} className="glass-card flex flex-col rounded-2xl p-5">
            <r.icon className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-display text-sm font-semibold">{r.name}</h3>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">{r.desc}</p>
            <Button variant="outline" size="sm" className="mt-4 gap-1.5" disabled>
              <Download className="h-3.5 w-3.5" /> Generate
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
