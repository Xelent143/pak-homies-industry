# SSM Website Template - AI Customization Guide

> **⚡ For AI Agents:** This document contains everything you need to rebrand/customize this website while keeping all functionality intact.

---

## 🎯 Template Overview

This is a **full-stack B2B e-commerce template** with:
- **Frontend:** React + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Express.js + tRPC
- **Database:** MySQL (with categories, products, orders system)
- **Features:** Product catalog, shopping cart, checkout, admin panel, blog

---

## 📁 Critical Files for AI to Modify

### 1. THEME CONFIGURATION (START HERE)
**File:** `template-config/theme.config.ts`

```typescript
// This is where ALL visual customization happens
export const THEME = {
  // Brand Colors
  colors: {
    primary: "#D4A853",     // Gold - Main brand color
    secondary: "#1a1a1a",   // Dark background
    accent: "#2563eb",      // Blue accent
    background: "#fafafa",  // Light background
    foreground: "#171717",  // Text color
  },
  
  // Brand Identity
  brand: {
    name: "Pak Homies Industry",
    tagline: "Premium Custom Apparel Manufacturer",
    description: "B2B manufacturing from Sialkot, Pakistan",
    logo: "/logo.svg",
    favicon: "/favicon.ico",
  },
  
  // Typography
  fonts: {
    heading: "font-serif",    // For titles
    body: "font-sans",        // For body text
    condensed: "font-condensed", // For UI elements
  },
  
  // Layout
  layout: {
    maxWidth: "1400px",
    containerPadding: "1rem",
    borderRadius: "0.5rem",
  }
};
```

### 2. CATEGORY CONFIGURATION
**File:** `template-config/categories.config.ts`

Modify this to change product categories:
```typescript
export const DEFAULT_CATEGORIES = [
  {
    name: "Your Category Name",
    slug: "your-category-slug",
    icon: "🎯",  // Emoji or image URL
    description: "Category description",
    subcategories: [
      { name: "Subcategory 1", slug: "sub-1", description: "" },
      { name: "Subcategory 2", slug: "sub-2", description: "" },
    ]
  }
];
```

### 3. BRAND CONFIGURATION
**File:** `template-config/brand.config.ts`

```typescript
export const BRAND = {
  // Company Info
  company: {
    name: "Your Company Name",
    legalName: "Your Legal Company Name LLC",
    founded: "2020",
    employees: "50-100",
  },
  
  // Contact
  contact: {
    email: "info@yourcompany.com",
    phone: "+1 234 567 8900",
    whatsapp: "+1 234 567 8900",
    address: "Your Address",
  },
  
  // Social Media
  social: {
    facebook: "https://facebook.com/yourcompany",
    instagram: "https://instagram.com/yourcompany",
    linkedin: "https://linkedin.com/company/yourcompany",
    twitter: "https://twitter.com/yourcompany",
  },
  
  // SEO
  seo: {
    title: "Your Company | Custom Manufacturing",
    description: "Premium custom manufacturing services",
    keywords: "custom, manufacturing, apparel, b2b",
    ogImage: "/og-image.jpg",
  }
};
```

---

## 🎨 How to Rebrand (AI Instructions)

### Step 1: Change Brand Identity
```bash
# Edit these files:
1. template-config/theme.config.ts    → Colors & fonts
2. template-config/brand.config.ts    → Company info
3. template-config/categories.config.ts → Product categories
```

### Step 2: Update Images
Replace files in `public/` folder:
- `logo.svg` - Your logo
- `og-image.jpg` - Social sharing image
- `hero.jpg` - Homepage hero
- `favicon.ico` - Browser icon

### Step 3: Database Setup
```bash
# Run these SQL scripts in order:
1. sql/setup-categories.sql     → Creates category tables
2. sql/setup-initial-data.sql   → Seeds default data (optional)
```

### Step 4: Deploy
```bash
npm run build:local
git add dist/
git commit -m "rebrand: New theme"
git push origin main
```

---

## 🗂️ Project Structure (For AI Understanding)

```
security-uniforms/
├── 📁 template-config/          ← AI: MODIFY THESE FILES
│   ├── theme.config.ts          ← Colors, fonts, layout
│   ├── brand.config.ts          ← Company info, contact
│   ├── categories.config.ts     ← Product categories
│   └── index.ts                 ← Exports all configs
│
├── 📁 client/src/
│   ├── 📁 pages/               ← Main pages
│   │   ├── Home.tsx            ← Homepage
│   │   ├── Shop.tsx            ← Product listing
│   │   ├── ProductDetail.tsx   ← Single product
│   │   └── admin/              ← Admin panel
│   │
│   ├── 📁 components/          ← Reusable components
│   │   ├── ui/                 ← shadcn components
│   │   └── ...
│   │
│   ├── 📁 lib/
│   │   ├── images.ts           ← Image assets
│   │   └── utils.ts            ← Utilities
│   │
│   └── App.tsx                 ← Main router
│
├── 📁 server/
│   ├── 📁 _core/               ← Server core
│   │   ├── index.ts            ← Entry point
│   │   └── trpc.ts             ← API setup
│   │
│   ├── routers.ts              ← All API routes
│   ├── db.ts                   ← Database functions
│   └── storage.ts              ← File uploads
│
├── 📁 drizzle/
│   └── schema.ts               ← Database schema
│
├── 📁 sql/
│   ├── setup-categories.sql    ← Setup categories table
│   └── setup-initial-data.sql  ← Optional seed data
│
├── 📁 public/                  ← Static assets
│   ├── logo.svg
│   ├── hero.jpg
│   └── ...
│
├── package.json                ← Dependencies
└── DEPLOYMENT.md               ← How to deploy
```

