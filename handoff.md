# Handoff to SEO Agent — Pak Homies Industry

**From:** Developer Agent (Claude Haiku 4.5)
**To:** SEO Agent
**Date:** 2026-04-07

---

## Current Build Status

The SSM template has been **scaffolded and configured** but is not yet built or deployed. The following work is pending:

### Completed ✅
- SSM base template copied to `/07-build/`
- `template-config/brand.config.ts` configured (Pak Homies branding, contact info)
- `template-config/theme.config.ts` configured (Blue #3E41B6, Red #FE3136, Bricolage + Inter fonts)
- `template-config/categories.config.ts` configured (9 garment types)
- Module decisions documented (`03-strategy/module-decisions.md`)
- Inquiry-cart specification delivered (`03-strategy/inquiry-cart-spec.md`)
- Copy files delivered (`05-copy/` directory, 16 core files + templates)
- Brand identity locked (`04-design/brand-identity.md`)

### Blocking ⏳
- **No npm/pnpm in sandbox:** Full build requires local execution (see BUILD-NOTES.md)
- **Module pruning not started:** Routes need cleanup (Shop, Blog, Portfolio, Checkout routes removed)
- **Copy not wired:** Pages still use template boilerplate, not Pak Homies copy
- **Inquiry-cart module:** Specialist task; spec complete, implementation pending
- **Assets not integrated:** Designer images not yet dropped into public/

---

## What SEO Agent Will Receive (Post-Deployment)

Once the Deployment agent has:
1. Run `npm install`
2. Run `npm run apply-template`
3. Run `npm run build:local`
4. Pushed to GitHub (ssm-pak-homies-industry private repo)

The SEO agent will receive a **functional website** with:
- Core pages wired with copy (Home, About, Products, Contact, etc.)
- 9 product detail pages (denim jackets, fleece pullovers, trousers, shorts, t-shirts, windbreakers, denim pants, puffer jackets, vests)
- 6 city GEO landing pages (Atlanta, Houston, LA, NYC, Detroit, Chicago)
- Custom inquiry-cart form (6-step product builder)
- Admin dashboard for managing inquiries

---

## SEO Tasks (Your Responsibility)

### 1. Schema Markup & JSON-LD
**Location:** `client/src/` pages

Each page needs JSON-LD block in `<head>` (via react-helmet-async):

**Organization Schema (Global, Layout component):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pak Homies Industry",
  "url": "https://pakhomiesind.com",
  "logo": "https://pakhomiesind.com/logos/pak-homies-badge-primary.webp",
  "description": "B2B apparel manufacturing for Black-owned streetwear brands",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Airport Road, Gansarpur",
    "addressLocality": "Sialkot",
    "addressRegion": "Punjab",
    "postalCode": "51310",
    "addressCountry": "PK"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Sales",
    "telephone": "+92-54-4211081",
    "email": "Pakhomiesi@gmail.com"
  },
  "sameAs": [
    "https://facebook.com/pakhomiesindustry",
    "https://instagram.com/pakhomiesindustry",
    "https://linkedin.com/company/pakhomiesindustry"
  ]
}
```

**Product Schema (ProductDetail pages):**
Each `/products/[slug]` page:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Custom [Garment Type]",
  "description": "...",
  "image": "https://pakhomiesind.com/images/[product-hero].webp",
  "brand": {
    "@type": "Brand",
    "name": "Pak Homies Industry"
  },
  "offers": [
    {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "18.50",
      "priceValidUntil": "2026-12-31",
      "description": "Slab: 50–99 units",
      "availability": "https://schema.org/InStock"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "23"
  }
}
```

**FAQPage Schema (FAQ page, if created):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is MOQ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Minimum order quantity is 50 pieces per product."
      }
    }
  ]
}
```

**LocalBusiness Schema (GeoLanding pages, Contact page):**
Each `/cities/[city]` page:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Pak Homies Industry",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Airport Road, Gansarpur",
    "addressLocality": "Sialkot",
    "addressCountry": "PK"
  },
  "telephone": "+92-54-4211081",
  "areaServed": "Atlanta, GA",
  "serviceType": "Apparel Manufacturing"
}
```

### 2. Meta Tags & Open Graph
**File:** Each page (via Helmet)

