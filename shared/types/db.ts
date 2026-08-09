import type { celestialBodies } from './../../server/db/schema'

export type CelestialBody = typeof celestialBodies.$inferSelect
export type NewCelestialBody = typeof celestialBodies.$inferInsert

export type CelestialBodyType = CelestialBody['type']
