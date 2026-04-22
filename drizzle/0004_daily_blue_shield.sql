CREATE TABLE `portfolio_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`portfolioItemId` int NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`fileKey` varchar(500),
	`altText` varchar(500),
	`caption` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `portfolio_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tech_pack_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`techPackId` int NOT NULL,
	`imageUrl` varchar(1000) NOT NULL,
	`fileKey` varchar(500),
	`imageType` enum('mockup','flat_sketch','reference','hangtag','care_label') NOT NULL,
	`caption` varchar(500),
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tech_pack_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tech_packs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceNumber` varchar(64) NOT NULL,
	`brandName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`country` varchar(100),
	`garmentType` varchar(100) NOT NULL,
	`styleName` varchar(255),
	`season` varchar(100),
	`gender` varchar(100),
	`targetMarket` varchar(255),
	`techPackData` text NOT NULL,
	`status` enum('draft','submitted','reviewed','quoted') NOT NULL DEFAULT 'submitted',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tech_packs_id` PRIMARY KEY(`id`),
	CONSTRAINT `tech_packs_referenceNumber_unique` UNIQUE(`referenceNumber`)
);
--> statement-breakpoint
ALTER TABLE `portfolio_items` MODIFY COLUMN `category` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `tags` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `coverImage` varchar(1000);--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `seoTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `seoDescription` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `seoKeywords` text;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `geoTarget` varchar(255);--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `ogImage` varchar(1000);--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `isFeatured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `isActive` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `portfolio_items` ADD `sortOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `manufacturingStory` text;--> statement-breakpoint
ALTER TABLE `products` ADD `manufacturingInfographic` varchar(1000);--> statement-breakpoint
ALTER TABLE `rfq_submissions` ADD `designImageUrl` text;--> statement-breakpoint
ALTER TABLE `rfq_submissions` ADD `garmentType` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `geminiApiKey` varchar(255);--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `clientName`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `clientCountry`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `challenge`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `solution`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `result`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `images`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `featured`;--> statement-breakpoint
ALTER TABLE `portfolio_items` DROP COLUMN `orderQuantity`;