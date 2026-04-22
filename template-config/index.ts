/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TEMPLATE CONFIGURATION - MAIN EXPORT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Central export for all template configurations.
 */

export { BRAND_CONFIG } from './brand.config.js';
export { CATEGORIES_CONFIG, getCategoryBySlug, getSubCategoryBySlug, getNavCategories } from './categories.config.js';
export { THEME_CONFIG, generateCSSVariables } from './theme.config.js';

// Re-export types
export type { BrandConfig } from './brand.config.js';
export type { Category, SubCategory } from './categories.config.js';
export type { ThemeConfig } from './theme.config.js';
