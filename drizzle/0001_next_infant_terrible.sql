CREATE TABLE `preset_designs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`templateId` integer NOT NULL,
	`name` text NOT NULL,
	`designJson` text NOT NULL,
	`thumbnail` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `saved_designs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text NOT NULL,
	`templateId` integer NOT NULL,
	`name` text NOT NULL,
	`designJson` text NOT NULL,
	`thumbnail` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `svg_templates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`svgData` text NOT NULL,
	`partNames` text NOT NULL,
	`thumbnail` text,
	`isActive` integer DEFAULT true NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `svg_templates_slug_unique` ON `svg_templates` (`slug`);