---

## 🔄 Common Customization Tasks (For AI)

### Change Colors
```typescript
// template-config/theme.config.ts
export const THEME = {
  colors: {
    primary: "#your-brand-color",    // ← Change this
    secondary: "#your-dark-color",   // ← Change this
    accent: "#your-accent-color",    // ← Change this
  }
};
```

### Change Homepage Hero
```typescript
// template-config/brand.config.ts
export const BRAND = {
  hero: {
    title: "Your Headline Here",
    subtitle: "Your subheadline",
    cta: "Get Started",
    image: "/your-hero-image.jpg"
  }
};
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
      { name: "Your Subcategory", slug: "your-sub-slug" }
    ]
  }
];
```

### Change Contact Info
```typescript
// template-config/brand.config.ts
export const BRAND = {
  contact: {
    email: "you@example.com",
    phone: "+1234567890",
    address: "Your Address"
  }
};
```

---

## 🗃️ Database Schema (For AI Understanding)

### Categories Table
```sql
- id (INT, PK)
- name (VARCHAR)
- slug (VARCHAR, UNIQUE)
- icon (VARCHAR) - emoji or URL
- description (TEXT)
- image_url (VARCHAR)
- sort_order (INT)
- is_active (BOOLEAN)
```

### Subcategories Table
```sql
- id (INT, PK)
- category_id (INT, FK)
- name (VARCHAR)
- slug (VARCHAR)
- description (TEXT)
- sort_order (INT)
- is_active (BOOLEAN)
```

### Products Table
```sql
- id (INT, PK)
- slug (VARCHAR, UNIQUE)
- title (VARCHAR)
- category (VARCHAR) - legacy
- category_id (INT, FK) - new
- subcategory_id (INT, FK) - new
- description (TEXT)
- samplePrice (DECIMAL)
- weight (DECIMAL)
- mainImage (VARCHAR)
- isActive (BOOLEAN)
- isFeatured (BOOLEAN)
```

---

## 🚀 Quick Start for New Instance

### 1. Clone Template
```bash
git clone https://github.com/yourusername/ssm-template.git your-project
cd your-project
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Setup Database
```bash
# Run SQL scripts in your database:
1. sql/setup-categories.sql
2. Add your categories via /admin-saad/categories
```

### 5. Start Development
```bash
npm run dev
```

### 6. Build & Deploy
```bash
npm run build:local
git add dist/
git commit -m "Initial build"
git push origin main
```

---

## 📝 AI Prompt Templates

### For Complete Rebrand:
```
"Rebrand this website template with the following:
- Company Name: [YOUR COMPANY]
- Industry: [YOUR INDUSTRY]
- Primary Color: [COLOR]
- Categories: [LIST OF CATEGORIES]
- Update all images in public/ folder
- Keep all functionality intact"
```

### For Theme Change Only:
```
"Update the theme in template-config/theme.config.ts:
- Change primary color to: #HEXCODE
- Change font style to: [modern/classic/minimal]
- Update border radius to: [value]
- Keep all other code unchanged"
```

### For Adding Features:
```
"Add a new feature to this template:
- Feature: [DESCRIPTION]
- Location: [WHERE IN UI]
- Use existing components from components/ui/
- Follow existing patterns in the codebase"
```

---

## ⚠️ IMPORTANT RULES FOR AI

1. **NEVER delete:**
   - `server/db.ts` - Database functions
   - `drizzle/schema.ts` - Database schema
   - `server/routers.ts` - API routes
   - `client/src/lib/trpc.ts` - API client

2. **ALWAYS preserve:**
   - All admin panel functionality
   - Category/subcategory system
   - Product management
   - Order management
   - User authentication

3. **ONLY modify:**
   - Files in `template-config/`
   - CSS/styling
   - Text content
   - Images in `public/`
   - Homepage layout (Home.tsx)

4. **When changing theme:**
   - Update `template-config/theme.config.ts` first
   - Then update Tailwind classes if needed
   - Test on both light and dark mode

---

## 🔧 Tech Stack Details

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 | UI framework |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Components | shadcn/ui | Pre-built components |
| Backend | Express.js | Server framework |
| API | tRPC | Type-safe API |
| Database | MySQL | Data storage |
| ORM | Drizzle ORM | Database queries |
| Build | Vite | Bundler |

---

## 📞 Support

For AI agents needing help:
1. Check `DEPLOYMENT.md` for deployment issues
2. Check `SETUP-GUIDE.md` for setup issues
3. Review this file for customization guidance

---

**Last Updated:** March 2026
**Template Version:** 2.0
**Compatible With:** React 19, Node 20+

