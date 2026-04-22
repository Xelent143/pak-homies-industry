CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`userId` int,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`selectedSize` varchar(50),
	`selectedColor` varchar(100),
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(64) NOT NULL,
	`userId` int,
	`sessionId` varchar(128),
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(64),
	`companyName` varchar(255),
	`addressLine1` varchar(500) NOT NULL,
	`addressLine2` varchar(500),
	`city` varchar(100) NOT NULL,
	`state` varchar(100),
	`postalCode` varchar(20),
	`country` varchar(100) NOT NULL,
	`countryCode` varchar(10) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`shippingCost` decimal(10,2) NOT NULL DEFAULT '0.00',
	`totalAmount` decimal(10,2) NOT NULL,
	`items` text NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`stripeSessionId` varchar(255),
	`status` enum('pending','paid','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`altText` varchar(255),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`category` varchar(100) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`mainImage` varchar(1000),
	`samplePrice` decimal(10,2),
	`weight` decimal(8,3),
	`availableSizes` text,
	`availableColors` text,
	`material` varchar(255),
	`isFeatured` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`freeShipping` boolean NOT NULL DEFAULT false,
	`seoTitle` varchar(255),
	`seoDescription` text,
	`seoKeywords` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `shipping_zones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`zoneName` varchar(100) NOT NULL,
	`countries` text NOT NULL,
	`baseRate` decimal(10,2) NOT NULL,
	`perUnitRate` decimal(10,2) NOT NULL DEFAULT '0.00',
	`perKgRate` decimal(10,2) NOT NULL DEFAULT '0.00',
	`minDays` int NOT NULL DEFAULT 7,
	`maxDays` int NOT NULL DEFAULT 21,
	`currency` varchar(10) NOT NULL DEFAULT 'USD',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipping_zones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `size_charts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`chartData` text NOT NULL,
	`unit` enum('inches','cm') NOT NULL DEFAULT 'inches',
	`notes` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `size_charts_id` PRIMARY KEY(`id`),
	CONSTRAINT `size_charts_productId_unique` UNIQUE(`productId`)
);
--> statement-breakpoint
CREATE TABLE `slab_prices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int NOT NULL,
	`minQty` int NOT NULL,
	`maxQty` int,
	`pricePerUnit` decimal(10,2) NOT NULL,
	`label` varchar(100),
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `slab_prices_id` PRIMARY KEY(`id`)
);
