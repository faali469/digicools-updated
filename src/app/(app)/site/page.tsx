"use client";

import { useState } from "react";
import { HardHat, ShieldCheck, ClipboardList, Camera, ClipboardCheck, Plus } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { StatTile } from "@/components/app-shell/stat-tile";
import { ProjectContextBar } from "@/components/app-shell/project-context-bar";
import { TrendArea, ComparisonBar, DonutChart } from "@/components/app-shell/charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dailyReports, snagList as seedSnags } from "@/lib/mock-data";
import { manpowerDistribution } from "@/lib/executive-dashboard-data";
import { crewTrend, safetyTrend, inspections } from "@/lib/site-data";

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  High: "destructive",
  Medium: "outline",
  Low: "secondary",
};

const resultVariant: Record<string, "secondary" | "destructive"> = {
  Pass: "secondary",
  Fail: "destructive",
};

type Snag = { id: string; location: string; desc: string; priority: string; status: string };

function NewSnagDialog({ onAdd }: { onAdd: (snag: Snag) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-glow hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> New Snag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New snag</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onAdd({
              id: `SNG-${Math.floor(400 + Math.random() * 90)}`,
              location: String(form.get("location")),
              desc: String(form.get("desc")),
              priority: String(form.get("priority")),
              status: "Open",
            });
            setOpen(false);
            e.currentTarget.reset();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g. L3 — Grid B2" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" name="desc" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              name="priority"
              defaultValue="Medium"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gradient-primary shadow-glow hover:opacity-90">
              Add snag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SitePage() {
  const [snagList, setSnagList] = useState<Snag[]>(seedSnags);

  return (
    <div className="-m-4 md:-m-6">
      <ProjectContextBar />

      <div className="space-y-4 p-4 md:p-6">
        <PageHeader
          title="Site Execution"
          description="Daily reports, safety, quality, snag lists and inspections."
          actions={<NewSnagDialog onAdd={(snag) => setSnagList((prev) => [snag, ...prev])} />}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Crew on site today" value="4,752" icon={HardHat} />
          <StatTile label="Safety incidents (30d)" value="1" trend="down" icon={ShieldCheck} />
          <StatTile label="Open snags" value={snagList.filter((s) => s.status !== "Closed").length.toString()} icon={ClipboardList} />
          <StatTile label="Photos logged (30d)" value="216" icon={Camera} />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="glass-card rounded-2xl p-5 lg:col-span-5">
            <h3 className="mb-4 font-display text-sm font-semibold">Crew on site — this week</h3>
            <TrendArea data={crewTrend} xKey="day" series={[{ key: "crew", label: "Crew" }]} height={220} />
          </div>
          <div className="glass-card rounded-2xl p-5 lg:col-span-4">
            <h3 className="mb-4 font-display text-sm font-semibold">Safety — incidents vs. near misses</h3>
            <ComparisonBar
              data={safetyTrend}
              xKey="month"
              series={[
                { key: "incidents", label: "Incidents" },
                { key: "nearMisses", label: "Near misses" },
              ]}
              height={220}
            />
          </div>
          <div className="glass-card rounded-2xl p-5 lg:col-span-3">
            <h3 className="mb-3 font-display text-sm font-semibold">Crew composition</h3>
            <DonutChart
              data={manpowerDistribution.map((d) => ({ label: d.label, value: d.value }))}
              centerLabel="Total"
              centerValue={manpowerDistribution.reduce((s, d) => s + d.value, 0).toLocaleString()}
              height={150}
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 font-display text-sm font-semibold">Daily reports</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Crew</TableHead>
                  <TableHead>Weather</TableHead>
                  <TableHead>Incidents</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyReports.map((r) => (
                  <TableRow key={r.date}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.crew}</TableCell>
                    <TableCell className="text-muted-foreground">{r.weather}</TableCell>
                    <TableCell>{r.incidents}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 font-display text-sm font-semibold">Snag list</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snagList.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-xs text-muted-foreground">{s.location}</TableCell>
                    <TableCell className="font-medium">{s.desc}</TableCell>
                    <TableCell>
                      <Badge variant={priorityVariant[s.priority]}>{s.priority}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 flex items-center gap-1.5 font-display text-sm font-semibold">
              <ClipboardCheck className="h-3.5 w-3.5 text-primary" />
              Inspections
            </h3>
            <div className="space-y-3">
              {inspections.map((i) => (
                <div key={i.id} className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{i.type}</span>
                    <Badge variant={resultVariant[i.result]} className="text-[10px]">
                      {i.result}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    {i.location} · {i.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
