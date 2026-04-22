#!/usr/bin/env tsx
/**
 * Category Management System Setup
 * 
 * Run this script to create categories and subcategories tables:
 * npm run db:setup-categories
 * 
 * This will:
 * 1. Create categories table
 * 2. Create subcategories table
 * 3. Migrate existing products to use category_id
 * 4. Seed default categories from SHOP_CATEGORIES
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { config } from "dotenv";
import { resolve } from "path";

// Load env from parent directory
config({ path: resolve(process.cwd(), ".env") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment");
  console.error("Please check your .env file");
  process.exit(1);
}

const DEFAULT_CATEGORIES = [
  {
    name: "Ski Wear",
    slug: "ski-wear",
    icon: "⛷️",
    description: "Technical alpine apparel for skiing and snowboarding",
    subcategories: [
      { name: "Ski Jackets", slug: "ski-jackets", description: "Waterproof insulated jackets" },
      { name: "Ski Pants", slug: "ski-pants", description: "Snow pants and bibs" },
      { name: "Base Layers", slug: "base-layers", description: "Thermal underlayers" },
      { name: "Mid Layers", slug: "mid-layers", description: "Fleeces and insulated mid-layers" },
      { name: "Ski Suits", slug: "ski-suits", description: "One-piece snowsuits" },
      { name: "Accessories", slug: "ski-accessories", description: "Gloves, beanies, neck warmers" },
    ]
  },
  {
    name: "Sports Wear",
    slug: "sports-wear",
    icon: "⚽",
    description: "High-performance athletic apparel",
    subcategories: [
      { name: "Jerseys", slug: "jerseys", description: "Team and custom jerseys" },
      { name: "Shorts", slug: "shorts", description: "Athletic shorts" },
      { name: "Compression Wear", slug: "compression", description: "Base layers and compression gear" },
      { name: "Training Tops", slug: "training-tops", description: "T-shirts and tanks" },
      { name: "Tracksuits", slug: "tracksuits", description: "Warm-up suits" },
      { name: "Team Kits", slug: "team-kits", description: "Complete team uniforms" },
    ]
  },
  {
    name: "Hunting Wear",
    slug: "hunting-wear",
    icon: "🦌",
    description: "Tactical and camouflage outdoor gear",
    subcategories: [
      { name: "Hunting Jackets", slug: "hunting-jackets", description: "Waterproof camo jackets" },
      { name: "Hunting Pants", slug: "hunting-pants", description: "Cargo and field pants" },
      { name: "Vests", slug: "hunting-vests", description: "Tactical and game vests" },
      { name: "Camo Gear", slug: "camo-gear", description: "Camouflage apparel" },
      { name: "Base Layers", slug: "hunting-base", description: "Scent-control underlayers" },
      { name: "Blaze Orange", slug: "blaze-orange", description: "High-vis safety gear" },
    ]
  },
  {
    name: "Streetwear",
    slug: "streetwear",
    icon: "👕",
    description: "Urban fashion and lifestyle apparel",
    subcategories: [
      { name: "Hoodies", slug: "hoodies", description: "Pullover and zip hoodies" },
      { name: "T-Shirts", slug: "t-shirts", description: "Graphic and plain tees" },
      { name: "Sweatshirts", slug: "sweatshirts", description: "Crew neck sweatshirts" },
      { name: "Joggers", slug: "joggers", description: "Sweatpants and joggers" },
      { name: "Cargo Pants", slug: "cargo-pants", description: "Utility cargo pants" },
      { name: "Bomber Jackets", slug: "bomber-jackets", description: "MA-1 and varsity jackets" },
    ]
  },
  {
    name: "Tech Wear",
    slug: "tech-wear",
    icon: "🔧",
    description: "Functional urban technical apparel",
    subcategories: [
      { name: "Tech Jackets", slug: "tech-jackets", description: "Waterproof shells" },
      { name: "Tech Pants", slug: "tech-pants", description: "Articulated cargo pants" },
      { name: "Tech Vests", slug: "tech-vests", description: "Chest rigs and tactical vests" },
      { name: "Bags", slug: "tech-bags", description: "Sling bags and backpacks" },
      { name: "Tech Shorts", slug: "tech-shorts", description: "Utility shorts" },
      { name: "Modular Pieces", slug: "modular", description: "Detachable and convertible" },
    ]
  },
  {
    name: "Martial Arts Wear",
    slug: "martial-arts",
    icon: "🥋",
    description: "BJJ, MMA, and combat sports gear",
    subcategories: [
      { name: "BJJ Gis", slug: "bjj-gis", description: "Brazilian Jiu-Jitsu kimonos" },
      { name: "Rashguards", slug: "rashguards", description: "Compression rashguards" },
      { name: "MMA Shorts", slug: "mma-shorts", description: "Fight shorts" },
      { name: "Spats", slug: "spats", description: "Compression leggings" },
      { name: "Uniforms", slug: "martial-arts-uniforms", description: "Karate, judo uniforms" },
      { name: "Fight Wear", slug: "fight-wear", description: "Training and competition gear" },
    ]
  },
  {
    name: "Security Uniforms",
    slug: "security-uniforms",
    icon: "👮",
    description: "Professional security and tactical uniforms",
    subcategories: [
      { name: "Security Shirts", slug: "security-shirts", description: "Polo and tactical shirts" },
      { name: "Security Pants", slug: "security-pants", description: "Duty trousers" },
      { name: "Security Jackets", slug: "security-jackets", description: "Patrol and hi-vis jackets" },
      { name: "Tactical Gear", slug: "tactical-gear", description: "Vests and duty belts" },
      { name: "Hi-Vis Wear", slug: "hi-vis", description: "High visibility clothing" },
      { name: "Uniform Sets", slug: "uniform-sets", description: "Complete uniform packages" },
    ]
  },
];

async function setupCategories() {
  console.log("🔧 Setting up Category Management System...\n");

  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  try {
    // Check if tables already exist
    const [existingTables] = await connection.execute(
      "SHOW TABLES LIKE 'categories'"
    );
    
    if (Array.isArray(existingTables) && existingTables.length > 0) {
      console.log("⚠️  Categories table already exists");
      const answer = await question("Do you want to reset and recreate? (y/N): ");
      if (answer.toLowerCase() !== 'y') {
        console.log("❌ Setup cancelled");
        await connection.end();
        return;
      }
      
      // Drop existing tables
      console.log("🗑️  Dropping existing tables...");
      await connection.execute("DROP TABLE IF EXISTS subcategories");
      await connection.execute("DROP TABLE IF EXISTS categories");
      console.log("✅ Tables dropped\n");
    }

    // Create categories table
    console.log("📦 Creating categories table...");
    await connection.execute(`
      CREATE TABLE categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT '',
        description TEXT,
        image_url VARCHAR(1000),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        seo_title VARCHAR(255),
        seo_description TEXT,
        seo_keywords TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Categories table created\n");

    // Create subcategories table
    console.log("📦 Creating subcategories table...");
    await connection.execute(`
      CREATE TABLE subcategories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL,
        description TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_category_subcategory (category_id, slug)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✅ Subcategories table created\n");

    // Add category_id and subcategory_id to products table if not exists
    console.log("🔧 Updating products table...");
    const [productColumns] = await connection.execute(
      "SHOW COLUMNS FROM products LIKE 'category_id'"
    );
    
    if (Array.isArray(productColumns) && productColumns.length === 0) {
      await connection.execute(`
        ALTER TABLE products 
        ADD COLUMN category_id INT NULL AFTER category,
        ADD COLUMN subcategory_id INT NULL AFTER category_id,
        ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        ADD FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
      `);
      console.log("✅ Added category_id and subcategory_id columns to products\n");
    } else {
      console.log("⚠️  category_id column already exists in products\n");
    }

    // Seed default categories
    console.log("🌱 Seeding default categories...");
    for (const cat of DEFAULT_CATEGORIES) {
      const [result] = await connection.execute(
        `INSERT INTO categories (name, slug, icon, description, sort_order, is_active) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [cat.name, cat.slug, cat.icon, cat.description, 0, true]
      );
      
      const categoryId = (result as any).insertId;
      
      // Insert subcategories
      for (let i = 0; i < cat.subcategories.length; i++) {
        const sub = cat.subcategories[i];
        await connection.execute(
          `INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [categoryId, sub.name, sub.slug, sub.description, i, true]
        );
      }
      
      console.log(`  ✅ ${cat.name} (${cat.subcategories.length} subcategories)`);
    }
    console.log("");

    // Migrate existing products to use category_id
    console.log("🔄 Migrating existing products...");
    const [existingProducts] = await connection.execute(
      "SELECT id, category FROM products WHERE category_id IS NULL"
    );
    
    if (Array.isArray(existingProducts) && existingProducts.length > 0) {
      // Get all categories for lookup
      const [categories] = await connection.execute("SELECT id, slug FROM categories");
      const categoryMap = new Map(
        (categories as any[]).map(c => [c.slug, c.id])
      );
      
      let migrated = 0;
      for (const product of existingProducts as any[]) {
        const categoryId = categoryMap.get(product.category);
        if (categoryId) {
          await connection.execute(
            "UPDATE products SET category_id = ? WHERE id = ?",
            [categoryId, product.id]
          );
          migrated++;
        }
      }
      console.log(`✅ Migrated ${migrated} products to use category_id\n`);
    } else {
      console.log("✅ No products to migrate\n");
    }

    console.log("🎉 Category Management System setup complete!");
    console.log("\nNext steps:");
    console.log("  1. Build and deploy: npm run build:local && git add dist/ && git commit -m 'feat: category system' && git push");
    console.log("  2. Visit /admin/categories to manage categories");
    console.log("  3. Visit /admin/products to add products with categories");

  } catch (error) {
    console.error("\n❌ Error during setup:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Simple prompt for user input
function question(prompt: string): Promise<string> {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
}

setupCategories().catch(console.error);
