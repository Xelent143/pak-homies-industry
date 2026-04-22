#!/usr/bin/env tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DATABASE SEED SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Seeds the database with sample products and data.
 * Run with: pnpm db:seed
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.js';
import { sampleProducts, sampleProductImages, sampleSlabPrices, sampleSizeCharts } from '../template-config/seed-data/sample-products.js';
import { BRAND_CONFIG } from '../template-config/brand.config.js';

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

async function main() {
  log('\n╔══════════════════════════════════════════════════════════════╗', 'cyan');
  log('║       SEEDING DATABASE                                       ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════════╝', 'cyan');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    log('\n❌ DATABASE_URL environment variable not set!', 'red');
    log('Please set it in your .env file', 'reset');
    process.exit(1);
  }

  log(`\n📝 Seeding for: ${BRAND_CONFIG.siteName}`, 'yellow');
  log(`🗄️  Database: ${databaseUrl.replace(/:.*@/, ':***@')}`, 'yellow');

  try {
    // Create connection
    const connection = await mysql.createConnection(databaseUrl);
    const db = drizzle(connection, { schema, mode: 'default' });

    // Check if products already exist
    const existingProducts = await db.select().from(schema.products).limit(1);
    
    if (existingProducts.length > 0) {
      log('\n⚠️  Database already contains products!', 'yellow');
      log('   Run `pnpm db:push` to reset the database first if you want to re-seed.', 'reset');
      await connection.end();
      process.exit(0);
    }

    log('\n📦 Seeding products...', 'cyan');

    // Insert products
    for (const product of sampleProducts) {
      const [inserted] = await db.insert(schema.products).values(product);
      const productId = inserted.insertId;
      const productSlug = product.slug;

      log(`  ✓ ${product.title}`, 'green');

      // Insert product images
      const images = sampleProductImages[productSlug];
      if (images && productId) {
        for (const image of images) {
          await db.insert(schema.productImages).values({
            ...image,
            productId: Number(productId),
          });
        }
        log(`    - ${images.length} images`, 'reset');
      }

      // Insert slab prices
      const prices = sampleSlabPrices[productSlug];
      if (prices && productId) {
        for (const price of prices) {
          await db.insert(schema.slabPrices).values({
            ...price,
            productId: Number(productId),
          });
        }
        log(`    - ${prices.length} price tiers`, 'reset');
      }

      // Insert size chart
      const sizeChart = sampleSizeCharts[productSlug];
      if (sizeChart && productId) {
        await db.insert(schema.sizeCharts).values({
          ...sizeChart,
          productId: Number(productId),
        });
        log(`    - size chart`, 'reset');
      }
    }

    // Insert sample testimonials
    log('\n💬 Seeding testimonials...', 'cyan');
    const { testimonials } = await import('../template-config/brand.config.js');
    
    for (const testimonial of BRAND_CONFIG.testimonials) {
      await db.insert(schema.testimonials).values({
        clientName: testimonial.name,
        clientTitle: testimonial.title,
        country: testimonial.countryName,
        rating: testimonial.rating,
        testimonial: testimonial.text,
        featured: true,
      });
      log(`  ✓ ${testimonial.name}`, 'green');
    }

    // Create admin user
    log('\n👤 Creating admin user...', 'cyan');
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Change this!
    
    // Note: In production, hash the password properly
    await db.insert(schema.users).values({
      openId: 'admin-local',
      name: 'Administrator',
      email: adminEmail,
      loginMethod: 'local',
      password: adminPassword, // Should be hashed in production
      role: 'admin',
    });
    
    log(`  ✓ Admin: ${adminEmail}`, 'green');
    log(`  ⚠️  Password: ${adminPassword} (change this immediately!)`, 'yellow');

    await connection.end();

    log('\n╔══════════════════════════════════════════════════════════════╗', 'green');
    log('║       ✓ DATABASE SEEDED SUCCESSFULLY                         ║', 'green');
    log('╚══════════════════════════════════════════════════════════════╝', 'green');

    log('\nNext steps:', 'cyan');
    log('  1. Add your product images to client/public/images/products/', 'reset');
    log('  2. Run: pnpm dev', 'reset');
    log('  3. Login as admin at /admin-login', 'reset');
    log('  4. Change the default admin password!', 'reset');

  } catch (error) {
    log('\n❌ Error seeding database:', 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
