import { celestialBodies } from './../../db/schema'
import { count } from 'drizzle-orm'
import { db } from 'hub:db'

export default defineEventHandler(async () => {
  const [result] = await db
    .select({ count: count() })
    .from(celestialBodies)

  return result
})
