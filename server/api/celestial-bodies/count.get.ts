import { count, inArray } from 'drizzle-orm'

import { CELESTIAL_BODY_TYPES } from '~~/shared/constants/db'
import type { CelestialBodyType } from '~~/shared/types/db'
import type { H3Event } from 'h3'
import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'
import { transformIntoArray } from '~~/server/utils/transform'
import { z } from 'zod'

const querySchema = z.object({
  types: z.preprocess(
    val => transformIntoArray(val),
    z.array(z.enum(CELESTIAL_BODY_TYPES)).optional()
  )
})

export default defineEventHandler(
  async (event: H3Event): Promise<Record<CelestialBodyType, number>> => {
    const { types } = await getValidatedQuery(event, querySchema.parse)

    const query = db
      .select({
        type: celestialBodies.type,
        count: count()
      })
      .from(celestialBodies)
      .groupBy(celestialBodies.type)

    const results = types?.length
      ? await query.where(inArray(celestialBodies.type, types))
      : await query

    return Object.fromEntries(
      results.map(row => [row.type, row.count])
    ) as Record<CelestialBodyType, number>
  }
)
