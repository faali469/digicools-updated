# DigiCools MVP — Plan

## Context
User's long-term vision is a huge "Netflix of digital products" platform (150+ pages, multi-vendor marketplace, AI tool suite, affiliate program, mobile app). That cannot be built in one shot. User selected a focused first round:

**Auth + Product Catalog + Subscription Payments (Stripe + Razorpay) + Gated Downloads + Admin Panel + AI Chat Assistant.**

Everything else from the master prompt (Blog, Affiliate, Creator Marketplace, full AI Tools suite, PWA/mobile app, gamification, multi-vendor payouts, etc.) is deferred to later phases and NOT part of this build.

**Tech stack correction:** This project runs on Vite + React + TypeScript + Tailwind + shadcn/ui + React Router (not Next.js — Next.js/SSR is not supported on this platform). Backend = Enter Cloud (Supabase: Postgres, Auth, Edge Functions, Storage). All "Next.js 15" references in the user's prompt will be implemented as Vite/React equivalents.

## Step 0 — Enable Backend (before any code)
1. `supabase_enable` — required for auth, database, storage, edge functions.
2. `enable_ai_capability` — required for the AI Chat Assistant (LLM calls from an edge function, per `enter_llm_integration` skill).
3. `supabase_add_secret` — collect `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` from the user once Cloud is enabled.

## Design System
Update `src/index.css` + `tailwind.config.ts` with DigiCools tokens (dark-first, premium):
- background `#0B0B0F`, card `#16161D`, primary indigo `#4F46E5`, secondary violet `#8B5CF6`, accent cyan `#06B6D4`, muted `#A1A1AA`, success `#22C55E`.
- Add gradient tokens (`--gradient-primary`, `--gradient-aurora`), glow shadows, glass-card utility class.
- Keep a light-mode variant for `.light`/default (dark is primary per brief) — toggle via existing shadcn dark-mode pattern.
- Font: Inter (already default-friendly), no new font import needed unless requested later.
- Add `framer-motion` dependency for hero/aurora/micro-animations.

## Database Schema (Supabase/Postgres, with RLS)
- `profiles` (id → auth.users, full_name, avatar_url, role text default 'user', download_count_used int default 0, created_at)
- `categories` (id, name, slug, icon, description)
- `products` (id, title, slug, description, category_id fk, thumbnail_url, preview_images text[], file_path (storage), tags text[], is_featured bool, downloads_count int default 0, rating numeric default 0, status text default 'published', created_at)
- `plans` (id, name, price_monthly, price_yearly, features jsonb, download_limit int null = unlimited)
- `subscriptions` (id, user_id fk, plan_id fk, status, provider 'stripe'|'razorpay', provider_subscription_id, current_period_end, created_at)
- `orders` (id, user_id, plan_id, amount, currency, provider, provider_payment_id, status, created_at)
- `downloads` (id, user_id, product_id, downloaded_at)
- `wishlist` (id, user_id, product_id, created_at, unique(user_id, product_id))

RLS: `products`/`categories`/`plans` public read, admin-only write; all user-owned tables (`subscriptions`, `orders`, `downloads`, `wishlist`, `profiles`) readable/writable only by the owning user; admin role (checked via `profiles.role = 'admin'`) can read/write everything. Product files stored in a private Storage bucket, served only via signed URL from an edge function that checks entitlement.

## Edge Functions
- `stripe-checkout` — create Checkout Session for a plan (monthly/yearly).
- `stripe-webhook` — verify signature, upsert `subscriptions`/`orders` on payment/renewal/cancel.
- `razorpay-checkout` — create Razorpay order for a plan.
- `razorpay-webhook` — verify signature, upsert `subscriptions`/`orders`.
- `get-download-url` — checks active subscription OR free-tier remaining quota (5), increments `downloads`/`download_count_used`, returns a signed Storage URL.
- `ai-chat` — proxies to Enter AI All (per `enter_llm_integration` skill) with the product catalog as context, returns product recommendations.

## Frontend Structure
- `src/contexts/AuthContext.tsx` — Supabase session/user/role state.
- `src/integrations/supabase/client.ts` — Supabase client.
- `src/hooks/` — `useProducts`, `useCategories`, `usePlans`, `useSubscription`, `useWishlist` (react-query, already installed).
- `src/components/layout/Navbar.tsx`, `Footer.tsx` — premium nav with search, auth state, dark mode.
- `src/components/marketplace/ProductCard.tsx`, `CategoryCard.tsx`, `FilterSidebar.tsx`.
- `src/components/auth/ProtectedRoute.tsx` — role-aware guard (user vs admin).
- `src/components/ai/AIChatWidget.tsx` — floating assistant, calls `ai-chat` edge function.

