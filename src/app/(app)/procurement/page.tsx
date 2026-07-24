"use client";

import { useState } from "react";
import { ShoppingCart, Truck, Users, AlertTriangle, GitBranch, Plus } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { StatTile } from "@/components/app-shell/stat-tile";
import { ComparisonBar } from "@/components/app-shell/charts";
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
import { purchaseOrders as seedPOs, vendors } from "@/lib/mock-data";
import { rfqPipeline, deliveryTimeline } from "@/lib/procurement-data";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "On Time": "secondary",
  "At Risk": "outline",
  Delayed: "destructive",
};

type PurchaseOrder = { id: string; vendor: string; item: string; value: string; status: string };

function NewPODialog({ onAdd }: { onAdd: (po: PurchaseOrder) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-gradient-primary shadow-glow hover:opacity-90">
          <Plus className="h-3.5 w-3.5" /> New PO
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New purchase order</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            onAdd({
              id: `PO-${Math.floor(2000 + Math.random() * 900)}`,
              vendor: String(form.get("vendor")),
              item: String(form.get("item")),
              value: `$${Number(form.get("value") || 0).toLocaleString()}`,
              status: String(form.get("status")),
            });
            setOpen(false);
            e.currentTarget.reset();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="vendor">Vendor</Label>
            <Input id="vendor" name="vendor" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="item">Item</Label>
            <Input id="item" name="item" required />
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
              defaultValue="On Time"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option>On Time</option>
              <option>At Risk</option>
              <option>Delayed</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-gradient-primary shadow-glow hover:opacity-90">
              Add purchase order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProcurementPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(seedPOs);

  return (
    <PlanGate minPlan="professional" moduleName="Procurement">
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Procurement"
        description="Material requests, RFQs, purchase orders and vendor management."
        actions={<NewPODialog onAdd={(po) => setPurchaseOrders((prev) => [po, ...prev])} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Open POs" value={purchaseOrders.length.toString()} icon={ShoppingCart} />
        <StatTile label="Value on order" value="$3.2M" icon={Truck} />
        <StatTile label="Active vendors" value={vendors.length.toString()} icon={Users} />
        <StatTile label="Delayed deliveries" value="2" trend="down" icon={AlertTriangle} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="glass-card rounded-2xl p-5 lg:col-span-5">
          <h3 className="mb-4 flex items-center gap-1.5 font-display text-sm font-semibold">
            <GitBranch className="h-3.5 w-3.5 text-primary" />
            RFQ pipeline
          </h3>
          <div className="space-y-2.5">
            {rfqPipeline.map((s) => {
              const max = Math.max(...rfqPipeline.map((r) => r.count));
              return (
                <div key={s.stage} className="text-xs">
                  <div className="mb-1 flex items-center justify-between">
                    <span>{s.stage}</span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(s.count / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5 lg:col-span-7">
          <h3 className="mb-4 font-display text-sm font-semibold">Delivery timeline</h3>
          <ComparisonBar
            data={deliveryTimeline}
            xKey="month"
            series={[
              { key: "onTime", label: "On time" },
              { key: "delayed", label: "Delayed" },
            ]}
            height={220}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-sm font-semibold">Purchase orders</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-mono text-xs">{po.id}</TableCell>
                  <TableCell className="font-medium">{po.vendor}</TableCell>
                  <TableCell className="text-muted-foreground">{po.item}</TableCell>
                  <TableCell>{po.value}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[po.status]}>{po.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 font-display text-sm font-semibold">Vendors</h3>
          <div className="space-y-3">
            {vendors.map((v) => (
              <div key={v.name} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{v.name}</p>
                  <p className="text-xs text-muted-foreground">{v.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">★ {v.rating}</p>
                  <p className="text-xs text-muted-foreground">{v.openPOs} open</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PlanGate>
  );
}
