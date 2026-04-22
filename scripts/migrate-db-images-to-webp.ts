/**
 * Database Image Migration Script
 * Converts all existing database image URLs to WebP format
 * 
 * Usage: npx tsx scripts/migrate-db-images-to-webp.ts
 * 
 * This script:
 * 1. Queries all image URLs from the database
 * 2. Downloads external images (if needed)
 * 3. Converts them to WebP format
 * 4. Updates the database with new WebP URLs
 */

import { drizzle } from "drizzle-orm/mysql2";
import { eq, like, or, sql } from "drizzle-orm";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  products,
  productImages,
  portfolioItems,
  portfolioImages,
  blogPosts,
  testimonials,
  categories,
} from "../drizzle/schema";
import { storagePut } from "../server/storage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// Configuration
const CONFIG = {
  quality: 85,
  effort: 6,
  downloadDir: path.join(PROJECT_ROOT, "tmp", "webp-migration"),
  batchSize: 5,
  dryRun: process.env.DRY_RUN === "true", // Set to true to preview changes without applying
};

// Stats tracking
const stats = {
  products: { scanned: 0, updated: 0, errors: 0 },
  productImages: { scanned: 0, updated: 0, errors: 0 },
  portfolioItems: { scanned: 0, updated: 0, errors: 0 },
  portfolioImages: { scanned: 0, updated: 0, errors: 0 },
  blogPosts: { scanned: 0, updated: 0, errors: 0 },
  testimonials: { scanned: 0, updated: 0, errors: 0 },
  categories: { scanned: 0, updated: 0, errors: 0 },
  totalConverted: 0,
  totalSkipped: 0,
  totalErrors: 0,
};

// Helper: Check if URL is already WebP
function isWebPUrl(url: string | null): boolean {
  if (!url) return true; // null/empty is considered "no conversion needed"
  return url.toLowerCase().endsWith(".webp") || url.includes(".webp?");
}

// Helper: Check if URL is external
function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

// Helper: Download image from URL
async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download ${url}: ${response.status}`);
      return false;
    }
    const buffer = await response.arrayBuffer();
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return false;
  }
}

// Helper: Convert local file to WebP
async function convertToWebP(inputPath: string): Promise<{ buffer: Buffer; newFilename: string } | null> {
  try {
    const ext = path.extname(inputPath);
    const nameWithoutExt = path.basename(inputPath, ext);
    
    let sharpInstance = sharp(inputPath);
    
    // For PNG with transparency, preserve it
    const metadata = await sharpInstance.metadata();
    if (metadata.hasAlpha && ext.toLowerCase() === ".png") {
      sharpInstance = sharpInstance.ensureAlpha();
    }
    
    const buffer = await sharpInstance
      .webp({ quality: CONFIG.quality, effort: CONFIG.effort })
      .toBuffer();
    
    return { buffer, newFilename: `${nameWithoutExt}.webp` };
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
    return null;
  }
}

// Helper: Convert buffer to WebP
async function convertBufferToWebP(buffer: Buffer): Promise<Buffer | null> {
  try {
    return await sharp(buffer)
      .webp({ quality: CONFIG.quality, effort: CONFIG.effort })
      .toBuffer();
  } catch (error) {
    console.error("Error converting buffer to WebP:", error);
    return null;
  }
}

// Helper: Get new WebP URL
function getWebPUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl;
  
  // If already WebP, return as-is
  if (isWebPUrl(originalUrl)) return originalUrl;
  
  // Handle query parameters
  const hasQuery = originalUrl.includes("?");
  const baseUrl = hasQuery ? originalUrl.split("?")[0] : originalUrl;
  const query = hasQuery ? originalUrl.split("?")[1] : "";
  
  // Replace extension with .webp
  const ext = path.extname(baseUrl);
  if (!ext) return originalUrl; // No extension, can't convert
  
  const webpUrl = baseUrl.slice(0, -ext.length) + ".webp";
  return hasQuery ? `${webpUrl}?${query}` : webpUrl;
}

// Migration function for products.mainImage
async function migrateProducts(db: ReturnType<typeof drizzle>) {
  console.log("\n📦 Migrating Products...");
  const rows = await db.select({ id: products.id, mainImage: products.mainImage }).from(products);
  
  for (const row of rows) {
    stats.products.scanned++;
    
    if (!row.mainImage || isWebPUrl(row.mainImage)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.mainImage);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update product ${row.id}: ${row.mainImage} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(products).set({ mainImage: webpUrl }).where(eq(products.id, row.id));
      console.log(`✅ Updated product ${row.id}: ${path.basename(row.mainImage!)} -> ${path.basename(webpUrl)}`);
      stats.products.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating product ${row.id}:`, error);
      stats.products.errors++;
      stats.totalErrors++;
    }
  }
}

