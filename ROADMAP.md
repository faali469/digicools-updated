# Roadmap

DigiCools today is a real, working foundation: auth, multi-tenant orgs, plan-gated
modules, a live drag/resize dashboard builder, an Integration Hub, and 12 core
construction-management modules with mock data. This document is the honest gap
between that and the full "Construction Digital Twin" vision — what's not built,
why, and what it would take.

Nothing below is stubbed with placeholder UI in the app. A fake "IoT sensor" page
with no sensor behind it is worse than no page — it makes the product look more
finished than it is. These stay listed here until there's something real to ship.

## Requires vendor credentials/licenses (code-ready, blocked on you)

These need API keys, OAuth app registrations, or paid capacity that only the
account owner can obtain — see the Integration Hub (`/integrations`) for the
full list and what each one needs:

- Power BI Embedded / REST API / DirectQuery — Azure Power BI Embedded workspace + capacity
- Primavera Cloud, ACC, BIM 360, Procore — each vendor's own OAuth app credentials
- SAP S/4HANA, Oracle ERP Cloud — enterprise API access
- Microsoft Entra ID / SAML / OIDC SSO — identity provider registration + tenant admin consent
- SharePoint, OneDrive, Google Drive, Teams, Slack, Outlook — respective OAuth apps

## Requires new infrastructure or hardware (real engineering projects, not stubs)

- **BIM Viewer** (IFC, RVT, NWD) — needs a 3D rendering engine (e.g. Autodesk
  Forge Viewer or an open-source IFC.js pipeline), file conversion services,
  and significant storage/bandwidth for large model files.
- **4D Construction Simulation** — schedule-linked BIM playback; depends on the
  BIM Viewer existing first, plus a timeline-scrubbing engine.
- **5D Cost Planning** — BOQ-to-BIM element linking; depends on the BIM Viewer
  and a much deeper quantity-takeoff data model than the current BOQ table.
- **Drone Progress Monitoring** — needs a drone data ingestion pipeline
  (photogrammetry/point-cloud processing) and storage for large imagery sets.
- **AI Photo Progress Recognition** — needs a trained computer-vision model
  (or a vendor API) and a labeled dataset of site photos to validate against.
- **IoT Sensors** — needs a device/telemetry ingestion service (MQTT or
  similar), device provisioning, and actual sensors on a real site to test
  against.
- **RFID Material Tracking** — needs RFID reader hardware integration and a
  materials/inventory data model deeper than what exists today.

## Product scope not yet built (buildable with current stack, just not done)

- Contract & Claims Management module
- Portfolio Management Office (PMO) / multi-project portfolio dashboard
- AI Forecasting Engine (cashflow/cost/completion prediction — the AI Copilot
  today gives canned answers, not real predictive models)
- Executive Command Center (a purpose-built rollup view across all projects,
  distinct from the per-project Executive Dashboard that exists now)
- Report generation, scheduling and distribution (`/reports` is currently a
  static gallery — no PDF/PPT/Excel generation or subscriptions yet)
- Fine-grained per-role permission matrix (roles exist and are real —
  see Admin → Team — but permissions are still just plan-gated by module,
  not configurable per role)
- Full-text/API developer console (the "Developer Portal" from the spec)

## How to prioritize from here

Tell me which of the "not yet built" items matters most for your actual
customers first — that's the fastest path to something real, versus spreading
effort thin across a 15-item wishlist.
