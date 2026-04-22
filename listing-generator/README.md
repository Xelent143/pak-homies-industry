# Listing Generator Module

Self-contained module for AI-powered product listing generation. Extracted from the admin app on 2026-04-09.

## What it does

End-to-end product listing creation:

1. **Pick or upload a model** — choose a saved try-on model, upload a reference image, or paste a link
2. **Add the garment** — upload product images or paste a URL; AI analyzes the garment
3. **AI generates everything** — listing images, infographics, full descriptions, SEO titles, alt text, slab pricing prefill
4. **Manual mockup updates** — re-roll any individual view, swap models, edit copy, save to catalog

## Folder layout

```
listing-generator/
├── README.md
├── client/
│   ├── AdminAIStudio.tsx          # Hub page with 4 tabs (Try-On, Designer, Listing Agent, Image Optimizer)
│   ├── AdminProductAutomation.tsx # Batch automation settings + queue UI
│   ├── AIProductAgent.tsx         # SEO Listing Agent — multi-turn chat → product + images
│   ├── FashionDesignerStudio.tsx  # Quick Designer — generates 4-view garment grid + prefill
│   ├── VirtualTryOnAgent.tsx      # Try-On — model scan + garment composite
│   └── AIImageOptimizer.tsx       # Image SEO optimizer — alt text, captions, filenames
└── server/
    ├── agentRouter.ts             # tRPC router (chat, generateProduct, generateProductImage, infographic, optimizeImage, designerGrid, tryOn, savedModels…)
    ├── gemini.ts                  # Google Gemini API client (chat, image gen, analysis, try-on, prefill)
    └── productAutomation.ts       # Background worker — queue, scheduler, batch tryOn → product drafts
```

## How it's wired into the app

**Client side** — registered in `client/src/App.tsx` via the `@listing-generator` Vite alias:

```ts
const AdminAIStudio = lazy(() => import("@listing-generator/client/AdminAIStudio"));
const AdminProductAutomation = lazy(() => import("@listing-generator/client/AdminProductAutomation"));
```

Routes mounted at:
- `/admin-saad/ai-studio` → AdminAIStudio
- `/admin-saad/product-automation` → AdminProductAutomation

**Server side** — `server/routers.ts` imports the tRPC router:

```ts
import { aiAgentRouter } from "../listing-generator/server/agentRouter";
import {
  ensureProductAutomationTables,
  productAutomationRequestBudgetPerSource,
  triggerProductAutomationQueueRun,
} from "../listing-generator/server/productAutomation";
```

The background scheduler is started by `server/_core/index.ts`:

```ts
import { startProductAutomationScheduler } from "../../listing-generator/server/productAutomation";
```

## Path aliases

| Alias | Resolves to |
|---|---|
| `@listing-generator/*` | `<repo>/listing-generator/*` (Vite + tsconfig) |

## External dependencies inside the module

These are the only "outside" things this module reaches into. If you ever move it to a separate package, these are the seams to mock or re-export:

- `server/_core/env` — environment variables (Gemini key, Stripe, etc.)
- `server/_core/trpc` — `protectedProcedure`, `router` builders
- `server/storage` — `storagePut` (S3/cloud upload)
- `server/db` — Drizzle queries for `product*`, `productAutomation*`, `savedTryOnModel`
- Standard `@/components/ui/*` (shadcn primitives) and `@/pages/layouts/AdminLayout`

## Notes

- The `productAutomationRouter` (the tRPC slice) currently lives inline in `server/routers.ts` — only the *worker functions* are inside this module. If you want a fully self-contained router, that block can be moved into `agentRouter.ts` or a sibling `automationRouter.ts`.
- Original locations (now removed):
  - `client/src/pages/admin/AdminAIStudio.tsx`
  - `client/src/pages/admin/AdminProductAutomation.tsx`
  - `client/src/components/admin/{AIProductAgent,FashionDesignerStudio,VirtualTryOnAgent,AIImageOptimizer}.tsx`
  - `server/ai/{agentRouter,gemini}.ts`
  - `server/automation/productAutomation.ts`
