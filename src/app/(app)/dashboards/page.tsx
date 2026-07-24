"use client";

import "react-grid-layout/css/styles.css";
import { useEffect, useState } from "react";
import { GridLayout, useContainerWidth, type Layout } from "react-grid-layout";
import { Sparkles, Plus, Loader2, Save } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { PlanGate } from "@/components/app-shell/plan-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardWidget } from "@/components/app-shell/dashboard-widget";
import { useOrg } from "@/lib/org-context";
import { createClient } from "@/lib/supabase/client";
import {
  PALETTE,
  DEFAULT_WIDGETS,
  createWidget,
  widgetsFromPrompt,
  type Widget,
} from "@/lib/dashboard-widgets";

const ROW_HEIGHT = 42;

function DashboardBuilder() {
  const org = useOrg();
  const supabase = createClient();
  const { width, containerRef, mounted } = useContainerWidth();

  const [dashboardId, setDashboardId] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!org.id) {
        setLoading(false);
        return;
      }
      const { data: dashboard } = await supabase
        .from("dashboards")
        .select("id")
        .eq("org_id", org.id)
        .limit(1)
        .maybeSingle();

      if (!dashboard) {
        if (!cancelled) setLoading(false);
        return;
      }

      const { data: widgetRows } = await supabase
        .from("dashboard_widgets")
        .select("id, type, title, config, sort_order")
        .eq("dashboard_id", dashboard.id)
        .order("sort_order");

      if (!cancelled) {
        if (widgetRows && widgetRows.length > 0) {
          setWidgets(
            (widgetRows as { id: string; type: string; title: string; config: { layout: Widget["config"]["layout"] } }[]).map(
              (w) => ({ id: w.id, type: w.type as Widget["type"], title: w.title, config: w.config })
            )
          );
        }
        setDashboardId((dashboard as { id: string }).id);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org.id]);

  async function handleSave() {
    if (!org.id) return;
    setSaving(true);

    let id = dashboardId;
    if (!id) {
      const { data, error } = await supabase
        .from("dashboards")
        .insert({ org_id: org.id, name: "My Dashboard" })
        .select("id")
        .single();
      if (error || !data) {
        setSaving(false);
        return;
      }
      id = (data as { id: string }).id;
      setDashboardId(id);
    }

    await supabase.from("dashboard_widgets").delete().eq("dashboard_id", id);
    await supabase.from("dashboard_widgets").insert(
      widgets.map((w, i) => ({
        dashboard_id: id,
        type: w.type,
        title: w.title,
        config: w.config,
        sort_order: i,
      }))
    );

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLayoutChange(layout: Layout) {
    setWidgets((prev) =>
      prev.map((w) => {
        const pos = layout.find((l) => l.i === w.id);
        return pos ? { ...w, config: { layout: { x: pos.x, y: pos.y, w: pos.w, h: pos.h } } } : w;
      })
    );
  }

  const gridLayout: Layout = widgets.map((w) => ({ i: w.id, ...w.config.layout }));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard Builder"
        description="Drag, resize and add widgets — describe a dashboard and let AI build it for you."
        actions={
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5 bg-gradient-primary shadow-glow hover:opacity-90">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save layout"}
          </Button>
        }
      />

      <div className="glass-card mb-4 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Try "Create CEO Dashboard", "Create Cost Dashboard" or "Create Risk Dashboard"'
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Button
          onClick={() => {
            if (!prompt.trim()) return;
            setWidgets(widgetsFromPrompt(prompt));
          }}
          className="bg-gradient-primary shadow-glow hover:opacity-90"
        >
          Generate
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PALETTE.map((p) => (
          <Button
            key={p.type}
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setWidgets((prev) => [...prev, createWidget(p.type, p.label, prev)])}
          >
            <Plus className="h-3.5 w-3.5" />
            <p.icon className="h-3.5 w-3.5" />
            {p.label}
          </Button>
        ))}
      </div>

      <div ref={containerRef}>
        {loading ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          mounted && (
            <GridLayout
              width={width}
              layout={gridLayout}
              gridConfig={{ cols: 12, rowHeight: ROW_HEIGHT, margin: [16, 16], containerPadding: [0, 0] }}
              dragConfig={{ handle: ".drag-handle" }}
              onLayoutChange={handleLayoutChange}
            >
              {widgets.map((w) => (
                <div key={w.id}>
                  <DashboardWidget widget={w} onRemove={() => setWidgets((prev) => prev.filter((x) => x.id !== w.id))} />
                </div>
              ))}
            </GridLayout>
          )
        )}
      </div>
    </div>
  );
}

export default function DashboardsPage() {
  return (
    <PlanGate minPlan="professional" moduleName="Dashboard Builder">
      <DashboardBuilder />
    </PlanGate>
  );
}