### Pages / Routes (added to `src/router.tsx`)
- `/` Home — aurora hero, AI search bar, trending/featured products, categories, pricing teaser, footer.
- `/marketplace`, `/marketplace/:categorySlug` — grid, search, filters, sorting.
- `/product/:slug` — gallery, description, related products, wishlist/download CTA.
- `/pricing` — animated plan cards, monthly/yearly toggle, "Most Popular" highlight.
- `/wishlist` — saved products (auth required).
- `/checkout` — plan summary + Stripe/Razorpay buttons.
- `/login`, `/signup`, `/forgot-password`, `/reset-password`.
- `/dashboard` (protected) — overview, `/dashboard/downloads`, `/dashboard/subscription`.
- `/admin` (protected, admin-only) — `AdminDashboard`, `/admin/products` (CRUD), `/admin/categories` (CRUD), `/admin/orders` (view/status), `/admin/users` (list/role).

## Verification
1. Sign up / log in / forgot-password flow works end-to-end via Supabase Auth.
2. Browse marketplace, filter by category, search, open product detail, add/remove wishlist.
3. Free user can download up to 5 products; 6th download is blocked with an upgrade prompt.
4. Subscribe via Stripe test mode → webhook fires → dashboard shows active plan → unlimited downloads unlocked.
5. Repeat purchase flow with Razorpay test mode.
6. Admin logs in, creates/edits/deletes a product and category, views orders and users list; non-admin cannot access `/admin`.
7. AI chat widget answers a natural-language query (e.g. "I need a resume template") with relevant product suggestions.
8. Lighthouse spot-check: no obvious layout shift, responsive on mobile widths, dark theme contrast passes.

---

## Status update — Stripe payment path added

The plan called for **Stripe + Razorpay**, but only Razorpay was ever wired up
(the Index page even advertised "Stripe & Razorpay protected checkout" while
Stripe didn't exist). This pass adds the missing Stripe path:

- `supabase/functions/stripe-checkout` — creates a Stripe Checkout Session
  (mode `payment` for one-time product purchases, mode `subscription` for
  plans) using dynamic `price_data`, so no pre-created Stripe Price objects
  are required. Writes a `pending` row to `orders` with `provider: "stripe"`,
  matching the existing Razorpay pattern.
- `supabase/functions/stripe-webhook` — verifies the `Stripe-Signature` header
  manually (HMAC-SHA256 over `{timestamp}.{payload}`), marks the matching
  order `paid` on `checkout.session.completed`, inserts a `subscriptions` row
  for plan purchases, and marks a subscription `cancelled` on
  `customer.subscription.deleted`.
- `src/pages/Checkout.tsx` now shows a payment-method toggle (Razorpay vs.
  Stripe card) when the total isn't $0. Stripe is a redirect-based hosted
  Checkout flow (`window.location.href = data.url`) — no Stripe.js needed
  client-side.
- `src/pages/admin/AdminOrders.tsx` had a display bug where product purchases
  (as opposed to plan subscriptions) showed "—" in the Item column because
  the query only ever selected `plans(name)`. Now also selects
  `products(title)` and falls back correctly, and shows `$`/`₹` based on the
  order's `currency`.

**New secrets required** (add via `supabase_add_secret` in Enter, or your
Supabase project's Edge Function secrets if self-hosting):

- `STRIPE_SECRET_KEY` — from the Stripe Dashboard (Developers → API keys).
- `STRIPE_WEBHOOK_SECRET` — from the Stripe Dashboard after registering a
  webhook endpoint pointing at `stripe-webhook` for the
  `checkout.session.completed` and `customer.subscription.deleted` events.

**Simplification to revisit before real launch:** Stripe checkout charges the
same numeric `amount` as Razorpay but in USD instead of INR (no FX
conversion). For production, either store a separate USD price per
plan/product or convert via a live exchange rate at checkout time.

Everything else deferred in the original plan (Blog, Affiliate program,
full AI Tools suite, PWA/mobile app, gamification, multi-vendor payouts)
remains deferred — not part of this pass.
