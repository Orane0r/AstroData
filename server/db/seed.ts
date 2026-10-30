import type { SolarSystem, SolarSystemBodyData } from '../types/solar-system'
import { db, schema } from '@nuxthub/db'

import type { WikipediaLink } from '../types/wikipedia-link'
import _ from 'lodash'
import { consola } from 'consola'
import fs from 'node:fs'
import { mapSolarSystemBodiesApiToDb } from '../mappers/solar-system-to-db'

// TODO logger le temps de synchro
export async function seedDatabase() {
  consola.start('Seeding database...')

  const solarSystem = JSON.parse(
    fs.readFileSync('./server/data/solar_system.json', 'utf-8')
  ) as SolarSystem
  const wikiUrls = JSON.parse(
    fs.readFileSync('./server/data/wikipedia.json', 'utf-8')
  ) as WikipediaLink[]
  const [bodiesWithoutParent, bodiesWithParent] = _.partition(solarSystem.bodies, body => body.aroundPlanet == null)

  const cachedIds: { idDb: number, idApi: string }[] = []

  await db.transaction(async (tx) => {
    await tx.delete(schema.celestialBodies)

    for (const body of bodiesWithoutParent) {
      const result = await tx
        .insert(schema.celestialBodies)
        .values(await mapSolarSystemBodiesApiToDb(body, null, await findWikiUrl(wikiUrls, body)))

      const id = Number(result.lastInsertRowid)

      cachedIds.push({ idDb: id, idApi: body.id })
    }

    for (const body of bodiesWithParent) {
      const parentId = _.find(cachedIds, cachedId => body.aroundPlanet?.planet == cachedId.idApi)?.idDb ?? null

      await tx
        .insert(schema.celestialBodies)
        .values(await mapSolarSystemBodiesApiToDb(body, parentId, await findWikiUrl(wikiUrls, body)))
    }
  })

  consola.success('Database seeded successfully.')
}

async function findWikiUrl(wikiImages: WikipediaLink[], body: SolarSystemBodyData): Promise<string | null> {
  return wikiImages.find(img => img.name == body.englishName)?.url ?? null
}
