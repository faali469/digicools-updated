"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UploadCloud, FileCheck2, Loader2, ChevronRight } from "lucide-react";
import { PageHeader, StubBadge } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { importJobs as seedJobs } from "@/lib/mock-data";

type ImportJob = { id: string; file: string; type: string; status: string; uploaded: string };

const ACCEPTED = ".xer,.mpp,.xlsx,.xls,.csv,.xml";

function detectType(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  return { xer: "XER", mpp: "MPP", xlsx: "Excel", xls: "Excel", csv: "CSV", xml: "XML" }[ext ?? ""] ?? "Unknown";
}

export default function ImportsPage() {
  const [jobs, setJobs] = useState<ImportJob[]>(seedJobs);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);

    const res = await fetch("/api/imports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: file.name, fileType: detectType(file.name) }),
    });
    const job = await res.json();

    setJobs((prev) => [job, ...prev]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";

    toast.success(`${job.file} loaded — flowed into Planning, Dashboard, Site and QS.`, {
      description: "Sample data for now — real parsing isn't wired up yet.",
    });
    router.push(`/imports/${job.id}`);
  }

  return (
    <PlanGate minPlan="professional" moduleName="Schedule Imports">
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Schedule Imports"
        description="Upload a Primavera P6 (.XER), MS Project (.MPP), Excel, CSV or XML schedule."
        actions={<StubBadge>Parsing stubbed — sample data loaded</StubBadge>}
      />

      <label
        className="glass-card flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 p-12 text-center transition-colors hover:border-primary/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <UploadCloud className="h-8 w-8 text-primary" />
        )}
        <div>
          <p className="font-medium">Drop a schedule file here, or click to browse</p>
          <p className="mt-1 text-sm text-muted-foreground">.xer · .mpp · .xlsx · .csv · .xml</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      <div className="mt-6 glass-card rounded-2xl p-5">
        <h3 className="mb-1 font-display text-sm font-semibold">Recent imports</h3>
        <p className="mb-4 text-xs text-muted-foreground">Select a schedule to open its generated report.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((j) => (
              <TableRow key={j.id}>
                <TableCell className="p-0">
                  <Link href={`/imports/${j.id}`} className="flex items-center gap-2 px-4 py-3 font-medium">
                    <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                    {j.file}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{j.type}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{j.uploaded}</TableCell>
                <TableCell className="text-xs text-warning">{j.status}</TableCell>
                <TableCell>
                  <Link href={`/imports/${j.id}`}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
    </PlanGate>
  );
}
