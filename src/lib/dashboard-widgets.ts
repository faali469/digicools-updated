import {
  LayoutGrid,
  TrendingUp,
  BarChart3,
  Table2,
  Flag,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export type WidgetType = "kpi" | "chart" | "bar-chart" | "table" | "milestones" | "risk";

export type GridPos = { x: number; y: number; w: number; h: number };

export type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  config: { layout: GridPos };
};

export const WIDGET_DEFAULT_SIZE: Record<WidgetType, { w: number; h: number }> = {
  kpi: { w: 3, h: 2 },
  chart: { w: 6, h: 5 },
  "bar-chart": { w: 6, h: 5 },
  table: { w: 6, h: 5 },
  milestones: { w: 6, h: 5 },
  risk: { w: 6, h: 4 },
};

export const PALETTE: { type: WidgetType; label: string; icon: LucideIcon }[] = [
  { type: "kpi", label: "KPI card", icon: LayoutGrid },
  { type: "chart", label: "Trend chart", icon: TrendingUp },
  { type: "bar-chart", label: "Bar chart", icon: BarChart3 },
  { type: "table", label: "Table", icon: Table2 },
  { type: "milestones", label: "Milestones", icon: Flag },
  { type: "risk", label: "Risk register", icon: AlertTriangle },
];

function nextY(widgets: Widget[]): number {
  return widgets.reduce((max, w) => Math.max(max, w.config.layout.y + w.config.layout.h), 0);
}

export function createWidget(type: WidgetType, title: string, existing: Widget[]): Widget {
  const size = WIDGET_DEFAULT_SIZE[type];
  return {
    id: crypto.randomUUID(),
    type,
    title,
    config: { layout: { x: 0, y: nextY(existing), w: size.w, h: size.h } },
  };
}

function packRow(defs: { type: WidgetType; title: string }[]): Widget[] {
  const widgets: Widget[] = [];
  let x = 0;
  let y = 0;
  let rowH = 0;
  for (const def of defs) {
    const size = WIDGET_DEFAULT_SIZE[def.type];
    if (x + size.w > 12) {
      x = 0;
      y += rowH;
      rowH = 0;
    }
    widgets.push({
      id: crypto.randomUUID(),
      type: def.type,
      title: def.title,
      config: { layout: { x, y, w: size.w, h: size.h } },
    });
    x += size.w;
    rowH = Math.max(rowH, size.h);
  }
  return widgets;
}

export const DEFAULT_WIDGETS: Widget[] = packRow([
  { type: "kpi", title: "Portfolio SPI" },
  { type: "kpi", title: "Portfolio CPI" },
  { type: "kpi", title: "Active projects" },
  { type: "chart", title: "Cashflow trend" },
  { type: "table", title: "Project scorecard" },
  { type: "milestones", title: "Upcoming milestones" },
]);

export function widgetsFromPrompt(prompt: string): Widget[] {
  const p = prompt.toLowerCase();
  if (p.includes("cost") || p.includes("cashflow") || p.includes("budget")) {
    return packRow([
      { type: "kpi", title: "Budget at Completion" },
      { type: "kpi", title: "CPI" },
      { type: "chart", title: "Cashflow trend" },
      { type: "risk", title: "Cost risks" },
    ]);
  }
  if (p.includes("ceo") || p.includes("executive")) {
    return packRow([
      { type: "kpi", title: "Active projects" },
      { type: "kpi", title: "Portfolio SPI" },
      { type: "kpi", title: "Open risks" },
      { type: "chart", title: "Cashflow trend" },
      { type: "table", title: "Project scorecard" },
      { type: "milestones", title: "Upcoming milestones" },
    ]);
  }
  if (p.includes("risk")) {
    return packRow([
      { type: "risk", title: "Risk register" },
      { type: "milestones", title: "Upcoming milestones" },
    ]);
  }
  if (p.includes("procurement") || p.includes("vendor")) {
    return packRow([
      { type: "kpi", title: "Open POs" },
      { type: "kpi", title: "Delayed deliveries" },
      { type: "bar-chart", title: "Progress by discipline" },
      { type: "table", title: "Project scorecard" },
    ]);
  }
  return packRow([
    { type: "kpi", title: "Progress" },
    { type: "chart", title: "Cashflow trend" },
    { type: "table", title: "Project scorecard" },
  ]);
}
