"use client";

import { useState } from "react";
import { Ruler, FileText, TrendingUp, GitPullRequestArrow, Plus } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { StatTile } from "@/components/app-shell/stat-tile";
import { TrendArea } from "@/components/app-shell/charts";
import { Progress } from "@/components/ui/progress";
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
import { boqItems } from "@/lib/mock-data";
import { variationOrders as seedVOs, runningBills } from "@/lib/qs-data";

const voStatusVariant: Record<string, "secondary" | "outline" | "destructive"> = {
  Approved: "secondary",
  Pending: "outline",
  "Under Review": "destructive",
};

type VariationOrder = { id: string; desc: string; value: number; status: string };

function NewVODialog({ onAdd }: { onAdd: (vo: VariationOrder) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-glow hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> New VO
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New variation order</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onAdd({
              id: `VO-${Math.floor(20 + Math.random() * 90)}`,
              desc: String(form.get("desc")),
              value: Number(form.get("value") || 0),
              status: String(form.get("status")),
            });
            setOpen(false);
            e.currentTarget.reset();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" name="desc" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="value">Value ($)</Label>
            <Input id="value" name="value" type="number" min="0" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue="Pending"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option>Pending</option>
              <option>Under Review</option>
              <option>Approved</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gradient-primary shadow-glow hover:opacity-90">
              Add variation order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function QsPage() {
  const [variationOrders, setVariationOrders] = useState<VariationOrder[]>(seedVOs);
  const openVOValue = variationOrders.filter((v) => v.status !== "Approved").reduce((s, v) => s + v.value, 0);

  return (
    <PlanGate minPlan="professional" moduleName="Quantity Surveying">
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Quantity Surveying"
        description="Bill of quantities, measurements, running bills and variation orders."
        actions={<NewVODialog onAdd={(vo) => setVariationOrders((prev) => [vo, ...prev])} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Contract value" value="$18.4M" icon={Ruler} />
        <StatTile label="Certified to date" value="$6.9M" delta="37.5%" trend="up" icon={TrendingUp} />
        <StatTile
          label="Open variation orders"
          value={`$${(openVOValue / 1000).toFixed(0)}K`}
          delta={`${variationOrders.filter((v) => v.status !== "Approved").length} pending`}
          trend="neutral"
          icon={FileText}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="glass-card rounded-2xl p-5 lg:col-span-7">
          <h3 className="mb-4 font-display text-sm font-semibold">Running bill — certified vs. invoiced ($k)</h3>
          <TrendArea
            data={runningBills}
            xKey="period"
            series={[
              { key: "certified", label: "Certified" },
              { key: "invoiced", label: "Invoiced" },
            ]}
            height={220}
          />
        </div>
        <div className="glass-card rounded-2xl p-5 lg:col-span-5">
          <h3 className="mb-4 flex items-center gap-1.5 font-display text-sm font-semibold">
            <GitPullRequestArrow className="h-3.5 w-3.5 text-primary" />
            Variation orders
          </h3>
          <div className="space-y-3">
            {variationOrders.map((vo) => (
              <div key={vo.id} className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium">{vo.id}</p>
                  <p className="text-muted-foreground">{vo.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(vo.value / 1000).toFixed(0)}K</p>
                  <Badge variant={voStatusVariant[vo.status]} className="text-[10px]">
                    {vo.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 glass-card rounded-2xl p-5">
        <h3 className="mb-4 font-display text-sm font-semibold">Bill of Quantities</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Billed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boqItems.map((item) => (
              <TableRow key={item.code}>
                <TableCell className="font-mono text-xs">{item.code}</TableCell>
                <TableCell className="font-medium">{item.desc}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.qty.toLocaleString()}</TableCell>
                <TableCell>${item.rate.toLocaleString()}</TableCell>
                <TableCell className="w-40">
                  <div className="flex items-center gap-2">
                    <Progress value={item.billed} className="h-2" />
                    <span className="w-9 text-xs text-muted-foreground">{item.billed}%</span>
                  </div>
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
