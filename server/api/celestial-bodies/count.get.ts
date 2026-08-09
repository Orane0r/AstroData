import { CELESTIAL_BODY_TYPES, celestialBodies } from '~~/server/db/schema'
import { count, inArray } from 'drizzle-orm'

import type { CelestialBodyType } from '~~/shared/types/db'
import type { H3Event } from 'h3'
import { db } from 'hub:db'
import { z } from 'zod'

const querySchema = z.object({
  type: z
    .union([
      z.enum(CELESTIAL_BODY_TYPES),
      z.array(z.enum(CELESTIAL_BODY_TYPES))
    ])
    .optional()
    .transform((val) => {
      if (!val) return undefined
      return Array.isArray(val) ? val : [val]
    })
})

export default defineEventHandler(
  async (event: H3Event): Promise<Record<CelestialBodyType, number>> => {
    const { type } = await getValidatedQuery(event, querySchema.parse)

    const query = db
      .select({
        type: celestialBodies.type,
        count: count()
      })
      .from(celestialBodies)
      .groupBy(celestialBodies.type)

    const results = type?.length
      ? await query.where(inArray(celestialBodies.type, type))
      : await query

    return Object.fromEntries(
      results.map(row => [row.type, row.count])
    ) as Record<CelestialBodyType, number>
  }
)
