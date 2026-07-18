<<<<<<< HEAD
# Welcome to your Enter project

[![Built with enter.pro](https://img.shields.io/badge/Build%20with-Enter.pro-FC5776?style=for-the-badge&labelColor=1F1F1F)](https://enter.pro)

*Automatically synced with your [enter.pro](https://enter.pro) workspace* 

---

## Overview

This repository is automatically linked to your app on [enter.pro](https://enter.pro).  
Every change you make in Enter will be reflected here — and any updates you push to this repo will sync back seamlessly.  

Enter.pro helps you **build, edit, and deploy full-stack web apps by prompting**.  
Just describe what you want — Enter turns ideas into production-ready code.

---

## Project URLs

**Live app:** https://<project-id>-latest.preview.enter.pro  
**Edit & build in Enter:** https://enter.pro/project/<project-id>


---

## Continue building

Keep developing your app directly in [Enter.pro](https://enter.pro/project/<project-id>).  
Prompt new features, refine the UI, or connect integrations — all changes are versioned and synced automatically to GitHub.

---

## Local development

Prefer to work locally? You can clone this repo and start developing right away:

```bash
# Step 1: Clone your project repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate into the project folder
cd <YOUR_PROJECT_NAME>

# Step 3: Install all dependencies
pnpm install

# Step 4: Start the local development server
pnpm dev
```

Push your commits — Enter.pro will automatically detect and sync your latest changes.

---

## i18n

This template ships a minimal browser-side i18n baseline built on:

- `i18next`
- `react-i18next`
- `i18next-http-backend`
- `i18next-browser-languagedetector`

### Source-of-truth files

The template only owns three pieces of i18n data:

- `i18n.config.json` — language manifest (`fallbackLng`, `languages[].{code,label,detect,dir}`)
- `public/locales/{code}.json` — flat dotted-key translations, one file per language
- `src/i18n/config.ts` + `src/i18n/util.ts` — runtime entry and pure helpers
- `src/components/language-switcher.tsx` — neutral-themed UI sample

### Runtime behavior

- reads the manifest from `i18n.config.json`
- loads translations from `public/locales/{code}.json` via `i18next-http-backend`
- detects language from cookie, browser, then html tag; caches in the `i18next` cookie
- normalizes unsupported languages to `fallbackLng` (no invalid values stored in cookies)
- syncs `<html lang>` and `<html dir>` on init and on `languageChanged`
- treats keys as flat strings: both `keySeparator` and `nsSeparator` are disabled

### Using translations in components

Import directly from `react-i18next`. No project-specific hook or cast is needed.

```tsx
import { useTranslation } from "react-i18next";

const Title = () => {
  const { t } = useTranslation();
  return <h1>{t("home.hero.title")}</h1>;
};
```

For language switching, the `i18n` instance also comes from `useTranslation()`:

```tsx
const { i18n } = useTranslation();
void i18n.changeLanguage("zh-CN");
```

`languageOptions`, `normalizeLanguage`, `getLanguageDirection`, and `fallbackLng` can be imported from `@/i18n/config` (re-exports from `util.ts`).

### Adding a language

1. Add an entry under `languages` in `i18n.config.json` with `code`, `label`, `detect`, `dir`.
2. Create `public/locales/{code}.json` with the same key set as `public/locales/{fallbackLng}.json`.
3. Translate values, preserving any `{{variables}}` and `<tag>...</tag>` structures.

### Adding a translation key

1. Add the key to `public/locales/{fallbackLng}.json` first.
2. Add the same key to every other locale file with its translated value.
3. Use it via `t("group.key")` in components.

### Backend handoff (temporary in-repo files)

The following files are **temporary copies kept in the repo only until backend integration is complete**. The backend will eventually own validation, statistics, completion-rate dashboards, scan-for-new-strings, and auto-translate. After that integration lands, these files (and the corresponding `package.json` scripts) will be removed:

- `scripts/check-i18n.mjs`, `scripts/scan-i18n.mjs`, `scripts/i18n-utils.mjs`, `scripts/i18n-source-usage.mjs`
- `i18n.scan.json`
- `reports/i18n/`
- `docs/i18n-agent-spec.md`, `docs/i18n-contract.md`
- `package.json` scripts: `i18n:check`, `i18n:scan`, and the `check` aggregate

Until removed, you can still run `pnpm i18n:check` and `pnpm i18n:scan` locally; the canonical computation is the backend's responsibility.

---

## Tech stack

This project uses:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## Deployment

To deploy, open your Enter.pro project and click "Publish"

Your app will automatically build and go live at your production URL.

---

✨ Keep prompting, keep building — Enter.pro handles the rest.
=======
# DIGICOOLS

**The World's Smartest AI Digital Marketplace** — Phase 1 foundation.

This is a real, working codebase: authentication, database schema with RLS,
product listing, product detail pages, cart, Stripe checkout, order
fulfillment via webhook, secure downloads, a basic seller dashboard with
product creation, and a buyer order-history dashboard. It is **not** the
full 15-module spec from the original brief — see "What's built vs what's
next" below for an honest breakdown.

---

## 1. Stack

- Next.js 14 (App Router) + TypeScript + Tailwind + shadcn-style UI
- Supabase (Postgres + Storage) for data
- Clerk for authentication (email/password, social login, 2FA available in Clerk dashboard)
- Stripe for payments
- Resend for transactional email
- Docker + Nginx for deployment on a Hostinger VPS

---

## 2. One-time service setup

### 2.1 Supabase
1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then optionally `supabase/seed.sql`.
3. Go to **Project Settings → Authentication → Third Party Auth** and add **Clerk**
   as a provider (paste your Clerk "Frontend API URL" from the Clerk dashboard).
   This is what lets `auth.jwt() ->> 'sub'` in our RLS policies read the Clerk user id.
4. Copy your Project URL, anon key, and service role key into `.env`.

### 2.2 Clerk
1. Create an application at clerk.com.
2. Under **JWT Templates**, create a new template named exactly `supabase`
   (this repo requests it via `getToken({ template: "supabase" })`). Use Clerk's
   Supabase template preset if offered, or set the `aud` claim to `authenticated`.
3. Under **Webhooks**, add an endpoint: `https://digicools.com/api/webhooks/clerk`,
   subscribe to `user.created`, `user.updated`, `user.deleted`. Copy the signing
   secret into `CLERK_WEBHOOK_SECRET`.
4. Copy your publishable + secret keys into `.env`.

### 2.3 Stripe
1. Copy your secret + publishable keys into `.env`.
2. Add a webhook endpoint: `https://digicools.com/api/webhooks/stripe`,
   subscribe to `checkout.session.completed`, `checkout.session.expired`,
   `charge.refunded`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
3. (Optional, Phase 2) Enable Stripe Connect if you want to pay sellers out
   directly instead of manual payouts.

### 2.4 Resend
1. Verify your sending domain (or a subdomain like `mail.digicools.com`).
2. Copy the API key into `.env`.

---

## 3. Local development

```bash
cp .env.example .env.local   # fill in real keys
npm install
npm run dev
```

App runs at `http://localhost:3000`. For Stripe/Clerk webhooks locally, use
the Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`)
and `ngrok`/Clerk's local webhook tooling respectively.

---

## 4. Deploying to your Hostinger VPS (digicools.com)

1. SSH into the VPS and install Docker + Docker Compose:
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo apt install docker-compose-plugin -y
   ```
2. Point your domain's DNS (in Hostinger's DNS zone, or wherever `digicools.com`
   is managed) with **A records** for `digicools.com` and `www.digicools.com`
   to your VPS's IP address.
3. Clone this repo onto the VPS at `/opt/digicools`:
   ```bash
   git clone <your-repo-url> /opt/digicools
   cd /opt/digicools
   cp .env.example .env   # fill in real production keys
   ```
4. Get your first SSL certificate (before Nginx has one to serve, run certbot
   once in standalone mode, then switch to the webroot flow already wired
   into `docker-compose.yml`):
   ```bash
   sudo docker run --rm -p 80:80 \
     -v /opt/digicools/nginx/certbot/conf:/etc/letsencrypt \
     certbot/certbot certonly --standalone -d digicools.com -d www.digicools.com
   ```
5. Build and start everything:
   ```bash
   docker compose up -d --build
   ```
6. Visit `https://digicools.com`.

### Continuous deployment
`.github/workflows/deploy.yml` will SSH into your VPS and redeploy on every
push to `main`. Add these repository secrets in GitHub:
`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (a private key whose public half is in
the VPS's `~/.ssh/authorized_keys`).

### Editing after deployment
Because this is a normal Next.js/Git repo, you edit it the same way anywhere:
- Locally: edit files, `git commit`, `git push` → CI/CD redeploys automatically.
- Directly on the VPS: edit files in `/opt/digicools`, then
  `docker compose up -d --build`.
- Ask Claude Code (or this chat) to make changes to the files and re-export them.

---

## 5. What's built vs what's next

**Built and functional in this codebase:**
- Auth (Clerk) with buyer/seller roles synced into Postgres
- Full relational schema with RLS, triggers, audit log, indexes (`supabase/migrations/0001_init.sql`)
- Marketplace browsing, category filter, text search, SEO metadata + JSON-LD + sitemap/robots
- Cart (persisted client-side) + Stripe Checkout + webhook-driven order fulfillment
- Secure, token-based instant downloads
- Buyer dashboard (order history + downloads)
- Seller dashboard (product list + submission form, goes to `pending_review`)

**Not yet built — real, scoped next milestones** (the original brief's full
list — admin dashboard, affiliate system, subscriptions, AI features, reviews
UI, coupons UI, refunds UI, support tickets UI, seller payouts/Stripe Connect,
file upload widget, Typesense search, Posthog analytics — is a multi-month
build). Tell me which of these to build next and I'll continue module by
module in the same pattern used here: real schema + real API routes + real
UI, no placeholders.

---

## 6. Environment variables
See `.env.example` for the full list with comments.
>>>>>>> 7e24a8c76b368051495b54d4f5457a4cf185f225
