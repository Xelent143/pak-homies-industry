/**
 * Image Optimization Script
 * Converts all JPEG/PNG images to WebP format for better performance
 * 
 * Usage: npx tsx scripts/convert-images-to-webp.ts
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  sourceDir: path.join(PROJECT_ROOT, 'dist', 'client'),
  quality: 85, // WebP quality (0-100)
  effort: 6,   // Compression effort (0-6, higher = smaller file but slower)
  preserveOriginals: true, // Keep original files as fallbacks
};

// Stats tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  webpSize: 0,
};

/**
 * Check if file is an image we should convert
 */
function isConvertibleImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
}

/**
 * Convert a single image to WebP
 */
async function convertImage(inputPath: string): Promise<void> {
  const filename = path.basename(inputPath);
  const ext = path.extname(filename);
  const nameWithoutExt = filename.slice(0, -ext.length);
  const outputPath = path.join(path.dirname(inputPath), `${nameWithoutExt}.webp`);
  
  // Check if WebP already exists
  try {
    await fs.access(outputPath);
    console.log(`⏭️  Skipping ${filename} (WebP already exists)`);
    stats.skipped++;
    return;
  } catch {
    // WebP doesn't exist, proceed with conversion
  }
  
  try {
    // Get original file size
    const originalStat = await fs.stat(inputPath);
    stats.originalSize += originalStat.size;
    
    // Convert to WebP
    const isPNG = ext.toLowerCase() === '.png';
    
    let sharpInstance = sharp(inputPath);
    
    // For PNG with transparency, preserve it
    if (isPNG) {
      const metadata = await sharpInstance.metadata();
      if (metadata.hasAlpha) {
        sharpInstance = sharpInstance.ensureAlpha();
      }
    }
    
    await sharpInstance
      .webp({ 
        quality: CONFIG.quality,
        effort: CONFIG.effort,
        lossless: false,
        nearLossless: false,
      })
      .toFile(outputPath);
    
    // Get WebP file size
    const webpStat = await fs.stat(outputPath);
    stats.webpSize += webpStat.size;
    
    const savings = ((originalStat.size - webpStat.size) / originalStat.size * 100).toFixed(1);
    
    console.log(`✅ Converted: ${filename}`);
    console.log(`   Original: ${(originalStat.size / 1024).toFixed(2)} KB`);
    console.log(`   WebP:     ${(webpStat.size / 1024).toFixed(2)} KB`);
    console.log(`   Savings:  ${savings}%`);
    
    stats.processed++;
  } catch (error) {
    console.error(`❌ Error converting ${filename}:`, error);
    stats.errors++;
  }
}

/**
 * Recursively find all images in directory
 */
async function findImages(dir: string): Promise<string[]> {
  const images: string[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        const subImages = await findImages(fullPath);
        images.push(...subImages);
      } else if (entry.isFile() && isConvertibleImage(entry.name)) {
        images.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return images;
}

/**
 * Main conversion function
 */
async function main() {
  console.log('🚀 Starting Image Optimization...\n');
  console.log(`📁 Source directory: ${CONFIG.sourceDir}`);
  console.log(`⚙️  Quality: ${CONFIG.quality}`);
  console.log(`⚙️  Effort: ${CONFIG.effort}`);
  console.log(`💾 Preserve originals: ${CONFIG.preserveOriginals}\n`);
  
  const startTime = Date.now();
  
  // Find all images
  console.log('🔍 Scanning for images...');
  const images = await findImages(CONFIG.sourceDir);
  
  if (images.length === 0) {
    console.log('❌ No images found to convert');
    return;
  }
  
  console.log(`📸 Found ${images.length} images to process\n`);
  
  // Convert images in batches to avoid memory issues
  const BATCH_SIZE = 5;
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(images.length / BATCH_SIZE)}...\n`);
    
    await Promise.all(batch.map(convertImage));
  }
  
  // Print summary
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalSavings = stats.originalSize > 0 
    ? ((stats.originalSize - stats.webpSize) / stats.originalSize * 100).toFixed(1)
    : '0';
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully converted: ${stats.processed}`);
  console.log(`⏭️  Skipped (already exists): ${stats.skipped}`);
  console.log(`❌ Errors: ${stats.errors}`);
  console.log(`\n📦 Size Comparison:`);
  console.log(`   Original total: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   WebP total:     ${(stats.webpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Space saved:    ${totalSavings}%`);
  console.log(`\n⏱️  Duration: ${duration}s`);
  console.log('='.repeat(60));
  
  if (stats.errors > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);
