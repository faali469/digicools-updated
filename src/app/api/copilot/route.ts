import { NextResponse } from "next/server";

// STUB: rule-based canned responses keyed by module. Swap for a real LLM
// call (Anthropic/OpenAI) once a provider + API key are chosen — the
// request/response shape here is already what a real endpoint would use.
const CANNED_REPLIES: Record<string, string> = {
  dashboard:
    "Portfolio health is steady: 2 projects ahead of schedule, 1 project 6 days behind on the critical path due to a rebar delivery delay. Full breakdown is in Project Controls.",
  planning:
    "The critical path currently runs through Foundation → Structure → MEP Rough-in. Foundation has 3 open-ended activities with no successor — resolving those would tighten the network.",
  imports:
    "Schedule import parsing (.XER / .MPP) isn't wired up yet in this build — uploads are stored and a sample activity set is loaded so you can preview the workflow.",
  dashboards: "I can lay out a KPI + S-curve + cashflow dashboard for you — describe what you want tracked and I'll draft the layout.",
  "schedule-analyzer":
    "Schedule health score: 78/100. Found 4 open ends, 2 negative-float activities, and 1 constraint that conflicts with the baseline.",
  controls: "SPI is 0.94 and CPI is 0.89 this period — cost is the bigger risk right now. Want a recovery-cost breakdown?",
  qs: "3 variation orders are pending client approval, totaling roughly 4.2% of contract value.",
  procurement: "2 purchase orders are past their promised delivery date — both are on the structural steel package.",
  site: "Yesterday's site diary logged 42 workers, 1 safety observation (resolved), and 3 open snags.",
  reports: "I can draft a client-ready weekly report from this project's current data — want PDF or PPT?",
  collaboration: "You have 5 unresolved comment threads across 2 projects, 2 of them tagged urgent.",
  admin: "All roles are currently scoped correctly — no orphaned project memberships found.",
};

export async function POST(request: Request) {
  const { module } = await request.json();
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));

  const reply =
    CANNED_REPLIES[module] ??
    "This is a stubbed AI Copilot response — real model wiring comes once a provider is chosen.";

  return NextResponse.json({ reply });
}
