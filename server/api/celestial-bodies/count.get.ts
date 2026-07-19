import { celestialBodies } from '~~/server/db/schema'
import { count } from 'drizzle-orm'
import { db } from 'hub:db'

export default defineEventHandler<Promise<number>>(async () => {
  const [result] = await db
    .select({ count: count() })
    .from(celestialBodies)

  return result?.count ?? 0
})
