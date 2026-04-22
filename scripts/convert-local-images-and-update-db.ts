/**
 * Convert Local Images and Update Database
 * 
 * This script:
 * 1. Finds all non-WebP images in the uploads folder
 * 2. Converts them to WebP format
 * 3. Updates database records pointing to those images
 * 4. Optionally removes original files
 * 
 * Usage: npx tsx scripts/convert-local-images-and-update-db.ts [--delete-originals]
 */

import { drizzle } from "drizzle-orm/mysql2";
import { eq, like } from "drizzle-orm";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// Configuration
const CONFIG = {
  uploadsDir: path.join(PROJECT_ROOT, "uploads"),
  quality: 85,
  effort: 6,
  deleteOriginals: process.argv.includes("--delete-originals"),
  dryRun: process.argv.includes("--dry-run"),
};

// Stats
const stats = {
  filesConverted: 0,
  filesSkipped: 0,
  filesError: 0,
  dbUpdated: 0,
  dbErrors: 0,
};

// Map of old paths to new paths for database updates
const pathMapping = new Map<string, string>();

// Find all convertible images
async function findImages(dir: string): Promise<string[]> {
  const images: string[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true, recursive: true });
    
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
          images.push(path.join(entry.path || dir, entry.name));
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return images;
}

// Convert single image
async function convertImage(inputPath: string): Promise<string | null> {
  const relativePath = path.relative(CONFIG.uploadsDir, inputPath);
  const ext = path.extname(inputPath);
  const nameWithoutExt = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);
  const outputPath = path.join(dir, `${nameWithoutExt}.webp`);
  const outputRelativePath = path.relative(CONFIG.uploadsDir, outputPath);
  
  // Check if WebP already exists
  try {
    await fs.access(outputPath);
    console.log(`⏭️  WebP already exists: ${relativePath}`);
    stats.filesSkipped++;
    return outputRelativePath;
  } catch {
    // Continue with conversion
  }
  
  try {
    let sharpInstance = sharp(inputPath);
    
    // Preserve transparency for PNGs
    const metadata = await sharpInstance.metadata();
    if (metadata.hasAlpha && ext.toLowerCase() === ".png") {
      sharpInstance = sharpInstance.ensureAlpha();
    }
    
    await sharpInstance
      .webp({ quality: CONFIG.quality, effort: CONFIG.effort })
      .toFile(outputPath);
    
    const originalSize = (await fs.stat(inputPath)).size;
    const webpSize = (await fs.stat(outputPath)).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Converted: ${relativePath}`);
    console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(webpSize / 1024).toFixed(1)}KB (${savings}% saved)`);
    
    stats.filesConverted++;
    return outputRelativePath;
  } catch (error) {
    console.error(`❌ Error converting ${relativePath}:`, error);
    stats.filesError++;
    return null;
  }
}

