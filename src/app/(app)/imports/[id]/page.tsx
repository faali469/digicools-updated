"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileCheck2, Gauge, ArrowLeft, LayoutGrid, Workflow, HardHat, Ruler, LayoutDashboard, Loader2 } from "lucide-react";
import { PageHeader, StubBadge } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendLine } from "@/components/app-shell/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { importJobs as seedJobs, scheduleHealthChecks } from "@/lib/mock-data";
import { sCurve, criticalActivitiesFull } from "@/lib/executive-dashboard-data";

type JobInfo = { file: string; type: string; uploaded: string };

function ImportReport() {
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id ?? "";
  const supabase = createClient();
  const [job, setJob] = useState<JobInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const seed = seedJobs.find((j) => j.id === id);
      if (seed) {
        if (!cancelled) {
          setJob({ file: seed.file, type: seed.type, uploaded: seed.uploaded });
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from("import_jobs")
        .select("file_name, file_type, created_at")
        .eq("id", id)
        .maybeSingle();

      if (!cancelled) {
        const row = data as { file_name: string; file_type: string; created_at: string } | null;
        setJob(
          row
            ? { file: row.file_name, type: row.file_type, uploaded: new Date(row.created_at).toISOString().slice(0, 10) }
            : { file: "Unknown schedule", type: "—", uploaded: "—" }
        );
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const score = 78;

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/imports" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Imports
      </Link>
      <PageHeader
        title={job?.file ?? "Schedule report"}
        description={`Generated report for this schedule — type ${job?.type}, uploaded ${job?.uploaded}.`}
        actions={<StubBadge>Built from sample data — real parsing not wired up yet</StubBadge>}
      />

      <div className="glass-card mb-4 flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-6">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
            <span className="font-display text-2xl font-bold text-primary-foreground">{score}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Schedule Health Score</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Sample activity network extracted from this file — flowed into the modules below.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/dashboard">
              <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/planning">
              <Workflow className="h-3.5 w-3.5" /> Planning
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/site">
              <HardHat className="h-3.5 w-3.5" /> Site
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/qs">
              <Ruler className="h-3.5 w-3.5" /> QS
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/dashboards">
              <LayoutGrid className="h-3.5 w-3.5" /> Dashboard Builder
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Progress curve</h3>
          <TrendLine
            data={sCurve}
            xKey="month"
            series={[
              { key: "planned", label: "Planned" },
              { key: "actual", label: "Actual" },
            ]}
            height={220}
          />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Health checks</h3>
          <div className="divide-y divide-border/60">
            {scheduleHealthChecks.map((c) => (
              <div key={c.label} className="flex items-center justify-between py-2.5 text-sm">
                <span>{c.label}</span>
                <span
                  className={
                    c.severity === "critical"
                      ? "font-mono text-xs font-medium text-destructive"
                      : c.severity === "warning"
                        ? "font-mono text-xs font-medium text-warning"
                        : "font-mono text-xs font-medium text-success"
                  }
                >
                  {c.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold">Critical path activities</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
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
                <TableCell>{a.finish}</TableCell>
                <TableCell>
                  <Badge variant={a.float === 0 ? "destructive" : "secondary"}>{a.float}d</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{a.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ImportReportPage() {
  return (
    <PlanGate minPlan="professional" moduleName="Schedule Imports">
      <ImportReport />
    </PlanGate>
  );
}
