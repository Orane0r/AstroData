import { db, schema } from '@nuxthub/db'

import { count } from 'drizzle-orm'
import { seedDatabase } from '~~/server/db/seed'

/**
 * Seeds the database with data if empty.
 * File is named with a `z-` to be executed last (after the migrations).
 */
export default defineNitroPlugin(async () => {
  const result = await db
    .select({ total: count() })
    .from(schema.celestialBodies)

  if ((result[0]?.total ?? 0) === 0) {
    await seedDatabase()
  }
})
