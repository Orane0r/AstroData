import type { SolarSystem, SolarSystemBodyData } from '../types/solar-system'
import { buildSlugMap, mapSolarSystemBodiesApiToDb } from '../mappers/solar-system-to-db'
import { count, eq, sql } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'

import type { WikipediaLink } from '../types/wikipedia-link'
import { consola } from 'consola'
import { partition } from 'lodash'
import solarSystemData from '../data/solar_system.json'
import wikipediaData from '../data/wikipedia.json'

/**
 * Bump this value when `server/data/*.json` changes without a migration,
 * to force a re-seed on the next startup.
 */
export const SEED_DATA_VERSION = 2

type SeedOptions = {
  onProgress?: (done: number, total: number) => void
}

/**
 * Seeds the database from the JSON datasets.
 * Also stores the migration and seed versions it ran with, so the next
 * migration can trigger a re-seed.
 */
export async function seedDatabase({ onProgress }: SeedOptions = {}) {
  consola.start('Seeding database...')

  const solarSystem = solarSystemData as SolarSystem
  const wikiUrls = wikipediaData as WikipediaLink[]
  const slugByApiId = buildSlugMap(solarSystem.bodies)
  const [bodiesWithoutParent, bodiesWithParent] = partition(solarSystem.bodies, body => body.aroundPlanet == null)
  const lastMigration = await getLatestAppliedMigration()
  const total = solarSystem.bodies.length
  let done = 0

  const advance = () => {
    done += 1
    onProgress?.(done, total)
  }

  const cachedIds: { idDb: number, idApi: string }[] = []

  await db.transaction(async (tx) => {
    await tx.delete(schema.celestialBodies)

    await Array.fromAsync(bodiesWithoutParent, async (body) => {
      const result = await tx
        .insert(schema.celestialBodies)
        .values(await mapSolarSystemBodiesApiToDb(body, null, findWikiUrl(wikiUrls, body), slugByApiId.get(body.id)!))

      cachedIds.push({ idDb: Number(result.lastInsertRowid), idApi: body.id })
      advance()
    })

    await Array.fromAsync(bodiesWithParent, async (body) => {
      const parentId = cachedIds.find(cachedId => body.aroundPlanet?.planet
        == cachedId.idApi)?.idDb ?? null

      await tx
        .insert(schema.celestialBodies)
        .values(await mapSolarSystemBodiesApiToDb(body, parentId, findWikiUrl(wikiUrls, body), slugByApiId.get(body.id)!))
      advance()
    })

    await tx
      .insert(schema.seedState)
      .values({
        id: 1,
        lastMigration: lastMigration ?? 'none',
        seedVersion: SEED_DATA_VERSION,
        seededAt: Date.now()
      })
      .onConflictDoUpdate({
        target: schema.seedState.id,
        set: {
          lastMigration: lastMigration ?? 'none',
          seedVersion: SEED_DATA_VERSION,
          seededAt: Date.now()
        }
      })
  })

  onProgress?.(total, total)
  consola.success('Database seeded successfully.')
}

/**
 * Whether the database must be seeded again: empty table, no seed marker yet,
 * new migration applied, or seed data version bumped.
 */
export async function needsSeed(): Promise<boolean> {
  const [bodyCount] = await db
    .select({ total: count() })
    .from(schema.celestialBodies)

  if ((bodyCount?.total ?? 0) === 0) {
    return true
  }

  const [marker] = await db
    .select()
    .from(schema.seedState)
    .where(eq(schema.seedState.id, 1))
    .limit(1)

  if (!marker) {
    return true
  }

  const lastMigration = await getLatestAppliedMigration()

  return marker.lastMigration !== (lastMigration ?? 'none')
    || marker.seedVersion !== SEED_DATA_VERSION
}

/**
 * Latest migration applied by NuxtHub (`_hub_migrations` is managed by the module).
 */
export async function getLatestAppliedMigration(): Promise<string | null> {
  const row = await db.get<{ name: string }>(
    sql`select name from _hub_migrations order by id desc limit 1`
  )

  return row?.name ?? null
}

function findWikiUrl(wikiImages: WikipediaLink[], body: SolarSystemBodyData): string | null {
  return wikiImages.find(img => img.name == body.englishName)?.url ?? null
}
