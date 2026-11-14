-- `slug` cannot be added to a populated table: SQLite refuses a NOT NULL column
-- without default, and a unique index cannot be built on a backfill.
-- The table is fully rebuilt from `server/data` anyway, so it is dropped and
-- recreated; `needsSeed()` triggers a re-seed right after this migration.
DROP TABLE `celestial_bodies`;
--> statement-breakpoint
CREATE TABLE `celestial_bodies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parentId` integer,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`meanRadius` integer NOT NULL,
	`massValue` real,
	`massExponent` integer,
	`volumeValue` real,
	`volumeExponent` integer,
	`density` real NOT NULL,
	`gravity` real NOT NULL,
	`averageTemperature` integer NOT NULL,
	`sideralOrbit` real NOT NULL,
	`sideralRotation` real NOT NULL,
	`semimajorAxis` real DEFAULT 0 NOT NULL,
	`alternativeName` text,
	`imageUrl` text,
	`wikipedia` text,
	FOREIGN KEY (`parentId`) REFERENCES `celestial_bodies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `celestial_bodies_slug_unique` ON `celestial_bodies` (`slug`);