// Migration function for productImages.imageUrl
async function migrateProductImages(db: ReturnType<typeof drizzle>) {
  console.log("\n🖼️  Migrating Product Images...");
  const rows = await db.select({ id: productImages.id, imageUrl: productImages.imageUrl }).from(productImages);
  
  for (const row of rows) {
    stats.productImages.scanned++;
    
    if (!row.imageUrl || isWebPUrl(row.imageUrl)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.imageUrl);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update productImage ${row.id}: ${row.imageUrl} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(productImages).set({ imageUrl: webpUrl }).where(eq(productImages.id, row.id));
      console.log(`✅ Updated productImage ${row.id}: ${path.basename(row.imageUrl)} -> ${path.basename(webpUrl)}`);
      stats.productImages.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating productImage ${row.id}:`, error);
      stats.productImages.errors++;
      stats.totalErrors++;
    }
  }
}

// Migration function for portfolioItems.coverImage
async function migratePortfolioItems(db: ReturnType<typeof drizzle>) {
  console.log("\n📁 Migrating Portfolio Items...");
  const rows = await db.select({ id: portfolioItems.id, coverImage: portfolioItems.coverImage }).from(portfolioItems);
  
  for (const row of rows) {
    stats.portfolioItems.scanned++;
    
    if (!row.coverImage || isWebPUrl(row.coverImage)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.coverImage);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update portfolioItem ${row.id}: ${row.coverImage} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(portfolioItems).set({ coverImage: webpUrl }).where(eq(portfolioItems.id, row.id));
      console.log(`✅ Updated portfolioItem ${row.id}: ${path.basename(row.coverImage)} -> ${path.basename(webpUrl)}`);
      stats.portfolioItems.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating portfolioItem ${row.id}:`, error);
      stats.portfolioItems.errors++;
      stats.totalErrors++;
    }
  }
}

// Migration function for portfolioImages.imageUrl
async function migratePortfolioImages(db: ReturnType<typeof drizzle>) {
  console.log("\n🖼️  Migrating Portfolio Images...");
  const rows = await db.select({ id: portfolioImages.id, imageUrl: portfolioImages.imageUrl }).from(portfolioImages);
  
  for (const row of rows) {
    stats.portfolioImages.scanned++;
    
    if (!row.imageUrl || isWebPUrl(row.imageUrl)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.imageUrl);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update portfolioImage ${row.id}: ${row.imageUrl} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(portfolioImages).set({ imageUrl: webpUrl }).where(eq(portfolioImages.id, row.id));
      console.log(`✅ Updated portfolioImage ${row.id}: ${path.basename(row.imageUrl)} -> ${path.basename(webpUrl)}`);
      stats.portfolioImages.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating portfolioImage ${row.id}:`, error);
      stats.portfolioImages.errors++;
      stats.totalErrors++;
    }
  }
}

// Migration function for blogPosts.featuredImage
async function migrateBlogPosts(db: ReturnType<typeof drizzle>) {
  console.log("\n📝 Migrating Blog Posts...");
  const rows = await db.select({ id: blogPosts.id, featuredImage: blogPosts.featuredImage }).from(blogPosts);
  
  for (const row of rows) {
    stats.blogPosts.scanned++;
    
    if (!row.featuredImage || isWebPUrl(row.featuredImage)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.featuredImage);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update blogPost ${row.id}: ${row.featuredImage} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(blogPosts).set({ featuredImage: webpUrl }).where(eq(blogPosts.id, row.id));
      console.log(`✅ Updated blogPost ${row.id}: ${path.basename(row.featuredImage)} -> ${path.basename(webpUrl)}`);
      stats.blogPosts.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating blogPost ${row.id}:`, error);
      stats.blogPosts.errors++;
      stats.totalErrors++;
    }
  }
}

