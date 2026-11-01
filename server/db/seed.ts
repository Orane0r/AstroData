// TODO détecter si une migration a été faite / est en cours au lancement, re-seed s'il y en a une

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

    await Array.fromAsync(bodiesWithoutParent, async (body) => {
      const result = await tx
        .insert(schema.celestialBodies)
        .values(await mapSolarSystemBodiesApiToDb(body, null, findWikiUrl(wikiUrls, body)))

      cachedIds.push({ idDb: Number(result.lastInsertRowid), idApi: body.id })
    })

    await Array.fromAsync(bodiesWithParent, async (body) => {
      const parentId = cachedIds.find(cachedId => body.aroundPlanet?.planet
        == cachedId.idApi)?.idDb ?? null

      await tx
        .insert(schema.celestialBodies)
        .values(await mapSolarSystemBodiesApiToDb(body, parentId, findWikiUrl(wikiUrls, body)))
    })
  })

  consola.success('Database seeded successfully.')
}

function findWikiUrl(wikiImages: WikipediaLink[], body: SolarSystemBodyData): string | null {
  return wikiImages.find(img => img.name == body.englishName)?.url ?? null
}
