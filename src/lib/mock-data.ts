// Realistic placeholder data for the module skeletons. Replace with live
// Supabase queries as each module's real logic is built.

export const milestones = [
  { name: "Foundation complete", date: "2026-08-02", status: "on-track" as const },
  { name: "Structure topped out", date: "2026-09-15", status: "at-risk" as const },
  { name: "Building enclosed", date: "2026-11-01", status: "on-track" as const },
  { name: "MEP rough-in complete", date: "2026-12-10", status: "delayed" as const },
];

export const riskRegister = [
  { label: "Rebar supply delay", severity: 78 },
  { label: "Weather — monsoon window", severity: 55 },
  { label: "Subcontractor mobilization", severity: 34 },
];

export const cashflowTrend = [
  { month: "Feb", planned: 420, actual: 390 },
  { month: "Mar", planned: 610, actual: 560 },
  { month: "Apr", planned: 780, actual: 705 },
  { month: "May", planned: 940, actual: 860 },
  { month: "Jun", planned: 1120, actual: 990 },
  { month: "Jul", planned: 1310, actual: 1180 },
];

export const spiCpiTrend = [
  { period: "P1", spi: 1.02, cpi: 0.98 },
  { period: "P2", spi: 0.97, cpi: 0.95 },
  { period: "P3", spi: 0.95, cpi: 0.93 },
  { period: "P4", spi: 0.96, cpi: 0.9 },
  { period: "P5", spi: 0.94, cpi: 0.89 },
];

export const progressByDiscipline = [
  { discipline: "Civil", planned: 82, actual: 78 },
  { discipline: "Structure", planned: 65, actual: 60 },
  { discipline: "MEP", planned: 40, actual: 31 },
  { discipline: "Finishes", planned: 15, actual: 9 },
];

export const projects = [
  { id: "PRJ-101", name: "Meridian Tower — Phase 2", spi: 0.96, cpi: 0.91, progress: 62, status: "On Track" },
  { id: "PRJ-102", name: "Harborview Logistics Park", spi: 0.88, cpi: 0.85, progress: 41, status: "At Risk" },
  { id: "PRJ-103", name: "Northgate Retail Complex", spi: 1.04, cpi: 1.01, progress: 77, status: "Ahead" },
  { id: "PRJ-104", name: "Cedar Ridge Residences", spi: 0.79, cpi: 0.82, progress: 28, status: "Delayed" },
];

export const criticalActivities = [
  { id: "A-1140", name: "Foundation — Pour Zone C", finish: "2026-08-02", float: 0, status: "In Progress" },
  { id: "A-1185", name: "Structural Steel Erection L3-L5", finish: "2026-08-19", float: 0, status: "Not Started" },
  { id: "A-1220", name: "MEP Rough-in — Core", finish: "2026-09-04", float: 0, status: "Not Started" },
  { id: "A-1260", name: "Curtain Wall Install — North", finish: "2026-09-22", float: 2, status: "Not Started" },
];

export const scheduleHealthChecks = [
  { label: "Open ends", count: 4, severity: "warning" as const },
  { label: "Negative float activities", count: 2, severity: "critical" as const },
  { label: "Missing logic (no predecessor/successor)", count: 6, severity: "warning" as const },
  { label: "Constraints conflicting with baseline", count: 1, severity: "critical" as const },
  { label: "High-float activities (>44 days)", count: 11, severity: "good" as const },
];

export const importJobs = [
  { id: "IMP-0091", file: "Meridian_Tower_P2.xer", type: "XER", status: "Stubbed — sample data loaded", uploaded: "2026-07-21" },
  { id: "IMP-0090", file: "Cedar_Ridge_Baseline.mpp", type: "MPP", status: "Stubbed — sample data loaded", uploaded: "2026-07-18" },
  { id: "IMP-0089", file: "Northgate_Schedule.xlsx", type: "Excel", status: "Stubbed — sample data loaded", uploaded: "2026-07-14" },
];

export const boqItems = [
  { code: "03.30.10", desc: "Cast-in-place concrete, footings", unit: "m³", qty: 1240, rate: 148, billed: 62 },
  { code: "05.12.00", desc: "Structural steel framing", unit: "t", qty: 380, rate: 2450, billed: 40 },
  { code: "09.65.00", desc: "Resilient flooring", unit: "m²", qty: 6200, rate: 34, billed: 0 },
  { code: "23.05.00", desc: "HVAC common work", unit: "LS", qty: 1, rate: 410000, billed: 18 },
];

export const purchaseOrders = [
  { id: "PO-2231", vendor: "Steelworks Supply Co.", item: "Structural steel — grade 50", value: "$482,000", status: "Delayed" },
  { id: "PO-2229", vendor: "Apex Concrete", item: "Ready-mix concrete, 4000psi", value: "$96,400", status: "On Time" },
  { id: "PO-2224", vendor: "Meridian Glazing", item: "Curtain wall unitized panels", value: "$1,120,000", status: "On Time" },
  { id: "PO-2218", vendor: "CoolAir Mechanical", item: "Rooftop AHU package", value: "$264,500", status: "At Risk" },
];

export const vendors = [
  { name: "Steelworks Supply Co.", category: "Structural Steel", rating: 4.2, openPOs: 3 },
  { name: "Apex Concrete", category: "Concrete", rating: 4.7, openPOs: 5 },
  { name: "Meridian Glazing", category: "Facade", rating: 4.5, openPOs: 2 },
  { name: "CoolAir Mechanical", category: "HVAC", rating: 3.9, openPOs: 1 },
];

export const dailyReports = [
  { date: "2026-07-22", crew: 42, weather: "Clear, 28°C", incidents: 0, snags: 3 },
  { date: "2026-07-21", crew: 38, weather: "Overcast, 24°C", incidents: 1, snags: 5 },
  { date: "2026-07-20", crew: 45, weather: "Clear, 30°C", incidents: 0, snags: 2 },
];

export const snagList = [
  { id: "SNG-441", location: "L3 — Grid C4", desc: "Ceiling grid misalignment", priority: "Medium", status: "Open" },
  { id: "SNG-440", location: "L1 — Lobby", desc: "Cracked floor tile", priority: "Low", status: "Open" },
  { id: "SNG-438", location: "L5 — Grid A1", desc: "Missing fire caulking", priority: "High", status: "In Progress" },
];

export const notifications = [
  { id: 1, actor: "Sarah Chen", action: "approved variation order VO-014", time: "2h ago" },
  { id: 2, actor: "AI Copilot", action: "flagged 2 negative-float activities on Meridian Tower", time: "5h ago" },
  { id: 3, actor: "Mike Torres", action: "commented on PO-2231 delivery delay", time: "1d ago" },
  { id: 4, actor: "Priya Nair", action: "submitted daily report for Cedar Ridge", time: "1d ago" },
];

