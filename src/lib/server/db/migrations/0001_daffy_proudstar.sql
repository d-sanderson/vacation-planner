CREATE TABLE `activity` (
	`id` text PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`start_time` text,
	`end_time` text,
	`location` text,
	`category` text,
	`notes` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	FOREIGN KEY (`day_id`) REFERENCES `day`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `activity_dayId_idx` ON `activity` (`day_id`);--> statement-breakpoint
CREATE TABLE `day` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`date` text NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	FOREIGN KEY (`trip_id`) REFERENCES `trip`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `day_tripId_idx` ON `day` (`trip_id`);--> statement-breakpoint
CREATE TABLE `trip` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`destination` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`description` text,
	`created_by` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)),
	FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT 'viewer' NOT NULL;