// Mock data sized to match the reference executive-dashboard layout.
// Replace with live Supabase queries once planning/controls data is real.

export const projectContext = {
  company: "DigiCools Infra Pvt. Ltd.",
  project: "Navi Mumbai International Airport",
  phase: "Construction",
  location: "Navi Mumbai, India",
  schedule: "Main Construction Schedule",
  baseline: "Baseline - B1",
  reportingDate: "20 May 2026",
};

export const projectOverview = {
  start: "01 Jan 2024",
  plannedFinish: "31 Dec 2026",
  elapsedDays: 506,
  remainingDays: 590,
  totalDuration: 1096,
  completedDays: 506,
  weather: { condition: "Partly Cloudy", tempC: 32, windKmh: 12, humidity: 65, rainChance: 10 },
  activities: { total: 12745, completed: 3987, inProgress: 4312, notStarted: 4446 },
};

export const execKpis = {
  timePerformance: { spi: 0.87, percent: 62.35, trend: "Behind Schedule" as const, spark: [58, 60, 59, 61, 60, 62.35] },
  costPerformance: { cpi: 0.91, percent: 68.45, trend: "Under Budget" as const, spark: [70, 69, 71, 68, 70, 68.45] },
  physicalProgress: { planned: 68.12, actual: 62.35, variance: -5.77 },
  totalBudgetCr: { budget: 12350, committed: 8425, spent: 6812.45 },
  manpower: { onSite: 4752, planned: 5800, variancePct: -18.07 },
  safety: { trir: 2.35, target: 1.5 },
};

export const sCurve = [
  { month: "Jan 2024", planned: 2, actual: 2, forecast: 2 },
  { month: "May 2024", planned: 9, actual: 8, forecast: 9 },
  { month: "Sep 2024", planned: 20, actual: 18, forecast: 20 },
  { month: "Jan 2025", planned: 34, actual: 30, forecast: 34 },
  { month: "May 2025", planned: 52, actual: 47, forecast: 51 },
  { month: "Sep 2025", planned: 68, actual: 62.35, forecast: 65 },
  { month: "Jan 2026", planned: 82, actual: null, forecast: 79 },
  { month: "May 2026", planned: 91, actual: null, forecast: 88 },
  { month: "Sep 2026", planned: 97, actual: null, forecast: 95 },
  { month: "Dec 2026", planned: 100, actual: null, forecast: 100 },
];

export const evmTrend = [
  { month: "Jan 2024", pv: 200, ev: 200, ac: 190 },
  { month: "May 2024", pv: 1100, ev: 1000, ac: 1050 },
  { month: "Sep 2024", pv: 2600, ev: 2300, ac: 2500 },
  { month: "Jan 2025", pv: 4300, ev: 3800, ac: 4200 },
  { month: "May 2025", pv: 6500, ev: 5900, ac: 6400 },
  { month: "Sep 2025", pv: 8600, ev: 7700, ac: 8500 },
  { month: "Dec 2026", pv: 12350, ev: 7700, ac: 8500 },
];

export const criticalActivitiesFull = [
  { id: "A1050", name: "Terminal Building Structure", start: "15 Dec 2024", finish: "20 Aug 2025", float: 0, status: "Critical" as const },
  { id: "A1120", name: "ATC Tower", start: "01 Feb 2025", finish: "30 Sep 2025", float: 0, status: "Critical" as const },
  { id: "A1200", name: "Runway 08/26", start: "10 Jan 2025", finish: "15 Oct 2025", float: 0, status: "Critical" as const },
  { id: "A1310", name: "MEP Installation - Terminal", start: "01 Jul 2025", finish: "20 Apr 2026", float: 2, status: "Near Critical" as const },
  { id: "A1420", name: "Baggage Handling System", start: "15 Jul 2025", finish: "10 May 2026", float: 3, status: "Near Critical" as const },
];

export const lookAhead = [
  { name: "Roof Steel Structure Installation", start: "21 May 2026", finish: "25 May 2026", status: "Planned" as const },
  { name: "Concrete Pouring - Level 3", start: "22 May 2026", finish: "24 May 2026", status: "Planned" as const },
  { name: "MEP Duct Installation", start: "23 May 2026", finish: "29 May 2026", status: "Planned" as const },
  { name: "Façade Glazing Work", start: "24 May 2026", finish: "30 May 2026", status: "Planned" as const },
  { name: "Electrical Cable Trays", start: "25 May 2026", finish: "31 May 2026", status: "Planned" as const },
];

