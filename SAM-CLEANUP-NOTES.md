# SSM Template Cleanup Notes — Sialkot AI Masters

This file documents the cleanup pass that turned the original `Xelent143/SSM` repo into the reusable SSM base template for the agency. Read this before re-running cleanup or upgrading to a newer source version.

## Source

- Repo: `https://github.com/Xelent143/SSM.git`
- Branch: `main` (shallow clone, depth 1)
- Pulled on: 2026-04-07
- Pulled by: CEO via `templates/scripts/github_deliver.py` token (read-only use)

## What was removed

Excluded entirely (heavy or transient):
- `.git/` (42 MB) — template is a working copy, not a fork
- `dist/` (84 MB) — pre-built artifacts
- `uploads/` — sample/local uploaded files
- `outputs/` — generation outputs from prior runs
- `.manus/` — tool-specific working state
- `blog_drafts/` — historical drafts
- `node_modules/` — would be regenerated anyway

Removed during cleanup pass (dev/experimentation artifacts):
- `shop_page.html`, `shop_page_3001.html`, `shop_page_final.html`, `shop_page_prefeteched.html`, `shop_page_v2.html`, `shop_page_v3.html` — loose HTML experiments
- `admin_products.html` — loose admin experiment
- `replace-text.cjs`, `replace-text.js`, `replace-text.mjs`, `replace-text.py` — duplicate find/replace utilities
- `rename_admin.cjs`, `update_brand.js` — one-shot migration scripts
- `todo.md`, `typescript-errors.txt` — author-only working notes
- `.~lock.*.xlsx#` — LibreOffice lock files

Excluded from rsync but worth flagging:
- `check-db.ts`, `check_db.ts`, `fix_db.ts`, `tmp-db.ts`, `test-insert.ts`, `test_gemini.ts` — ad-hoc test/debug scripts

## What was kept (and why)

- `client/` — full Vite/React/Tailwind/shadcn frontend (the actual website)
- `server/` — Express + tRPC API, including `_core/`, `ai/`, `automation/`, `routes/`
- `shared/` — types and constants shared between client and server
- `template-config/` — **already-templated** brand, theme, and category configs (the heart of the customization layer)
- `drizzle/` — Drizzle ORM schema and migrations
- `sql/` — SQL setup scripts
- `scripts/` — useful scaffolding scripts (seed, apply-template, post-product-from-source)
- `standalone-generator/` — separate Vite app, kept for now (see Open Questions)
- `patches/` — npm patches needed for some dependencies
- All top-level config: `package.json`, `vite.config.ts`, `tsconfig.json`, `vitest.config.ts`, `drizzle.config.ts`, `components.json`, `.prettierrc`, `.prettierignore`, `.gitignore`
- Top-level docs: `README.md`, `TEMPLATE.md`, `AI_INSTRUCTIONS.md`, `DEPLOYMENT.md`, `SETUP-GUIDE.md`, `BLOG_STRATEGY.md`, audit/changelog files
- `.env.example`, `.env.production.example` — placeholder configs

## Secret scan results

- Final pattern scan run on the destination tree looked for `sk_live_…`, `AKIA…`, `ghp_…`, `github_pat_…`, `AIza…` — **zero hits** in real source files
- The only `sk_test_...` reference is in `SETUP-GUIDE.md` as a documentation placeholder, not a real key
- No `.env`, `.env.local`, `.env.production` files present — only `.example` variants
- `.gitignore` already excludes all `.env*` variants
- AWS / DB / Stripe / Gemini credentials are referenced only as placeholders in `.env.example`

**Verdict:** safe to ship as a template. Each new client build must still set its own `.env` outside the repo.

## Templating already in place

The original repo already implements a clean templating layer:

- `template-config/brand.config.ts` — site name, legal name, tagline, contact, social, addresses, year established, etc.
- `template-config/theme.config.ts` — colors (primary, secondary, accent), fonts, layout tokens
- `template-config/categories.config.ts` — product categories + subcategories
- `scripts/apply-template.ts` — applies the configs across the codebase
- `TEMPLATE.md` + `AI_INSTRUCTIONS.md` — human + AI customization guides

This means **the Developer agent does NOT need to write a `template.config.ts` from scratch** — the SSM template already has its own configuration layer, and the Developer simply edits `template-config/*.config.ts` per client.

The earlier `skills/ssm-template-guide.md` referenced a `template.config.ts` and a Next.js stack — both wrong. They've been updated to match reality (see "Stack reality" below).

## Stack reality (corrected)

Earlier agency docs assumed Next.js 14. The actual stack is:

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind + shadcn/ui + Three.js (`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`) |
| Mobile | Capacitor (optional) |
| Backend | Express + tRPC + Drizzle ORM |
| Database | MySQL |
| Storage | AWS S3 |
| AI | Google Generative AI (Gemini) |
| Payments | Stripe (optional) |
| Build | Vite (client + SSR) + esbuild (server) |
| Hosting | Hostinger (default), VPS, or any Node host |
| Package mgr | pnpm |

`skills/ssm-template-guide.md` and `agents/07-Developer.md` have been updated to match.

## Open questions / future cleanup work

These are intentional follow-ups, not blockers:

1. **`standalone-generator/`** — appears to be a separate Vite app. Decide whether to keep it bundled or split into its own template module.
2. **`drizzle/` schema migrations** — currently MySQL-specific. If a client needs Postgres, the schema will need a port.
3. **Hostinger-specific build script** — `package.json`'s default `build` is `"echo 'Skipping build on Hostinger - using pre-built dist folder'"`. The Developer agent should run `npm run build:local` for any non-Hostinger deployment.
4. **Capacitor** — kept in dependencies but not used by default web builds. Can be tree-shaken.
5. **Documentation files** — there are several historical audit/changelog `.md` files at the root (MEGA_CHANGELOG, PHASE_1, SPRINT_1_QA, WEBSITE_AUDIT_REPORT_LIVE_STATE, etc.). Consider moving them to a `docs/history/` folder so the template root stays clean.
6. **`.env.example` is comprehensive** — good. The Developer agent should copy it to `.env` in each client build and fill in real values per `00-inbox/ceo-clarifications.md`.

## Reproducing the cleanup

If you ever need to re-import a newer version of the source repo:

```bash
# 1. Clone fresh into /tmp
TOKEN=$(grep '^GITHUB_TOKEN=' "Web Agency/.env.txt" | cut -d= -f2-)
git clone --depth 1 "https://x-access-token:${TOKEN}@github.com/Xelent143/SSM.git" /tmp/ssm-clone

# 2. Rsync into the template folder (excludes match this cleanup)
rsync -a \
  --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='uploads' \
  --exclude='outputs' --exclude='.manus' --exclude='blog_drafts' \
  --exclude='.env' --exclude='.env.local' --exclude='.env.production' \
  --exclude='*.log' --exclude='*.db' \
  /tmp/ssm-clone/ "Sialkot-AI-Masters/templates/ssm-base/"

# 3. Re-run dev artifact cleanup (see "Removed during cleanup pass" above)
# 4. Re-run secret scan
# 5. Update SAM-CLEANUP-NOTES.md with the new pull date
```
