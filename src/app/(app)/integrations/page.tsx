"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, KeyRound, Activity, Plug } from "lucide-react";
import { PageHeader, StubBadge } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { StatTile } from "@/components/app-shell/stat-tile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useOrg } from "@/lib/org-context";
import { createClient } from "@/lib/supabase/client";
import { INTEGRATION_CATALOG, type IntegrationDef } from "@/lib/integrations";

const ALL_INTEGRATIONS = INTEGRATION_CATALOG.flatMap((g) => g.items);
const COUNTS = {
  total: ALL_INTEGRATIONS.length,
  available: ALL_INTEGRATIONS.filter((i) => i.kind === "available").length,
  needsCreds: ALL_INTEGRATIONS.filter((i) => i.kind === "requires_credentials").length,
  comingSoon: ALL_INTEGRATIONS.filter((i) => i.kind === "coming_soon").length,
};

const statusMeta: Record<IntegrationDef["kind"], { label: string; icon: typeof CheckCircle2; className: string }> = {
  available: { label: "Available", icon: CheckCircle2, className: "text-success" },
  requires_credentials: { label: "Needs credentials", icon: KeyRound, className: "text-warning" },
  coming_soon: { label: "Coming soon", icon: Clock, className: "text-muted-foreground" },
};

function IntegrationHub() {
  const org = useOrg();
  const supabase = createClient();
  const [requested, setRequested] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!org.id) return;
    supabase
      .from("org_integrations")
      .select("provider")
      .eq("org_id", org.id)
      .then(({ data }) => {
        if (data) setRequested(new Set((data as { provider: string }[]).map((r) => r.provider)));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org.id]);

  async function handleConnect(item: IntegrationDef) {
    if (item.kind === "available") return;
    if (item.kind === "coming_soon") {
      toast.info(`${item.name} isn't built yet — no timeline yet, just on the roadmap.`);
      return;
    }
    if (!org.id) return;
    await supabase.from("org_integrations").upsert(
      { org_id: org.id, provider: item.id, status: "not_connected" },
      { onConflict: "org_id,provider" }
    );
    setRequested((prev) => new Set(prev).add(item.id));
    toast.warning(`${item.name} requires ${item.requires}.`, {
      description: "Recorded your interest — an admin can wire this up once those credentials are available.",
    });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Integration Hub"
        description="Connect DigiCools to your scheduling, BI, ERP, storage and identity systems."
        actions={<StubBadge>OAuth flows not wired up — see each card for what&apos;s needed</StubBadge>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <StatTile label="Total integrations" value={COUNTS.total.toString()} icon={Plug} />
        <StatTile label="Available today" value={COUNTS.available.toString()} icon={CheckCircle2} />
        <StatTile label="Need credentials" value={COUNTS.needsCreds.toString()} icon={KeyRound} />
        <StatTile label="Coming soon" value={COUNTS.comingSoon.toString()} icon={Clock} />
      </div>

      <div className="space-y-6">
        {INTEGRATION_CATALOG.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 font-display text-sm font-semibold text-muted-foreground">{group.category}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => {
                const meta = statusMeta[item.kind];
                const isRequested = requested.has(item.id);
                return (
                  <div key={item.id} className="glass-card flex flex-col rounded-2xl p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <Badge variant="outline" className={meta.className}>
                        <meta.icon className="mr-1 h-3 w-3" />
                        {isRequested && item.kind === "requires_credentials" ? "Requested" : meta.label}
                      </Badge>
                    </div>
                    <p className="mb-4 flex-1 text-xs text-muted-foreground">{item.description}</p>
                    {item.kind === "available" ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={item.href!}>Open</Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={item.kind === "coming_soon"}
                        onClick={() => handleConnect(item)}
                      >
                        {item.kind === "coming_soon" ? "Coming soon" : isRequested ? "Requested" : "Connect"}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 glass-card rounded-2xl p-6 text-center">
        <Activity className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
        <p className="text-sm font-medium">No integration activity yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Sync history, API logs and conflict resolution will show up here once a real integration is connected.
        </p>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <PlanGate minPlan="enterprise" moduleName="Integration Hub">
      <IntegrationHub />
    </PlanGate>
  );
}
