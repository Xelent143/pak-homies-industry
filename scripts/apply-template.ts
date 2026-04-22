#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TEMPLATE APPLICATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This script applies all template configurations to the codebase.
 * Run with: pnpm apply-template
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRAND_CONFIG } from '../template-config/brand.config.js';
import { CATEGORIES_CONFIG, getNavCategories } from '../template-config/categories.config.js';
import { THEME_CONFIG, generateCSSVariables } from '../template-config/theme.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 1: Update shop-categories.ts with configured categories
// ═══════════════════════════════════════════════════════════════════════════════
async function updateCategories(): Promise<void> {
  log('\n📁 Updating categories configuration...', 'cyan');
  
  const categoriesPath = path.join(ROOT_DIR, 'client/src/lib/shop-categories.ts');
  
  // Generate the categories file content
  const fileContent = `// Shop Category Structure with hierarchical navigation
// AUTO-GENERATED from template-config/categories.config.ts
// Run 'pnpm apply-template' to regenerate after editing

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  subCategories: SubCategory[];
}

export const SHOP_CATEGORIES: Category[] = ${JSON.stringify(getNavCategories(), null, 2)};

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return SHOP_CATEGORIES.find((cat) => cat.slug === slug);
}

// Helper function to get subcategory by slug
export function getSubCategoryBySlug(categorySlug: string, subCategorySlug: string): SubCategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subCategories.find((sub) => sub.slug === subCategorySlug);
}

// Get all subcategories flattened (for search/filtering)
export function getAllSubCategories(): (SubCategory & { categoryId: string; categoryName: string })[] {
  return SHOP_CATEGORIES.flatMap((cat) =>
    cat.subCategories.map((sub) => ({
      ...sub,
      categoryId: cat.id,
      categoryName: cat.name,
    }))
  );
}

// SEO-friendly category descriptions
export const CATEGORY_SEO_CONTENT: Record<string, { title: string; description: string; keywords: string }> = ${JSON.stringify(
  Object.fromEntries(
    CATEGORIES_CONFIG
      .filter(c => c.seo)
      .map(c => [c.slug, c.seo])
  ),
  null,
  2
)};
`;

  await fs.writeFile(categoriesPath, fileContent, 'utf-8');
  log('  ✓ Categories updated', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 2: Generate CSS variables from theme config
// ═══════════════════════════════════════════════════════════════════════════════
async function generateThemeCSS(): Promise<void> {
  log('\n🎨 Generating theme CSS variables...', 'cyan');
  
  const cssDir = path.join(ROOT_DIR, 'client/src/styles');
  const cssPath = path.join(cssDir, 'theme-generated.css');
  
  // Ensure directory exists
  try {
    await fs.mkdir(cssDir, { recursive: true });
  } catch {}
  
  const cssContent = `/* AUTO-GENERATED from template-config/theme.config.ts */
/* Run 'pnpm apply-template' to regenerate after editing */

${generateCSSVariables(THEME_CONFIG)}

.dark {
  --background: ${THEME_CONFIG.darkMode.background};
  --foreground: ${THEME_CONFIG.darkMode.text};
  --muted: ${THEME_CONFIG.darkMode.textMuted};
  --border: ${THEME_CONFIG.darkMode.border};
  --surface: ${THEME_CONFIG.darkMode.surface};
  --surface-elevated: ${THEME_CONFIG.darkMode.surfaceElevated};
}
`;

  await fs.writeFile(cssPath, cssContent, 'utf-8');
  log('  ✓ Theme CSS generated', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 3: Update site metadata in index.html
// ═══════════════════════════════════════════════════════════════════════════════
async function updateIndexHtml(): Promise<void> {
  log('\n🌐 Updating index.html metadata...', 'cyan');
  
  const indexPath = path.join(ROOT_DIR, 'client/index.html');
  let content = await fs.readFile(indexPath, 'utf-8');
  
  // Update title
  content = content.replace(
    /<title>.*?<\/title>/,
    `<title>${BRAND_CONFIG.siteName} | ${BRAND_CONFIG.tagline}</title>`
  );
  
  // Update meta description
  const metaDescRegex = /<meta name="description" content=".*?"/;
  if (content.match(metaDescRegex)) {
    content = content.replace(
      metaDescRegex,
      `<meta name="description" content="${BRAND_CONFIG.seo.defaultDescription}"`
    );
  }
  
  // Update or add OG meta tags
  const ogTags = [
    { property: 'og:title', content: `${BRAND_CONFIG.siteName} | ${BRAND_CONFIG.tagline}` },
    { property: 'og:description', content: BRAND_CONFIG.seo.defaultDescription },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: BRAND_CONFIG.siteUrl },
    { property: 'og:image', content: `${BRAND_CONFIG.siteUrl}${BRAND_CONFIG.seo.ogImage}` },
  ];
  
  // Remove existing OG tags and add new ones
  content = content.replace(/\s*<meta property="og:.*?" content=".*?"\/>/g, '');
  
  const ogTagString = ogTags.map(tag => 
    `    <meta property="${tag.property}" content="${tag.content}"/>`
  ).join('\n');
  
  content = content.replace(
    /(<head>)/,
    `$1\n${ogTagString}`
  );
  
  await fs.writeFile(indexPath, content, 'utf-8');
  log('  ✓ index.html updated', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 4: Update brand constants throughout the codebase
// ═══════════════════════════════════════════════════════════════════════════════
async function updateBrandConstants(): Promise<void> {
  log('\n🏷️  Updating brand constants...', 'cyan');
  
  const constFilePath = path.join(ROOT_DIR, 'client/src/const.ts');
  
  const constContent = `/**
 * SITE CONSTANTS
 * AUTO-GENERATED from template-config/brand.config.ts
 * Run 'pnpm apply-template' to regenerate after editing
 */

export const SITE_NAME = "${BRAND_CONFIG.siteName}";
export const SITE_TAGLINE = "${BRAND_CONFIG.tagline}";
export const LEGAL_NAME = "${BRAND_CONFIG.legalName}";
export const ESTABLISHED_YEAR = ${BRAND_CONFIG.establishedYear};
export const SITE_URL = "${BRAND_CONFIG.siteUrl}";

// Contact Information
export const CONTACT_EMAIL = "${BRAND_CONFIG.supportEmail}";
export const SALES_EMAIL = "${BRAND_CONFIG.salesEmail}";
export const PHONE = "${BRAND_CONFIG.phone}";
export const WHATSAPP = "${BRAND_CONFIG.whatsappNumber}";
export const LOCATION = "${BRAND_CONFIG.location}";
export const FULL_ADDRESS = \`${BRAND_CONFIG.fullAddress}\`;

// Social Media
export const SOCIAL_LINKS = ${JSON.stringify(BRAND_CONFIG.social, null, 2)};

// Business Details
export const TARGET_MARKETS = ${JSON.stringify(BRAND_CONFIG.targetMarkets)};
export const INDUSTRIES = ${JSON.stringify(BRAND_CONFIG.industries)};
export const CERTIFICATIONS = ${JSON.stringify(BRAND_CONFIG.certifications)};

// Pricing
export const DEFAULT_MOQ = ${BRAND_CONFIG.pricing.defaultMOQ};
export const SAMPLE_LEAD_TIME = ${BRAND_CONFIG.pricing.sampleLeadTime};
export const PRODUCTION_LEAD_TIME = ${BRAND_CONFIG.pricing.productionLeadTime};
export const DISPLAY_CURRENCY = "${BRAND_CONFIG.pricing.displayCurrency}";

// Shipping
export const SHIPS_FROM = "${BRAND_CONFIG.shipping.shipsFrom}";
export const SHIPPING_METHODS = ${JSON.stringify(BRAND_CONFIG.shipping.methods)};
`;

  await fs.writeFile(constFilePath, constContent, 'utf-8');
  log('  ✓ Brand constants created', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASK 5: Generate README for the configured project
// ═══════════════════════════════════════════════════════════════════════════════
async function generateProjectReadme(): Promise<void> {
  log('\n📄 Generating project README...', 'cyan');
  
  const readmeContent = `# ${BRAND_CONFIG.siteName}

${BRAND_CONFIG.tagline}

## Overview

This is a full-stack B2B apparel manufacturing website built with React, Express, and MySQL.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, tRPC
- **Database**: MySQL with Drizzle ORM
- **Authentication**: JWT-based auth
- **Payments**: Stripe integration
- **3D Design**: Three.js / React Three Fiber

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
pnpm db:push

# Seed sample data
pnpm db:seed

# Start development server
pnpm dev
\`\`\`

## Customization

This project uses a template configuration system. To customize:

1. Edit files in \`template-config/\`:
   - \`brand.config.ts\` - Site name, contact info, SEO
   - \`categories.config.ts\` - Product categories
   - \`theme.config.ts\` - Colors and styling

2. Run \`pnpm apply-template\` to apply changes

3. Restart the dev server

## Features

- ✨ Product catalog with categories
- 🎨 3D Design Studio for custom apparel
- 🛒 Shopping cart and checkout
- 📄 RFQ (Request for Quote) system
- 🔐 Admin dashboard
- 📝 Blog system
- 🖼️ Portfolio/Gallery
- 📐 Tech Pack Creator

## License

Private - ${BRAND_CONFIG.legalName}
`;

  await fs.writeFile(path.join(ROOT_DIR, 'README.md'), readmeContent, 'utf-8');
  log('  ✓ Project README generated', 'green');
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════
async function main(): Promise<void> {
  log('\n╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       APPLYING TEMPLATE CONFIGURATION                        ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝', 'cyan');
  
  log(`\n📝 Brand: ${BRAND_CONFIG.siteName}`, 'yellow');
  log(`📊 Categories: ${CATEGORIES_CONFIG.length}`, 'yellow');
  log(`🎨 Theme: ${THEME_CONFIG.features.darkMode ? 'Dark mode enabled' : 'Light only'}`, 'yellow');
  
  try {
    await updateCategories();
    await generateThemeCSS();
    await updateIndexHtml();
    await updateBrandConstants();
    await generateProjectReadme();
    
    log('\n╔══════════════════════════════════════════════════════════════╗', 'green');
    log('║       ✓ TEMPLATE APPLIED SUCCESSFULLY                        ║', 'green');
    log('╚══════════════════════════════════════════════════════════════╝', 'green');
    
    log('\nNext steps:', 'cyan');
    log('  1. Review the generated files', 'reset');
    log('  2. Add your product images to client/public/images/', 'reset');
    log('  3. Update .env with your API keys', 'reset');
    log('  4. Run: pnpm dev', 'reset');
    
  } catch (error) {
    log('\n❌ Error applying template:', 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
