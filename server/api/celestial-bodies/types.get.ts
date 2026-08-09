import type { CelestialBodyType } from '~~/shared/types/db'
import { asc } from 'drizzle-orm'
import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'

export default defineEventHandler<Promise<CelestialBodyType[]>>(async () => {
  const types = await db
    .selectDistinct({ type: celestialBodies.type })
    .from(celestialBodies)
    .orderBy(asc(celestialBodies.name))

  return types.map(t => t.type)
})