// Update database with new paths
async function updateDatabase(db: ReturnType<typeof drizzle>) {
  console.log("\n🔄 Updating database records...\n");
  
  for (const [oldPath, newPath] of pathMapping) {
    const oldUrl = `/uploads/${oldPath.replace(/\\/g, "/")}`;
    const newUrl = `/uploads/${newPath.replace(/\\/g, "/")}`;
    
    // Update products.mainImage
    try {
      const productResult = await db
        .update(products)
        .set({ mainImage: newUrl })
        .where(eq(products.mainImage, oldUrl));
      if (productResult[0].affectedRows > 0) {
        console.log(`✅ Updated product: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating product:`, error);
      stats.dbErrors++;
    }
    
    // Update productImages.imageUrl (using LIKE for partial matches)
    try {
      const productImgResult = await db
        .update(productImages)
        .set({ imageUrl: newUrl })
        .where(eq(productImages.imageUrl, oldUrl));
      if (productImgResult[0].affectedRows > 0) {
        console.log(`✅ Updated productImage: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating productImage:`, error);
      stats.dbErrors++;
    }
    
    // Update portfolioItems.coverImage
    try {
      const portfolioResult = await db
        .update(portfolioItems)
        .set({ coverImage: newUrl })
        .where(eq(portfolioItems.coverImage, oldUrl));
      if (portfolioResult[0].affectedRows > 0) {
        console.log(`✅ Updated portfolioItem: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating portfolioItem:`, error);
      stats.dbErrors++;
    }
    
    // Update portfolioImages.imageUrl
    try {
      const portfolioImgResult = await db
        .update(portfolioImages)
        .set({ imageUrl: newUrl })
        .where(eq(portfolioImages.imageUrl, oldUrl));
      if (portfolioImgResult[0].affectedRows > 0) {
        console.log(`✅ Updated portfolioImage: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating portfolioImage:`, error);
      stats.dbErrors++;
    }
    
    // Update blogPosts.featuredImage
    try {
      const blogResult = await db
        .update(blogPosts)
        .set({ featuredImage: newUrl })
        .where(eq(blogPosts.featuredImage, oldUrl));
      if (blogResult[0].affectedRows > 0) {
        console.log(`✅ Updated blogPost: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating blogPost:`, error);
      stats.dbErrors++;
    }
    
    // Update testimonials.avatar
    try {
      const testimonialResult = await db
        .update(testimonials)
        .set({ avatar: newUrl })
        .where(eq(testimonials.avatar, oldUrl));
      if (testimonialResult[0].affectedRows > 0) {
        console.log(`✅ Updated testimonial: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating testimonial:`, error);
      stats.dbErrors++;
    }
    
    // Update categories.imageUrl
    try {
      const categoryResult = await db
        .update(categories)
        .set({ imageUrl: newUrl })
        .where(eq(categories.imageUrl, oldUrl));
      if (categoryResult[0].affectedRows > 0) {
        console.log(`✅ Updated category: ${oldUrl} → ${newUrl}`);
        stats.dbUpdated++;
      }
    } catch (error) {
      console.error(`❌ Error updating category:`, error);
      stats.dbErrors++;
    }
  }
}

// Delete original files
async function deleteOriginals() {
  if (!CONFIG.deleteOriginals || CONFIG.dryRun) return;
  
  console.log("\n🗑️  Deleting original files...\n");
  
  for (const oldPath of pathMapping.keys()) {
    const fullPath = path.join(CONFIG.uploadsDir, oldPath);
    try {
      await fs.unlink(fullPath);
      console.log(`🗑️  Deleted: ${oldPath}`);
    } catch (error) {
      console.error(`❌ Error deleting ${oldPath}:`, error);
    }
  }
}

// Main function
async function main() {
  console.log("🚀 Local Image Conversion and Database Update\n");
  console.log(`📁 Uploads directory: ${CONFIG.uploadsDir}`);
  console.log(`💾 Delete originals: ${CONFIG.deleteOriginals}`);
  console.log(`🧪 Dry run: ${CONFIG.dryRun}\n`);
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }
  
  // Check uploads directory exists
  try {
    await fs.access(CONFIG.uploadsDir);
  } catch {
    console.error(`❌ Uploads directory not found: ${CONFIG.uploadsDir}`);
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
  
  // Find all images
  console.log("🔍 Scanning for images...");
  const images = await findImages(CONFIG.uploadsDir);
  console.log(`📸 Found ${images.length} images to process\n`);
  
  if (images.length === 0) {
    console.log("✅ No images to convert");
    return;
  }
  
  // Convert images
  const startTime = Date.now();
  
  for (const imagePath of images) {
    if (CONFIG.dryRun) {
      const relativePath = path.relative(CONFIG.uploadsDir, imagePath);
      console.log(`[DRY RUN] Would convert: ${relativePath}`);
      continue;
    }
    
    const newPath = await convertImage(imagePath);
    if (newPath) {
      const relativePath = path.relative(CONFIG.uploadsDir, imagePath);
      pathMapping.set(relativePath, newPath);
    }
  }
  
  // Update database
  if (!CONFIG.dryRun && pathMapping.size > 0) {
    await updateDatabase(db);
    await deleteOriginals();
  }
  
  // Summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log("\n" + "=".repeat(70));
  console.log("📊 SUMMARY");
  console.log("=".repeat(70));
  console.log(`Files converted: ${stats.filesConverted}`);
  console.log(`Files skipped:   ${stats.filesSkipped}`);
  console.log(`Files errors:    ${stats.filesError}`);
  console.log(`DB records updated: ${stats.dbUpdated}`);
  console.log(`DB errors:       ${stats.dbErrors}`);
  console.log(`Duration:        ${duration}s`);
  console.log("=".repeat(70));
  
  if (stats.filesError > 0 || stats.dbErrors > 0) {
    console.log("\n⚠️  Some errors occurred. Please review the output above.");
    process.exit(1);
  }
  
  console.log("\n✅ Conversion completed successfully!");
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
