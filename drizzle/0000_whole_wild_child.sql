CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`content` text,
	`category` text,
	`tags` text,
	`featuredImage` text,
	`metaTitle` text,
	`metaDescription` text,
	`published` integer DEFAULT false NOT NULL,
	`publishedAt` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text NOT NULL,
	`userId` integer,
	`productId` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`selectedSize` text,
	`selectedColor` text,
	`addedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`phone` text,
	`subject` text,
	`message` text NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`orderNumber` text NOT NULL,
	`userId` integer,
	`sessionId` text,
	`customerName` text NOT NULL,
	`customerEmail` text NOT NULL,
	`customerPhone` text,
	`companyName` text,
	`addressLine1` text NOT NULL,
	`addressLine2` text,
	`city` text NOT NULL,
	`state` text,
	`postalCode` text,
	`country` text NOT NULL,
	`countryCode` text NOT NULL,
	`subtotal` integer NOT NULL,
	`shippingCost` integer DEFAULT 0 NOT NULL,
	`totalAmount` integer NOT NULL,
	`items` text NOT NULL,
	`stripePaymentIntentId` text,
	`stripeSessionId` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_orderNumber_unique` ON `orders` (`orderNumber`);--> statement-breakpoint
CREATE TABLE `portfolio_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`portfolioItemId` integer NOT NULL,
	`imageUrl` text NOT NULL,
	`fileKey` text,
	`altText` text,
	`caption` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`tags` text,
	`coverImage` text,
	`seoTitle` text,
	`seoDescription` text,
	`seoKeywords` text,
	`geoTarget` text,
	`ogImage` text,
	`isFeatured` integer DEFAULT false NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`imageUrl` text NOT NULL,
	`altText` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`shortDescription` text,
	`mainImage` text,
	`samplePrice` integer,
	`weight` integer,
	`availableSizes` text,
	`availableColors` text,
	`material` text,
	`isFeatured` integer DEFAULT false NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`freeShipping` integer DEFAULT false NOT NULL,
	`seoTitle` text,
	`seoDescription` text,
	`seoKeywords` text,
	`sortOrder` integer DEFAULT 0 NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `rfq_submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`companyName` text NOT NULL,
	`contactName` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`country` text,
	`website` text,
	`productType` text NOT NULL,
	`quantity` text NOT NULL,
	`customization` text,
	`fabricPreference` text,
	`timeline` text,
	`budget` text,
	`additionalNotes` text,
	`designImageUrl` text,
	`garmentType` text,
	`status` text DEFAULT 'new' NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shipping_zones` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zoneName` text NOT NULL,
	`countries` text NOT NULL,
	`baseRate` integer NOT NULL,
	`perUnitRate` integer DEFAULT 0 NOT NULL,
	`perKgRate` integer DEFAULT 0 NOT NULL,
	`minDays` integer DEFAULT 7 NOT NULL,
	`maxDays` integer DEFAULT 21 NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `size_charts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`chartData` text NOT NULL,
	`unit` text DEFAULT 'inches' NOT NULL,
	`notes` text,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `size_charts_productId_unique` ON `size_charts` (`productId`);--> statement-breakpoint
CREATE TABLE `slab_prices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`productId` integer NOT NULL,
	`minQty` integer NOT NULL,
	`maxQty` integer,
	`pricePerUnit` integer NOT NULL,
	`label` text,
	`sortOrder` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clientName` text NOT NULL,
	`clientTitle` text,
	`companyName` text,
	`country` text,
	`rating` integer DEFAULT 5,
	`testimonial` text NOT NULL,
	`avatar` text,
	`featured` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`openId` text NOT NULL,
	`name` text,
	`email` text,
	`loginMethod` text,
	`role` text DEFAULT 'user' NOT NULL,
	`createdAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updatedAt` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`lastSignedIn` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_openId_unique` ON `users` (`openId`);