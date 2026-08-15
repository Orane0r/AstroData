import { asc, count, inArray } from 'drizzle-orm'

import { CELESTIAL_BODY_TYPES } from '~~/shared/constants/db'
import type { PaginatedApiResult } from '~~/shared/types/api'
import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'
import { transformIntoArray } from '~~/server/utils/transform'
import z from 'zod'

const querySchema = z.object({
  types: z.preprocess(
    val => transformIntoArray(val),
    z.array(z.enum(CELESTIAL_BODY_TYPES)).optional()
  ),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
})

export default defineEventHandler(async (event): Promise<PaginatedApiResult<CelestialBody>> => {
  const { page, pageSize, types } = await getValidatedQuery(event, querySchema.parse)

  const whereClause = types ? inArray(celestialBodies.type, types) : undefined

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(celestialBodies)
      .where(whereClause)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(asc(celestialBodies.name)),
    db.select({ total: count() }).from(celestialBodies).where(whereClause)
  ])

  const total = totalResult[0]?.total ?? 0

  return { data, total }
})
