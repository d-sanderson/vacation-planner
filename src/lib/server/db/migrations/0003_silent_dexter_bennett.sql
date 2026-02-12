ALTER TABLE `activity` ADD `latitude` text;--> statement-breakpoint
ALTER TABLE `activity` ADD `longitude` text;--> statement-breakpoint
ALTER TABLE `trip` ADD `is_public` integer DEFAULT false NOT NULL;