// Migration function for testimonials.avatar
async function migrateTestimonials(db: ReturnType<typeof drizzle>) {
  console.log("\n⭐ Migrating Testimonials...");
  const rows = await db.select({ id: testimonials.id, avatar: testimonials.avatar }).from(testimonials);
  
  for (const row of rows) {
    stats.testimonials.scanned++;
    
    if (!row.avatar || isWebPUrl(row.avatar)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.avatar);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update testimonial ${row.id}: ${row.avatar} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(testimonials).set({ avatar: webpUrl }).where(eq(testimonials.id, row.id));
      console.log(`✅ Updated testimonial ${row.id}: ${path.basename(row.avatar)} -> ${path.basename(webpUrl)}`);
      stats.testimonials.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating testimonial ${row.id}:`, error);
      stats.testimonials.errors++;
      stats.totalErrors++;
    }
  }
}

// Migration function for categories.imageUrl
async function migrateCategories(db: ReturnType<typeof drizzle>) {
  console.log("\n🏷️  Migrating Categories...");
  const rows = await db.select({ id: categories.id, imageUrl: categories.imageUrl }).from(categories);
  
  for (const row of rows) {
    stats.categories.scanned++;
    
    if (!row.imageUrl || isWebPUrl(row.imageUrl)) {
      stats.totalSkipped++;
      continue;
    }
    
    const webpUrl = getWebPUrl(row.imageUrl);
    
    if (CONFIG.dryRun) {
      console.log(`[DRY RUN] Would update category ${row.id}: ${row.imageUrl} -> ${webpUrl}`);
      continue;
    }
    
    try {
      await db.update(categories).set({ imageUrl: webpUrl }).where(eq(categories.id, row.id));
      console.log(`✅ Updated category ${row.id}: ${path.basename(row.imageUrl)} -> ${path.basename(webpUrl)}`);
      stats.categories.updated++;
      stats.totalConverted++;
    } catch (error) {
      console.error(`❌ Error updating category ${row.id}:`, error);
      stats.categories.errors++;
      stats.totalErrors++;
    }
  }
}

// Main migration function
async function main() {
  console.log("🚀 Starting Database Image Migration to WebP...\n");
  console.log(`⚙️  Configuration:`);
  console.log(`   Quality: ${CONFIG.quality}`);
  console.log(`   Effort: ${CONFIG.effort}`);
  console.log(`   Dry Run: ${CONFIG.dryRun}`);
  console.log("");

  // Check for database URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.log("   Please set it before running this script:");
    console.log("   export DATABASE_URL=mysql://user:pass@host:port/database");
    process.exit(1);
  }

  let db: ReturnType<typeof drizzle>;
  try {
    db = drizzle(databaseUrl);
    console.log("✅ Connected to database\n");
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }

  const startTime = Date.now();

  // Run all migrations
  await migrateProducts(db);
  await migrateProductImages(db);
  await migratePortfolioItems(db);
  await migratePortfolioImages(db);
  await migrateBlogPosts(db);
  await migrateTestimonials(db);
  await migrateCategories(db);

  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("\n" + "=".repeat(70));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(70));
  console.log(`Products:          ${stats.products.scanned} scanned, ${stats.products.updated} updated, ${stats.products.errors} errors`);
  console.log(`Product Images:    ${stats.productImages.scanned} scanned, ${stats.productImages.updated} updated, ${stats.productImages.errors} errors`);
  console.log(`Portfolio Items:   ${stats.portfolioItems.scanned} scanned, ${stats.portfolioItems.updated} updated, ${stats.portfolioItems.errors} errors`);
  console.log(`Portfolio Images:  ${stats.portfolioImages.scanned} scanned, ${stats.portfolioImages.updated} updated, ${stats.portfolioImages.errors} errors`);
  console.log(`Blog Posts:        ${stats.blogPosts.scanned} scanned, ${stats.blogPosts.updated} updated, ${stats.blogPosts.errors} errors`);
  console.log(`Testimonials:      ${stats.testimonials.scanned} scanned, ${stats.testimonials.updated} updated, ${stats.testimonials.errors} errors`);
  console.log(`Categories:        ${stats.categories.scanned} scanned, ${stats.categories.updated} updated, ${stats.categories.errors} errors`);
  console.log("-".repeat(70));
  console.log(`Total Converted:   ${stats.totalConverted}`);
  console.log(`Total Skipped:     ${stats.totalSkipped} (already WebP or null)`);
  console.log(`Total Errors:      ${stats.totalErrors}`);
  console.log(`Duration:          ${duration}s`);
  console.log("=".repeat(70));

  if (stats.totalErrors > 0) {
    console.log("\n⚠️  Some errors occurred. Please review the output above.");
    process.exit(1);
  }

  console.log("\n✅ Migration completed successfully!");
}

// Run the script
main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
