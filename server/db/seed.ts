import { db, schema } from '@nuxthub/db'

import type { SolarSystem } from './../types/solar-system'
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
  const [bodiesWithoutParent, bodiesWithParent] = _.partition(solarSystem.bodies, body => body.aroundPlanet == null)

  const cachedIds: { idDb: number, idApi: string }[] = []

  await db.transaction(async (tx) => {
    await tx.delete(schema.celestialBodies)

    for (const body of bodiesWithoutParent) {
      const result = await tx
        .insert(schema.celestialBodies)
        .values(mapSolarSystemBodiesApiToDb(body, null, null))

      const id = Number(result.lastInsertRowid)

      cachedIds.push({ idDb: id, idApi: body.id })
    }

    for (const body of bodiesWithParent) {
      const parentId = _.find(cachedIds, cachedId => body.aroundPlanet?.planet == cachedId.idApi)?.idDb ?? null

      await tx
        .insert(schema.celestialBodies)
        .values(mapSolarSystemBodiesApiToDb(body, parentId, null))
    }
  })

  consola.success('Database seeded successfully.')
}
