import { asc } from 'drizzle-orm'
import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'

export default defineEventHandler(async () => {
  return await db
    .select()
    .from(celestialBodies)
    .orderBy(asc(celestialBodies.name))
})
