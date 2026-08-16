import type { CelestialBodyType } from '~~/shared/types/db'
import { SQL_ORDER_BODY_TYPE } from '~~/server/utils/sql'
import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'

export default defineEventHandler<Promise<CelestialBodyType[]>>(async () => {
  const types = await db
    .selectDistinct({ type: celestialBodies.type })
    .from(celestialBodies)
    .orderBy(SQL_ORDER_BODY_TYPE)

  return types.map(t => t.type)
})
