import type { SolarSystem, SolarSystemBodyData } from '../types/solar-system'
import { db, schema } from '@nuxthub/db'

import type { BodyImage } from '../types/body_image'
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
  const wikiImages = JSON.parse(
    fs.readFileSync('./server/data/wikipedia_images.json', 'utf-8')
  ) as BodyImage[]
  const [bodiesWithoutParent, bodiesWithParent] = _.partition(solarSystem.bodies, body => body.aroundPlanet == null)

  const cachedIds: { idDb: number, idApi: string }[] = []

  await db.transaction(async (tx) => {
    await tx.delete(schema.celestialBodies)

    for (const body of bodiesWithoutParent) {
      const result = await tx
        .insert(schema.celestialBodies)
        .values(mapSolarSystemBodiesApiToDb(body, null, findImageFromBody(wikiImages, body)))

      const id = Number(result.lastInsertRowid)

      cachedIds.push({ idDb: id, idApi: body.id })
    }

    for (const body of bodiesWithParent) {
      const parentId = _.find(cachedIds, cachedId => body.aroundPlanet?.planet == cachedId.idApi)?.idDb ?? null

      await tx
        .insert(schema.celestialBodies)
        .values(mapSolarSystemBodiesApiToDb(body, parentId, findImageFromBody(wikiImages, body)))
    }
  })

  consola.success('Database seeded successfully.')
}

function findImageFromBody(wikiImages: BodyImage[], body: SolarSystemBodyData): string | null {
  return wikiImages.find(img => img.name == body.englishName)?.url ?? null
}
