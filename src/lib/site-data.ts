export const crewTrend = [
  { day: "Mon", crew: 3980 },
  { day: "Tue", crew: 4120 },
  { day: "Wed", crew: 4350 },
  { day: "Thu", crew: 4600 },
  { day: "Fri", crew: 4750 },
  { day: "Sat", crew: 4200 },
  { day: "Sun", crew: 1800 },
];

export const safetyTrend = [
  { month: "Jan", incidents: 3, nearMisses: 8 },
  { month: "Feb", incidents: 2, nearMisses: 6 },
  { month: "Mar", incidents: 4, nearMisses: 9 },
  { month: "Apr", incidents: 1, nearMisses: 5 },
  { month: "May", incidents: 1, nearMisses: 4 },
];

export const inspections = [
  { id: "INSP-221", type: "Rebar Inspection", location: "L3 — Grid B2", date: "20 May 2026", result: "Pass" as const },
  { id: "INSP-220", type: "Concrete Pour Checklist", location: "L3 — Grid C4", date: "20 May 2026", result: "Pass" as const },
  { id: "INSP-219", type: "Fire Safety Walkdown", location: "L1 — Lobby", date: "19 May 2026", result: "Fail" as const },
  { id: "INSP-218", type: "Scaffold Inspection", location: "North Facade", date: "18 May 2026", result: "Pass" as const },
];