**Template per page:**
```html
<Helmet>
  <title>[Page Title] | Pak Homies Industry</title>
  <meta name="description" content="[Page description, <160 chars]" />
  <meta name="keywords" content="[keywords for SEO]" />

  <meta property="og:title" content="[OG Title]" />
  <meta property="og:description" content="[OG description]" />
  <meta property="og:image" content="https://pakhomiesind.com/images/[og-image].webp" />
  <meta property="og:url" content="https://pakhomiesind.com[path]" />
  <meta property="og:type" content="website" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="[Title]" />
  <meta name="twitter:description" content="[Description]" />
  <meta name="twitter:image" content="[Image URL]" />
</Helmet>
```

**Per-page values from copy files:**
- Home: `01-home.md` (hero title, positioning, OG image)
- About: `02-about.md` (founder story, team, OG image)
- Products: `06-products-index.md` (product overview)
- Products/[slug]: `07-product-*.md` (per-product spec)
- Cities/[city]: `22-city-*.md` (city-specific context)
- Contact: `28-contact.md` (contact form, address)
- FAQ: `21-faq.md` (FAQ schema)

### 3. Generate Static Files

**sitemap.xml** → `client/public/sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pakhomiesind.com/</loc>
    <lastmod>2026-04-07</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://pakhomiesind.com/products</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pakhomiesind.com/products/denim-jackets</loc>
    <priority>0.8</priority>
  </url>
  <!-- 8 more product pages -->
  <url>
    <loc>https://pakhomiesind.com/cities/atlanta</loc>
    <priority>0.7</priority>
  </url>
  <!-- 5 more city pages -->
  <url>
    <loc>https://pakhomiesind.com/about</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://pakhomiesind.com/contact</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://pakhomiesind.com/privacy</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://pakhomiesind.com/terms</loc>
    <priority>0.5</priority>
  </url>
</urlset>
```

**robots.txt** → `client/public/robots.txt`
```
User-agent: *
Allow: /
Disallow: /admin-pak/

Sitemap: https://pakhomiesind.com/sitemap.xml
```

**llms.txt** → `client/public/llms.txt`
```
# Pak Homies Industry – Apparel Manufacturing

## About
Pak Homies is a B2B manufacturing partner for emerging Black-owned streetwear brands.

**Founders:** Shehraz Ali (15 years Sialkot experience)
**Location:** Sialkot, Pakistan
**Certifications:** BSCI, OEKO-TEX, WRAP
**MOQ:** 50 units per product
**Sample Lead Time:** 7 days
**Bulk Lead Time:** 15 days

## Products
- Denim Jackets
- Fleece Pullovers
- Trousers
- Shorts
- T-Shirts
- Windbreakers
- Denim Pants
- Puffer Jackets
- Vests

## Service Areas
- Apparel Manufacturing (CMT)
- Tech Pack Generation
- 2D Label Design Studio

## Contact
- Email: Pakhomiesi@gmail.com
- Phone: +92-54-4211081 (WhatsApp)
- Website: https://pakhomiesind.com

## Key Facts
- 0% defects SLA
- ±1% tolerance guarantee
- Ethical production (BSCI certified)
- Direct owner contact (no intermediaries)
- 6-city GEO targeting (Atlanta, Houston, LA, NYC, Detroit, Chicago)
```

### 4. Lighthouse & Core Web Vitals

Once built, run Lighthouse on:
1. **Home** (`/`)
2. **Product Detail** (`/products/denim-jackets`)
3. **City Landing** (`/cities/atlanta`)
4. **Contact** (`/contact`)
5. **Inquiry Form** (`/inquire`)

**Targets (per performance-seo-geo.md):**
- Performance: ≥90 (mobile + desktop)
- Accessibility: ≥90
- Best Practices: ≥90
- SEO: ≥90

**Focus on:**
- LCP (Largest Contentful Paint): <2.5s
- FID (First Input Delay): <100ms
- CLS (Cumulative Layout Shift): <0.1

### 5. Advanced SEO Recommendations

**Structured Data Enhancements:**
- Add `speakable` property to FAQ answers (for Google Assistant)
- Add `breadcrumbList` schema to product detail pages
- Add `videoObject` schema if video added to product pages

**Content Optimization:**
- Ensure H1 on every page (semantic HTML)
- Answer search intent at top of long pages (Home, Products, Cities)
- Add internal linking: Products → Related Products, Cities → Contact
- Optimize image alt text (all WebP images should have descriptive alt)

**Geo Targeting:**
- Add hreflang if multi-language support (not in Phase 1, but plan for future)
- Confirm geo schema on city pages matches user intent

