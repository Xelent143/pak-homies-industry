CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`icon` varchar(50) DEFAULT '',
	`description` text,
	`image_url` varchar(1000),
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`seo_title` varchar(255),
	`seo_description` text,
	`seo_keywords` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product_automation_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int,
	`isEnabled` boolean NOT NULL DEFAULT false,
	`runEveryMinutes` int NOT NULL DEFAULT 60,
	`maxSourcesPerRun` int NOT NULL DEFAULT 1,
	`geminiRequestsPerMinuteLimit` int NOT NULL DEFAULT 8,
	`geminiRequestsPerDayLimit` int NOT NULL DEFAULT 100,
	`defaultCategoryId` int,
	`defaultSubcategoryId` int,
	`defaultCategoryLabel` varchar(100),
	`savedModelId` int,
	`defaultPrompt` text,
	`lastRunAt` timestamp,
	`lastRunSummary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_automation_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_automation_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceUrl` varchar(1000) NOT NULL,
	`sourceTitle` varchar(255),
	`status` enum('queued','processing','draft_created','failed','skipped') NOT NULL DEFAULT 'queued',
	`categoryId` int,
	`subcategoryId` int,
	`categoryLabel` varchar(100),
	`promptOverride` text,
	`notes` text,
	`productId` int,
	`generatedMainImage` varchar(1000),
	`attemptCount` int NOT NULL DEFAULT 0,
	`lastAttemptAt` timestamp,
	`nextAttemptAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `product_automation_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_automation_sources_sourceUrl_unique` UNIQUE(`sourceUrl`)
);
--> statement-breakpoint
CREATE TABLE `product_automation_usage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceId` int,
	`reservedRequests` int NOT NULL,
	`reason` varchar(100) NOT NULL DEFAULT 'automation_run',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_automation_usage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subcategories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category_id` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`sort_order` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subcategories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `products` ADD `category_id` int;--> statement-breakpoint
ALTER TABLE `products` ADD `subcategory_id` int;