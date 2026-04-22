-- Run this SQL in your Hostinger phpMyAdmin to add the missing Stripe columns to the orders table
-- Go to: Hostinger Dashboard > Databases > phpMyAdmin > Select your database > SQL tab

-- Add paymentMethod column if it doesn't exist
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `paymentMethod` enum('stripe','invoice') NOT NULL DEFAULT 'invoice' AFTER `items`;

-- Add stripePaymentIntentId column if it doesn't exist
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `stripePaymentIntentId` varchar(255) DEFAULT NULL AFTER `paymentMethod`;

-- Add stripeSessionId column if it doesn't exist
ALTER TABLE `orders` 
ADD COLUMN IF NOT EXISTS `stripeSessionId` varchar(255) DEFAULT NULL AFTER `stripePaymentIntentId`;
