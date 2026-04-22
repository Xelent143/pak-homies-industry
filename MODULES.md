# SSM Template Modules

The cleaned SSM template ships with the modules below. The Developer agent enables only what the CEO's project plan calls for. Modules not used by a client should have their pages removed from the React Router config and their server routes commented out so they don't add weight to the bundle.

## Frontend pages (`client/src/pages/`)

| Page file | Module | Always-on? | Notes |
|---|---|---|---|
| `Home.tsx` | Core marketing | ✅ | Hero, value props, featured products, CTA |
| `About.tsx` | Core marketing | ✅ | Story, team, certifications, factory |
| `Services.tsx` | Core marketing | ✅ | Service offerings (OEM/ODM, etc.) |
| `Contact.tsx` | Core marketing | ✅ | Contact form + addresses |
| `RFQ.tsx` | Inquiry/Quote | ✅ | Request-for-quote form (B2B) |
| `Privacy.tsx`, `Terms.tsx`, `Shipping.tsx` | Legal | ✅ | Boilerplate legal pages |
| `Products.tsx` | Catalog | ⚙️ | Category landing — toggle if catalog is enabled |
| `ProductDetail.tsx` | Catalog | ⚙️ | Single product page |
| `Shop.tsx` | Shop | ⚙️ | Storefront grid + filtering |
| `Checkout.tsx`, `CheckoutSuccess.tsx`, `CheckoutCancel.tsx` | Shop / Stripe | ⚙️ | Stripe checkout flow |
| `Customize.tsx` | 3D Configurator | ⚙️ | Three.js interactive product customizer |
| `Design2D.tsx`, `DesignStudio.tsx`, `BrandingStudio.tsx` | Label / Brand designer | ⚙️ | Browser-based 2D label / branding tools |
| `TechPackCreator.tsx` | Techpack generator | ⚙️ | Spec-sheet builder + PDF export |
| `GeoLanding.tsx` | Location landing pages | ⚙️ | Programmatic per-city/region SEO+GEO landing pages |
| `Blog.tsx`, `BlogPost.tsx` | Blog | ⚙️ | Markdown / DB-driven blog |
| `Portfolio.tsx` | Portfolio | ⚙️ | Case study gallery |
| `Admin.tsx`, `AdminLogin.tsx`, `AdminNewProduct.tsx`, `pages/admin/*` | Admin | ⚙️ | Auth-gated CMS for products/orders |
| `ComponentShowcase.tsx` | Dev only | ❌ | Internal style guide. Remove for client builds. |

Legend: ✅ always on, ⚙️ optional per project, ❌ remove before delivery.

## Backend modules (`server/`)

| Path | Module | Notes |
|---|---|---|
| `_core/` | Core | tRPC setup, env loader, image generation hook, LLM client, OAuth, system router. Always required. |
| `routers.ts`, `routes/` | API surface | Top-level tRPC + REST routes. Remove unused subroutes per project. |
| `db.ts` + `drizzle/` | Database | Drizzle schema + helpers. MySQL by default. |
| `auth.local.ts` | Auth | Local auth helper used by Admin module. |
| `ai/agentRouter.ts`, `ai/gemini.ts` | AI | Gemini integration; powers product auto-listing and any AI features. Requires `GEMINI_API_KEY`. |
| `automation/productAutomation.ts` | AI auto-listing | Generates product listings (title, description, specs, SEO) from photos + minimal facts. Disable if catalog is not enabled. |

## Module enable/disable workflow (since there is no `template.config.ts`)

The original repo's templating model is **edit `template-config/*.config.ts` per client, then run `pnpm apply-template`**. There is no single boolean flag for enabling/disabling features. The Developer agent's per-client workflow is therefore:

1. **Edit `template-config/brand.config.ts`** with the client's name, contact info, addresses, established year, social handles
2. **Edit `template-config/theme.config.ts`** with the design system colors, fonts, layout tokens from `04-design/design-system.md`
3. **Edit `template-config/categories.config.ts`** with the client's product/service categories from `01-intake/client-brief.md`
4. **Run `pnpm apply-template`** to propagate the configs across the codebase
5. **Disable unused pages** by removing them from the React Router config in `client/src/App.tsx` and pruning their server-side routes from `server/routers.ts`
6. **Replace assets** in `client/public/` with the WebP files from `04-design/assets/`
7. **Set `.env`** from `04-design/brand-identity.md` + `00-inbox/ceo-clarifications.md`

## Key environment variables (from `.env.example`)

| Var | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | ✅ | MySQL connection string |
| `SESSION_SECRET` | ✅ | Auth session signing key |
| `OWNER_OPEN_ID` | ✅ | Initial admin user identifier |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` | ⚙️ | S3 image uploads. Required if Admin or product photos are used. |
| `GEMINI_API_KEY` | ⚙️ | Required for AI auto-listing and any Gemini features |
| `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY` | ⚙️ | Required only if Shop/Checkout module is enabled |
| `SMTP_*` | ⚙️ | Outbound mail (RFQ notifications, order receipts) |

The Developer agent must NEVER commit a real `.env` to the client's GitHub repo — only `.env.example` ships, and real values are set in the host's environment panel by the Deployment agent.

## Module → SSM template guide cross-reference

| Agency module name (from `skills/ssm-template-guide.md`) | Reality in this repo |
|---|---|
| Core marketing pages | `client/src/pages/Home.tsx`, `About.tsx`, `Services.tsx`, `Contact.tsx`, `RFQ.tsx`, legal pages |
| Shop + product pages | `Shop.tsx`, `Products.tsx`, `ProductDetail.tsx`, `Checkout*.tsx`, server `routers.ts` shop routes |
| 3D configurator | `Customize.tsx` (uses `@react-three/fiber` + drei) |
| Woven label / branding designer | `Design2D.tsx`, `DesignStudio.tsx`, `BrandingStudio.tsx` |
| Techpack generator | `TechPackCreator.tsx` + server PDF generation in `server/routes/` |
| AI auto-listing | `server/automation/productAutomation.ts` + `server/ai/gemini.ts` |
| Location landing pages | `GeoLanding.tsx` + supporting routes |
| Auth + admin | `Admin.tsx`, `AdminLogin.tsx`, `AdminNewProduct.tsx`, `pages/admin/`, `server/auth.local.ts` |
| Inquiry / quote | `RFQ.tsx` + Contact form, server contact route |
| Blog | `Blog.tsx`, `BlogPost.tsx` + server blog routes |
| Portfolio (extra, not in original guide) | `Portfolio.tsx` |
