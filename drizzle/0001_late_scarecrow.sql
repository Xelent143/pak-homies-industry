CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`excerpt` text,
	`content` text,
	`category` varchar(100),
	`tags` text,
	`featuredImage` varchar(500),
	`metaTitle` varchar(255),
	`metaDescription` text,
	`published` boolean NOT NULL DEFAULT false,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`clientName` varchar(255),
	`clientCountry` varchar(100),
	`category` varchar(100),
	`description` text,
	`challenge` text,
	`solution` text,
	`result` text,
	`images` text,
	`featured` boolean NOT NULL DEFAULT false,
	`orderQuantity` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portfolio_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rfq_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64),
	`country` varchar(100),
	`website` varchar(255),
	`productType` varchar(100) NOT NULL,
	`quantity` varchar(100) NOT NULL,
	`customization` text,
	`fabricPreference` varchar(255),
	`timeline` varchar(100),
	`budget` varchar(100),
	`additionalNotes` text,
	`status` enum('new','reviewed','quoted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rfq_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientTitle` varchar(255),
	`companyName` varchar(255),
	`country` varchar(100),
	`rating` int DEFAULT 5,
	`testimonial` text NOT NULL,
	`avatar` varchar(500),
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
