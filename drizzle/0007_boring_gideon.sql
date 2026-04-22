CREATE TABLE `saved_tryon_models` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`imageUrl` varchar(1000) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_tryon_models_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `savedModelImageBase64`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `savedModelImageMimeType`;