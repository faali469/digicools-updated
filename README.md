# DigiCools

The AI Construction Operating System — planning, project controls, procurement
and site execution in one platform.

> Note: this repo previously hosted a *different* product also called
> "DigiCools" (a digital-goods marketplace). That app has been retired and
> archived — see `archive/legacy-marketplace-app/` — and this domain/name now
> belongs to the construction platform below.

Real navigation, real Supabase auth/schema/RLS, multi-tenant orgs with
subscription-plan gating, a live drag/resize dashboard builder, and mock data
in every module. See [ROADMAP.md](ROADMAP.md) for what's deliberately not
built yet and why — nothing in this repo fakes a feature it doesn't have.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Radix) ·
Supabase (Postgres/Auth) · TanStack Query · Recharts · react-grid-layout · Framer Motion

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase URL + anon key
pnpm dev
```

`/` is the marketing page; sign up at `/signup` to reach the authenticated
app shell at `/dashboard`.

## Structure

```
src/
  app/
    (marketing)/        landing page, pricing
    (auth)/              login, signup, server actions
    (app)/               authenticated shell — one folder per module
    api/                 route handlers (copilot, imports)
  components/
    app-shell/            sidebar, topbar, AI copilot, charts, stat tiles, plan gate
    brand/                 logo mark/wordmark/watermark
    marketing/             landing page nav/footer
    layout/                 theme provider/toggle, aurora background
    ui/                      shadcn primitives (~40 components)
  lib/
    modules.ts             the module IA — single source of truth for nav + landing page + plan gating
    roles.ts                enterprise RBAC role vocabulary + labels
    plan.ts                 subscription plan tiers + access checks
    integrations.ts          integration catalog for the Integration Hub
    dashboard-widgets.ts     dashboard builder widget types/layout helpers
    mock-data.ts             placeholder data for every module
    org-context.tsx          React context for the current org (plan, brand color, role)
    supabase/                 browser/server Supabase clients + hand-authored types
supabase/
  migrations/               schema — orgs, projects, planning, QS, procurement, site,
                             dashboards, audit log, integrations, RBAC
archive/
  legacy-marketplace-app/    the previous "DigiCools" marketplace app this repo contained (see below)
```

## What's real vs. stubbed

| Area | Status |
|---|---|
| Auth (signup/login/session) | Real — Supabase Auth via `@supabase/ssr`, middleware-protected routes |
| Multi-tenant orgs, RBAC, subscription plans | Real — see `supabase/migrations/`, admin-editable in `/admin` |
| Plan-gated module access | Real — locked modules show an upgrade prompt in the sidebar and on direct navigation |
| Org branding (name/color/plan) | Real — admin-editable, brand color live-applied via CSS variables |
| Audit log | Real — org/profile edits are actually recorded and shown in `/admin` |
| Dashboard Builder | Real — drag/resize grid (`react-grid-layout`), layouts persist to Supabase |
| Integration Hub | Real catalog + connection-intent tracking; **no OAuth flows wired** — each card states what credentials it needs |
| Schedule imports (.XER/.MPP/.XLSX/.CSV/.XML) | UI + `import_jobs` table are real; **parsing is stubbed** — a row is recorded and sample activities are shown |
| AI Copilot | Real UI + `/api/copilot` endpoint; **replies are canned**, not a live LLM call |
| Reporting | `/reports` is a UI gallery only — no PDF/PPT/Excel generation yet |
| Power BI Embedded, SSO/SAML, SAP/Oracle ERP, BIM/IoT/drone | Not implemented — see [ROADMAP.md](ROADMAP.md) |

## Archive

`archive/legacy-marketplace-app/` holds the *previous* app this repo
contained: a Vite/React digital-goods marketplace, also branded "DigiCools",
merged with an Enter.pro starter template. It's unrelated to the construction
platform above and kept for reference only, not wired into the app.
