-- =====================================================
-- SSM Category Management System - Database Setup
-- =====================================================
-- Run this SQL script to create the categories tables
-- 
-- Usage:
--   mysql -u YOUR_USER -p YOUR_DATABASE < setup-categories.sql
--   OR
--   npm run db:setup-categories (recommended)
-- =====================================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add category_id and subcategory_id to products table if not exists
SET @exist := (SELECT COUNT(*) FROM information_schema.columns 
               WHERE table_name = 'products' AND column_name = 'category_id');
SET @sql := IF(@exist = 0, 
               'ALTER TABLE products ADD COLUMN category_id INT NULL AFTER category, 
                ADD COLUMN subcategory_id INT NULL AFTER category_id',
               'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign keys if not exists
SET @exist_fk1 := (SELECT COUNT(*) FROM information_schema.table_constraints 
                   WHERE table_name = 'products' AND constraint_name = 'fk_product_category');
SET @sql_fk1 := IF(@exist_fk1 = 0,
                   'ALTER TABLE products ADD CONSTRAINT fk_product_category 
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL',
                   'SELECT 1');
PREPARE stmt FROM @sql_fk1;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_fk2 := (SELECT COUNT(*) FROM information_schema.table_constraints 
                   WHERE table_name = 'products' AND constraint_name = 'fk_product_subcategory');
SET @sql_fk2 := IF(@exist_fk2 = 0,
                   'ALTER TABLE products ADD CONSTRAINT fk_product_subcategory 
                    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL',
                   'SELECT 1');
PREPARE stmt FROM @sql_fk2;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Insert default categories (only if table is empty)
INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Ski Wear' as name, 'ski-wear' as slug, '⛷️' as icon, 'Technical alpine apparel for skiing and snowboarding' as description, 1 as sort_order, TRUE as is_active) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'ski-wear');

INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Sports Wear', 'sports-wear', '⚽', 'High-performance athletic apparel', 2, TRUE) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'sports-wear');

INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Hunting Wear', 'hunting-wear', '🦌', 'Tactical and camouflage outdoor gear', 3, TRUE) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'hunting-wear');

INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Streetwear', 'streetwear', '👕', 'Urban fashion and lifestyle apparel', 4, TRUE) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'streetwear');

INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Tech Wear', 'tech-wear', '🔧', 'Functional urban technical apparel', 5, TRUE) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'tech-wear');

INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Martial Arts Wear', 'martial-arts', '🥋', 'BJJ, MMA, and combat sports gear', 6, TRUE) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'martial-arts');

INSERT INTO categories (name, slug, icon, description, sort_order, is_active)
SELECT * FROM (SELECT 'Security Uniforms', 'security-uniforms', '👮', 'Professional security and tactical uniforms', 7, TRUE) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'security-uniforms');

-- Insert default subcategories for Ski Wear
INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Ski Jackets', 'ski-jackets', 'Waterproof insulated jackets', 1, TRUE
FROM categories c WHERE c.slug = 'ski-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'ski-wear' AND s.slug = 'ski-jackets');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Ski Pants', 'ski-pants', 'Snow pants and bibs', 2, TRUE
FROM categories c WHERE c.slug = 'ski-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'ski-wear' AND s.slug = 'ski-pants');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Base Layers', 'base-layers', 'Thermal underlayers', 3, TRUE
FROM categories c WHERE c.slug = 'ski-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'ski-wear' AND s.slug = 'base-layers');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Mid Layers', 'mid-layers', 'Fleeces and insulated mid-layers', 4, TRUE
FROM categories c WHERE c.slug = 'ski-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'ski-wear' AND s.slug = 'mid-layers');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Ski Suits', 'ski-suits', 'One-piece snowsuits', 5, TRUE
FROM categories c WHERE c.slug = 'ski-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'ski-wear' AND s.slug = 'ski-suits');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Accessories', 'ski-accessories', 'Gloves, beanies, neck warmers', 6, TRUE
FROM categories c WHERE c.slug = 'ski-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'ski-wear' AND s.slug = 'ski-accessories');

-- Insert default subcategories for Sports Wear
INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Jerseys', 'jerseys', 'Team and custom jerseys', 1, TRUE
FROM categories c WHERE c.slug = 'sports-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'sports-wear' AND s.slug = 'jerseys');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Shorts', 'shorts', 'Athletic shorts', 2, TRUE
FROM categories c WHERE c.slug = 'sports-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'sports-wear' AND s.slug = 'shorts');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Compression Wear', 'compression', 'Base layers and compression gear', 3, TRUE
FROM categories c WHERE c.slug = 'sports-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'sports-wear' AND s.slug = 'compression');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Training Tops', 'training-tops', 'T-shirts and tanks', 4, TRUE
FROM categories c WHERE c.slug = 'sports-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'sports-wear' AND s.slug = 'training-tops');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Tracksuits', 'tracksuits', 'Warm-up suits', 5, TRUE
FROM categories c WHERE c.slug = 'sports-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'sports-wear' AND s.slug = 'tracksuits');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Team Kits', 'team-kits', 'Complete team uniforms', 6, TRUE
FROM categories c WHERE c.slug = 'sports-wear'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'sports-wear' AND s.slug = 'team-kits');

-- Insert default subcategories for Martial Arts Wear
INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'BJJ Gis', 'bjj-gis', 'Brazilian Jiu-Jitsu kimonos', 1, TRUE
FROM categories c WHERE c.slug = 'martial-arts'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'martial-arts' AND s.slug = 'bjj-gis');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Rashguards', 'rashguards', 'Compression rashguards', 2, TRUE
FROM categories c WHERE c.slug = 'martial-arts'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'martial-arts' AND s.slug = 'rashguards');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'MMA Shorts', 'mma-shorts', 'Fight shorts', 3, TRUE
FROM categories c WHERE c.slug = 'martial-arts'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'martial-arts' AND s.slug = 'mma-shorts');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Spats', 'spats', 'Compression leggings', 4, TRUE
FROM categories c WHERE c.slug = 'martial-arts'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'martial-arts' AND s.slug = 'spats');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Uniforms', 'martial-arts-uniforms', 'Karate, judo uniforms', 5, TRUE
FROM categories c WHERE c.slug = 'martial-arts'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'martial-arts' AND s.slug = 'martial-arts-uniforms');

INSERT INTO subcategories (category_id, name, slug, description, sort_order, is_active)
SELECT c.id, 'Fight Wear', 'fight-wear', 'Training and competition gear', 6, TRUE
FROM categories c WHERE c.slug = 'martial-arts'
AND NOT EXISTS (SELECT 1 FROM subcategories s JOIN categories c2 ON s.category_id = c2.id WHERE c2.slug = 'martial-arts' AND s.slug = 'fight-wear');

-- =====================================================
-- Setup Complete!
-- =====================================================
-- Access category management at: /admin-saad/categories
-- =====================================================
