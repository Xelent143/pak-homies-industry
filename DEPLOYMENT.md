# SSM Deployment Guide

> **CRITICAL**: Hostinger serves **pre-built static files** from the `dist/` folder. It does NOT build from source automatically.

---

## Quick Deploy Checklist

```bash
# 1. Make your source code changes first (client/src/, server/src/, etc.)

# 2. Build locally (generates updated dist/ folder)
npm run build:local

# 3. Stage and commit the dist/ folder changes
git add dist/
git add client/src/  # if you changed source files
git commit -m "deploy: DESCRIPTION_OF_CHANGES"

# 4. Push to trigger Hostinger deployment
git push origin main

# 5. Hard refresh browser to verify (Ctrl+F5 or Cmd+Shift+R)
```

---

## Why This Is Necessary

| What | How Hostinger Works |
|------|---------------------|
| Build Process | Hostinger does NOT run `npm run build` on deploy |
| Static Files | Serves files directly from `dist/client/` folder |
| Special Config | `package.json` has `"build": "echo 'Skipping build on Hostinger...'"` |
| Requirement | You must build locally and commit `dist/` folder |

---

## What Gets Built

```
dist/
├── client/           # Static assets served by Hostinger
│   ├── index.html    # Main HTML entry point
│   ├── assets/       # JS bundles, CSS, images (hashed filenames)
│   ├── sitemap.xml   # SEO sitemap
│   └── robots.txt    # SEO robots
└── server/           # Server-side rendering bundle
    └── entry-server.js
```

---

## Common Deployment Scenarios

### Scenario 1: UI/Component Changes
```bash
# Edit files in client/src/
npm run build:local
git add dist/ client/src/
git commit -m "deploy: Update shop sidebar navigation"
git push origin main
```

### Scenario 2: New Product/Category
```bash
# Update category data in client/src/lib/shop-categories.ts
# Add product images to public/ folder
npm run build:local
git add dist/ client/src/ public/
git commit -m "deploy: Add Martial Arts category"
git push origin main
```

### Scenario 3: SEO/Metadata Changes
```bash
# Edit meta tags, sitemap, or structured data
npm run build:local
git add dist/ client/src/
git commit -m "deploy: Update SEO meta tags"
git push origin main
```

---

## Verification Steps

After pushing, verify changes are live:

1. **Visit the affected page** directly
2. **Hard refresh** to clear browser cache:
   - Windows/Linux: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`
3. **Check for your changes**
4. **Check browser console** for any 404 errors on assets

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Changes not showing | Hard refresh browser (Ctrl+F5) |
| 404 on assets | Check `dist/client/assets/` exists and is committed |
| Build fails | Check for syntax errors in source files first |
| Old CSS/JS loading | Verify new hashed filenames in `dist/client/assets/` |

---

## Important Files to Never Forget

Always commit these after building:
- `dist/client/assets/*` (JS/CSS bundles with new hashes)
- `dist/client/index.html` (references new asset hashes)
- `dist/server/entry-server.js` (SSR bundle)

---

## One-Liner Deploy Command

```bash
npm run build:local && git add dist/ && git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" && git push origin main
```

---

*Last updated: March 2026*
