import { asc, count } from 'drizzle-orm'

import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'
import z from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
})

export default defineEventHandler(async (event): Promise<{ data: CelestialBody[], total: number }> => {
  const { page, pageSize } = await getValidatedQuery(event, querySchema.parse)

  const [data, totalResult] = await Promise.all([
    db
      .select()
      .from(celestialBodies)
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(asc(celestialBodies.name)),
    db.select({ total: count() }).from(celestialBodies)
  ])

  const total = totalResult[0]?.total ?? 0

  return { data, total }
})
