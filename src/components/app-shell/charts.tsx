"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Fixed categorical order — never cycled, never reassigned by filtering.
export const SERIES_COLORS = [
  "hsl(var(--primary))",
  "#E8B45C", // gold-400
  "hsl(var(--accent))",
  "#8B92A6", // mist-400
  "hsl(var(--success))",
  "#E85C8A", // rose, 6th categorical slot
];

// Reserved for state, never reused for an arbitrary "series N".
export const STATUS_COLORS = {
  good: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  critical: "hsl(var(--destructive))",
};

const gridProps = { stroke: "hsl(var(--border))", strokeDasharray: "3 3", vertical: false };
const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

// Keeps large values (thousands+) from being wide enough to clip against the
// card edge — "14000" -> "14k". Reserve real width via YAxis' own `width`
// prop rather than a big negative chart margin, which clips long labels.
function compactTick(value: number | string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  if (Math.abs(n) >= 1000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}
const tooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.75rem",
  fontSize: "0.75rem",
};

type Series = { key: string; label: string; color?: string };

export function TrendArea({
  data,
  xKey,
  series,
  height = 260,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  series: Series[];
  height?: number | "100%";
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color ?? SERIES_COLORS[i]} stopOpacity={0.35} />
              <stop offset="95%" stopColor={s.color ?? SERIES_COLORS[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={compactTick} />
        <Tooltip contentStyle={tooltipStyle} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? SERIES_COLORS[i]}
            strokeWidth={2}
            fill={`url(#fill-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TrendLine({
  data,
  xKey,
  series,
  height = 260,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  series: Series[];
  height?: number | "100%";
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={compactTick} />
        <Tooltip contentStyle={tooltipStyle} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? SERIES_COLORS[i]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ComparisonBar({
  data,
  xKey,
  series,
  height = 260,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  series: Series[];
  height?: number | "100%";
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={compactTick} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.color ?? SERIES_COLORS[i]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export type DonutSlice = { label: string; value: string | number; color?: string };

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  height = 220,
  showLegend = true,
}: {
  data: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
  height?: number | "100%";
  showLegend?: boolean;
}) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="hsl(var(--card))"
            strokeWidth={2}
          >
            {data.map((slice, i) => (
              <Cell key={slice.label} fill={slice.color ?? SERIES_COLORS[i % SERIES_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && <span className="font-display text-lg font-semibold">{centerValue}</span>}
          {centerLabel && <span className="text-[11px] text-muted-foreground">{centerLabel}</span>}
        </div>
      )}
      {showLegend && (
        <ul className="mt-2 space-y-1 text-xs">
          {data.map((slice, i) => (
            <li key={slice.label} className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color ?? SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                {slice.label}
              </span>
              <span className="font-medium">{slice.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CashflowChart({
  data,
  xKey,
  height = 260,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  height?: number | "100%";
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={40} tickFormatter={compactTick} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted))" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="inflow" name="Inflow" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="outflow" name="Outflow" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="net"
          name="Net cashflow"
          stroke="#E8B45C"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