export const manpowerDistribution = [
  { label: "Engineers", value: 256, pct: 5.4 },
  { label: "Supervisors", value: 412, pct: 8.7 },
  { label: "Skilled Workers", value: 2145, pct: 45.1 },
  { label: "Semi-skilled Workers", value: 1356, pct: 28.5 },
  { label: "Unskilled Workers", value: 583, pct: 12.3 },
];

export const costSummary = [
  { label: "Civil", value: "₹5,210 Cr", pct: 42.2 },
  { label: "MEP", value: "₹3,250 Cr", pct: 26.3 },
  { label: "Electrical", value: "₹1,850 Cr", pct: 15.0 },
  { label: "Finishing", value: "₹1,240 Cr", pct: 10.0 },
  { label: "Others", value: "₹800 Cr", pct: 6.5 },
];

export const cashflowForecast = [
  { month: "May 2025", inflow: 1200, outflow: -900, net: 300 },
  { month: "Jun 2025", inflow: 1450, outflow: -1100, net: 350 },
  { month: "Jul 2025", inflow: 1600, outflow: -1350, net: 250 },
  { month: "Aug 2025", inflow: 1800, outflow: -1900, net: -100 },
  { month: "Sep 2025", inflow: 2100, outflow: -2250, net: -150 },
  { month: "Oct 2025", inflow: 1950, outflow: -1700, net: 250 },
];

export const procurementStatus = [
  { label: "Ordered", value: "₹4,690 Cr", pct: 68.5 },
  { label: "In Transit", value: "₹842 Cr", pct: 12.3 },
  { label: "Delivered", value: "₹664 Cr", pct: 9.7 },
  { label: "Pending", value: "₹646 Cr", pct: 9.5 },
];

export const materialStatus = [
  { label: "In Stock", value: "₹1,070 Cr", pct: 45.6 },
  { label: "In Transit", value: "₹606 Cr", pct: 25.8 },
  { label: "At Site", value: "₹430 Cr", pct: 18.3 },
  { label: "Consumed", value: "₹239 Cr", pct: 10.3 },
];

export const riskSummary = [
  { label: "High", value: 8, pct: 25.0 },
  { label: "Medium", value: 14, pct: 43.8 },
  { label: "Low", value: 10, pct: 31.3 },
];

export const recentIssues = [
  { id: "IS-1256", issue: "Delay in Steel Delivery", reportedBy: "Site Engineer", date: "20 May 2026", status: "Open" as const },
  { id: "IS-1255", issue: "Concrete Quality Problem", reportedBy: "QA/QC Engineer", date: "20 May 2026", status: "Open" as const },
  { id: "IS-1254", issue: "Crane Breakdown", reportedBy: "Site Supervisor", date: "19 May 2026", status: "In Progress" as const },
  { id: "IS-1253", issue: "Drawing Mismatch", reportedBy: "Planning Engineer", date: "18 May 2026", status: "Closed" as const },
];

export const recentDocuments = [
  { name: "NMA_Terminal_Structural_Drawing_Rev02", category: "Drawings", uploadedBy: "BIM Engineer", date: "20 May 2026" },
  { name: "MEP_Installation_Specification_v1.1", category: "Specification", uploadedBy: "MEP Engineer", date: "20 May 2026" },
  { name: "Method Statement - Raft Foundation", category: "Method Statement", uploadedBy: "Site Engineer", date: "19 May 2026" },
  { name: "Material Approval - Steel Grade Fe500", category: "Approval", uploadedBy: "QA/QC Engineer", date: "18 May 2026" },
];

export const milestonesTable = [
  { name: "1st Floor Completion", baseline: "30 Apr 2025", actualForecast: "28 Apr 2025", status: "Achieved" as const },
  { name: "Terminal Structure Completion", baseline: "30 Sep 2025", actualForecast: "10 Oct 2025", status: "At Risk" as const },
  { name: "MEP Rough-in Completion", baseline: "31 Dec 2025", actualForecast: "05 Jan 2026", status: "At Risk" as const },
  { name: "Project Completion", baseline: "31 Dec 2026", actualForecast: "15 Jan 2027", status: "At Risk" as const },
];

export const liveNotifications = [
  { id: 1, text: "Steel shipment arrived at site", time: "10 mins ago" },
  { id: 2, text: "PO #PO-5587 approved", time: "25 mins ago" },
  { id: 3, text: "Delay risk detected in activity A1050", time: "45 mins ago" },
  { id: 4, text: "Weather alert: Heavy rain expected", time: "1 hour ago" },
  { id: 5, text: "Weekly progress report is ready", time: "2 hours ago" },
];
