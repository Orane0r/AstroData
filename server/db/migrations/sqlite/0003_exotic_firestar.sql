CREATE TABLE `seed_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`lastMigration` text NOT NULL,
	`seedVersion` integer NOT NULL,
	`seededAt` integer NOT NULL
);
