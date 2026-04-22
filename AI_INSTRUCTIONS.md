# 🤖 AI Agent Instructions

> **READ THIS FIRST** before making any changes to this template.

---

## ⚡ Quick Start for AI

This is a **complete e-commerce website template** for B2B businesses. Keep ALL functionality, only change branding/theme.

### 3-Step Rebrand Process:

```bash
# STEP 1: Edit config files
template-config/theme.config.ts     # Colors, fonts
template-config/brand.config.ts     # Company info
template-config/categories.config.ts # Products

# STEP 2: Replace images in public/
logo.svg, hero.jpg, favicon.ico

# STEP 3: Deploy
npm run build:local
git add dist/ && git commit -m "rebrand" && git push
```

---

## 🎨 What AI Should Modify

### ✅ MODIFY THESE:

| File | What to Change |
|------|----------------|
| `template-config/theme.config.ts` | Colors, fonts, border radius |
| `template-config/brand.config.ts` | Company name, contact, social media |
| `template-config/categories.config.ts` | Product categories |
| `public/logo.svg` | Company logo |
| `public/hero.jpg` | Homepage hero image |
| `public/favicon.ico` | Browser icon |
| `client/src/pages/Home.tsx` | Homepage content |

### ❌ NEVER MODIFY:

| File | Why |
|------|-----|
| `server/db.ts` | Database logic - will break everything |
| `drizzle/schema.ts` | Database schema |
| `server/routers.ts` | API endpoints |
| `client/src/lib/trpc.ts` | API client |
| Admin panel files | Keep all admin functionality |
| Shopping cart logic | Core e-commerce feature |
| Checkout flow | Payment processing |

---

## 🎯 Common Tasks

### Change Brand Colors
```typescript
// template-config/theme.config.ts
export const THEME_CONFIG = {
  colors: {
    primary: {
      500: "#your-hex-color", // ← Change this
    }
  }
}
```

### Change Company Name
```typescript
// template-config/brand.config.ts
export const BRAND = {
  name: "Your Company Name", // ← Change this
  tagline: "Your Tagline",   // ← Change this
}
```

### Change Product Categories
```typescript
// template-config/categories.config.ts
export const DEFAULT_CATEGORIES = [
  {
    name: "Your Category",
    slug: "your-slug",
    icon: "🎯",
    subcategories: [
      { name: "Subcategory", slug: "sub-slug" }
    ]
  }
];
```

---

## 🗃️ Database Understanding

### Products connect to categories via:
```typescript
// In database:
product.categoryId = 1  // Links to categories.id
product.subcategoryId = 5  // Links to subcategories.id
```

### Categories have:
- `id` (number)
- `name` (string)
- `slug` (string) - URL-friendly name
- `icon` (string) - Emoji or image URL
- `subcategories` (array)

---

## 🚨 Critical Rules

1. **Preserve all API endpoints** in `server/routers.ts`
2. **Preserve database schema** in `drizzle/schema.ts`
3. **Keep admin panel working** - don't modify `/admin-saad/*` routes
4. **Maintain cart/checkout flow** - core e-commerce functionality
5. **Test after changes** - verify shop page shows products

---

## 🧪 Testing Checklist

After making changes, verify:
- [ ] Homepage loads
- [ ] Shop page shows products
- [ ] Categories display correctly
- [ ] Product detail pages work
- [ ] Admin panel accessible
- [ ] Cart functionality works
- [ ] Mobile responsive

---

## 📞 Help

If something breaks:
1. Check `DEPLOYMENT.md` for deployment issues
2. Check `TEMPLATE.md` for customization guide
3. Restore from git: `git checkout -- filename`

---

**Remember: Functionality > Aesthetics**
Keep all features working while changing the look!
