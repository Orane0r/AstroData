import { and, eq } from 'drizzle-orm'

import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'

export default defineEventHandler(async (event): Promise<CelestialBody[]> => {
  const slug = getRouterParam(event, 'slug')
  const [parent] = await db
    .select({ id: celestialBodies.id })
    .from(celestialBodies)
    .where(eq(celestialBodies.slug, slug!))
    .limit(1)

  if (!parent) {
    throw createError({
      status: 404,
      statusText: `Celestial body with slug ${slug} not found.`
    })
  }

  return db
    .select()
    .from(celestialBodies)
    .where(and(
      eq(celestialBodies.parentId, parent.id),
      eq(celestialBodies.type, 'Moon')
    ))
})