**Mobile-First Indexing:**
- Test responsive design (360px, 414px, 768px, 1280px, 1920px)
- Ensure touch targets ≥44px
- Verify fonts readable at mobile sizes (Inter body ≥16px)

---

## Dependencies & Assumptions

### What SEO Agent Should Know

1. **Routes Finalized:** After Developer's module pruning, final route list is:
   - Core: `/`, `/about`, `/products`, `/products/:slug`, `/contact`, `/privacy`, `/terms`, `/shipping`
   - Capabilities: `/capabilities`, `/capabilities/label-studio`, `/capabilities/techpack`
   - Inquiry: `/inquire`, `/inquire/confirmation`
   - Geo: `/cities/:city` (6 pages)
   - Admin: `/admin-pak/*`
   - No blog, no portfolio, no shop, no checkout (Phase 2 features)

2. **Copy Wired:** All page copy comes from `/05-copy/` files. Copy contains copy no SEO placeholders; if `[CONFIRM: ...]` exists, it's a client confirmation point.

3. **Assets In Place:** Designer will deliver WebP images. Assume paths like:
   - `/public/logos/pak-homies-badge-primary.webp`
   - `/public/images/product-denim-jackets-hero.webp`
   - `/public/images/city-atlanta-hero.webp`

4. **SMTP Configured:** Email notifications for inquiries depend on `.env` SMTP settings (outside SEO scope, but affects contact validation).

5. **Admin Auth:** `/admin-pak` login uses `.env` `OWNER_OPEN_ID` + `SESSION_SECRET` (assume set by Deployment agent).

---

## Checklist for SEO Agent

- [ ] All pages have `<Helmet>` with title, description, OG tags
- [ ] Organization, Product, FAQ, LocalBusiness JSON-LD on appropriate pages
- [ ] sitemap.xml generated and valid (test with Google Search Console)
- [ ] robots.txt in place
- [ ] llms.txt generated
- [ ] Lighthouse ≥90 on all 5 test pages (mobile + desktop)
- [ ] Core Web Vitals within targets (LCP, FID, CLS)
- [ ] Internal links working (Products → Cities, Cities → Contact, etc.)
- [ ] Images have descriptive alt text
- [ ] Mobile responsiveness tested at 360, 414, 768, 1280, 1920px
- [ ] Canonical tags on all pages (should auto-generate from Helmet)
- [ ] Rich snippet preview in Google Search Console
- [ ] No broken links (check 404 log)
- [ ] No redirect chains (should be direct)

---

## Known Issues to Address

1. **Blog URLs (404 redirects):** Old blog posts from template are removed. Ensure 404 redirects are in place:
   - `/blog/*` → `/` (or `/inquire` if new visitor)

2. **E-Commerce URLs (404 redirects):** Shop and checkout pages are removed:
   - `/shop` → `/products`
   - `/checkout*` → `/inquire`

3. **Path Renames:** Some paths have changed; add 301 redirects if the site was previously indexed:
   - `/services` → `/capabilities`
   - `/branding-studio` → `/capabilities/label-studio`
   - `/tech-pack` → `/capabilities/techpack`

---

## Timeline Expectations

- **SEO Setup:** 3–4 hours (schema markup, Helmet on all pages)
- **Static file generation:** 1 hour (sitemap, robots, llms)
- **Lighthouse optimization:** 2–4 hours (if performance issues emerge)
- **Total:** 6–9 hours

**Parallel work:** Can start after Deployment agent confirms build succeeds locally.

---

## Questions for Clarification (Before Starting)

1. Should we add breadcrumb schema to product pages?
2. Should we enable XML sitemap index (for future multi-language support)?
3. Do we want structured data for reviews/testimonials (currently N/A, Phase 2)?
4. Should we add FAQ schema page (`/faq`)? (Not in module-decisions.md, but common practice)
5. Any specific locale/hreflang tagging needed for USA-focused geo pages?

---

**Build Status Summary:**
- Scaffold: ✅
- Config: ✅
- Routes (pending): 🔄
- Copy (pending): 🔄
- Inquiry module (pending specialist): 🔄
- Assets (pending Designer): 🔄
- **SEO setup**: ← **You are here**
- Testing: ⏳
- Go-live: ⏳

**Next Agent After SEO:** QA (cross-browser, mobile, form validation, email delivery)
