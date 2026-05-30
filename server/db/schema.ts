/**
 * Generate migrations : npx nuxt db generate
 * Apply migrations : npx nuxt db migrate
 */

import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

export const celestialBodies = sqliteTable('celestial_bodies', {
  id: int().primaryKey({ autoIncrement: true }),
  parentId: int().references(
    (): AnySQLiteColumn => celestialBodies.id
  ),
  name: text().notNull(),
  type: text({
    enum: ['Planet', 'Moon', 'Star', 'Asteroid', 'Comet', 'Dwarf planet']
  }).notNull(),
  // km
  meanRadius: int().notNull(),
  // kg
  massValue: real(),
  massExponent: int(),
  // km**3
  volumeValue: real(),
  volumeExponent: int(),
  // m/s**-2
  density: real().notNull(),
  gravity: real().notNull(),
  // K
  averageTemperature: int().notNull(),
  // days
  sideralOrbit: real().notNull(),
  // hours
  sideralRotation: real().notNull(),
  // km
  semimajorAxis: real().notNull().default(0),
  alternativeName: text(),
  discoveryYear: int(),
  imageUrl: text()
})

export const celestialBodiesRelations = relations(celestialBodies, ({ one, many }) => ({
  parent: one(celestialBodies, {
    fields: [celestialBodies.parentId],
    references: [celestialBodies.id],
    relationName: 'parent'
  }),

  children: many(celestialBodies, {
    relationName: 'parent'
  })
}))
