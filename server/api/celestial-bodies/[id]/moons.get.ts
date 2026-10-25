import { and, eq } from 'drizzle-orm'

import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  return db
    .select()
    .from(celestialBodies)
    .where(and(
      eq(celestialBodies.parentId, id),
      eq(celestialBodies.type, 'Moon')
    ))
})
