-- ============================================================
-- Pak Homies Industry - Full Database Setup Script
-- Run this on your Hostinger MySQL database
-- ============================================================

CREATE DATABASE IF NOT EXISTS `sialkotsample_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `sialkotsample_db`;

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `openId` VARCHAR(64) NOT NULL UNIQUE,
  `name` TEXT,
  `email` VARCHAR(320),
  `loginMethod` VARCHAR(64),
  `password` VARCHAR(255),
  `geminiApiKey` VARCHAR(255),
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(500) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `shortDescription` VARCHAR(500),
  `mainImage` VARCHAR(1000),
  `samplePrice` DECIMAL(10,2),
  `weight` DECIMAL(8,3),
  `availableSizes` TEXT,
  `availableColors` TEXT,
  `material` VARCHAR(255),
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `freeShipping` BOOLEAN NOT NULL DEFAULT FALSE,
  `seoTitle` VARCHAR(255),
  `seoDescription` TEXT,
  `seoKeywords` TEXT,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Product Images ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `imageUrl` VARCHAR(1000) NOT NULL,
  `altText` VARCHAR(255),
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Slab Prices (MOQ tiers) ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `slab_prices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL,
  `minQty` INT NOT NULL,
  `maxQty` INT,
  `pricePerUnit` DECIMAL(10,2) NOT NULL,
  `label` VARCHAR(100),
  `sortOrder` INT NOT NULL DEFAULT 0,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Size Charts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `size_charts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `productId` INT NOT NULL UNIQUE,
  `chartData` TEXT NOT NULL,
  `unit` ENUM('inches','cm') NOT NULL DEFAULT 'inches',
  `notes` TEXT,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Shipping Zones ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `shipping_zones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `zoneName` VARCHAR(100) NOT NULL,
  `countries` TEXT NOT NULL,
  `baseRate` DECIMAL(10,2) NOT NULL,
  `perUnitRate` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `perKgRate` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `minDays` INT NOT NULL DEFAULT 7,
  `maxDays` INT NOT NULL DEFAULT 21,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'USD',
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Cart Items ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sessionId` VARCHAR(128) NOT NULL,
  `userId` INT,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `selectedSize` VARCHAR(50),
  `selectedColor` VARCHAR(100),
  `addedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `orderNumber` VARCHAR(64) NOT NULL UNIQUE,
  `userId` INT,
  `sessionId` VARCHAR(128),
  `customerName` VARCHAR(255) NOT NULL,
  `customerEmail` VARCHAR(320) NOT NULL,
  `customerPhone` VARCHAR(64),
  `companyName` VARCHAR(255),
  `addressLine1` VARCHAR(500) NOT NULL,
  `addressLine2` VARCHAR(500),
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100),
  `postalCode` VARCHAR(20),
  `country` VARCHAR(100) NOT NULL,
  `countryCode` VARCHAR(10) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `shippingCost` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `totalAmount` DECIMAL(10,2) NOT NULL,
  `items` TEXT NOT NULL,
  `stripePaymentIntentId` VARCHAR(255),
  `stripeSessionId` VARCHAR(255),
  `status` ENUM('pending','paid','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `notes` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── RFQ Submissions ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `rfq_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `companyName` VARCHAR(255) NOT NULL,
  `contactName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `phone` VARCHAR(64),
  `country` VARCHAR(100),
  `website` VARCHAR(255),
  `productType` VARCHAR(100) NOT NULL,
  `quantity` VARCHAR(100) NOT NULL,
  `customization` TEXT,
  `fabricPreference` VARCHAR(255),
  `timeline` VARCHAR(100),
  `budget` VARCHAR(100),
  `additionalNotes` TEXT,
  `designImageUrl` TEXT,
  `garmentType` VARCHAR(100),
  `status` ENUM('new','reviewed','quoted','closed') NOT NULL DEFAULT 'new',
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Blog Posts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` VARCHAR(500) NOT NULL,
  `excerpt` TEXT,
  `content` TEXT,
  `category` VARCHAR(100),
  `tags` TEXT,
  `featuredImage` VARCHAR(500),
  `metaTitle` VARCHAR(255),
  `metaDescription` TEXT,
  `published` BOOLEAN NOT NULL DEFAULT FALSE,
  `publishedAt` TIMESTAMP NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Portfolio Items ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(500) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `tags` TEXT,
  `coverImage` VARCHAR(1000),
  `seoTitle` VARCHAR(255),
  `seoDescription` TEXT,
  `seoKeywords` TEXT,
  `geoTarget` VARCHAR(255),
  `ogImage` VARCHAR(1000),
  `isFeatured` BOOLEAN NOT NULL DEFAULT FALSE,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Portfolio Images ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `portfolio_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `portfolioItemId` INT NOT NULL,
  `imageUrl` VARCHAR(1000) NOT NULL,
  `fileKey` VARCHAR(500),
  `altText` VARCHAR(500),
  `caption` VARCHAR(500),
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`portfolioItemId`) REFERENCES `portfolio_items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Testimonials ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `clientName` VARCHAR(255) NOT NULL,
  `clientTitle` VARCHAR(255),
  `companyName` VARCHAR(255),
  `country` VARCHAR(100),
  `rating` INT DEFAULT 5,
  `testimonial` TEXT NOT NULL,
  `avatar` VARCHAR(500),
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Contact Submissions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `company` VARCHAR(255),
  `phone` VARCHAR(64),
  `subject` VARCHAR(500),
  `message` TEXT NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Done! All tables created successfully.
-- ============================================================

