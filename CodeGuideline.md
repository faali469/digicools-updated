# Code Guideline

## Structure

- Routing is Next.js App Router under `src/app/`. Route groups `(marketing)`,
  `(auth)`, `(app)` share layouts without adding URL segments.
- Every authenticated module lives at `src/app/(app)/<slug>/page.tsx`, where
  `<slug>` matches an entry in `src/lib/modules.ts` — that file is the single
  source of truth for the sidebar nav, the marketing feature grid, and route
  protection in `middleware.ts`. Add a module there first, then create its page.
- Module pages are client components (`"use client"`) — they're interactive
  (charts, tables with local state) and use mock data from `src/lib/mock-data.ts`.
  Swap mock data for a Supabase query as each module's real logic lands.
- Shared shell pieces (sidebar, topbar, AI copilot, chart wrappers, stat
  tiles, page header) live in `src/components/app-shell/`.
- shadcn/ui primitives in `src/components/ui/` are generated, not hand-edited —
  regenerate via the shadcn CLI rather than patching them directly.

## Supabase

- `src/lib/supabase/client.ts` — browser client (client components).
- `src/lib/supabase/server.ts` — server client (Server Components, Server
  Actions, Route Handlers) — always `await createClient()`.
- `middleware.ts` refreshes the session and redirects unauthenticated users
  away from any module route.
- Schema changes go in `supabase/migrations/` as timestamped `.sql` files.
  Apply with the Supabase CLI or MCP `apply_migration`, never by hand-editing
  the live database.

## Styling

- Tailwind tokens (colors, radius, fonts) are defined in `tailwind.config.ts`
  + CSS variables in `src/app/globals.css` — dark mode is the primary theme.
  Reuse `.glass-card`, `.shadow-glow`, `.shadow-elegant`, `.bg-gradient-primary`
  rather than inventing new ad hoc effects.
- Charts go through `src/components/app-shell/charts.tsx` (`TrendArea`,
  `TrendLine`, `ComparisonBar`) so color/legend/tooltip conventions stay
  consistent — don't drop raw `recharts` into a page.

## Stubs

Anything not fully implemented (schedule file parsing, AI Copilot replies,
Power BI/Azure AD) is marked with a `StubBadge` in the UI and a comment at the
top of its route handler explaining what a real implementation would replace.
Don't silently pretend a stub is real — keep the badge/comment until it isn't.
