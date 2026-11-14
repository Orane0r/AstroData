import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event): Promise<CelestialBody> => {
  const slug = getRouterParam(event, 'slug')
  const [body] = await db
    .select()
    .from(celestialBodies)
    .where(eq(celestialBodies.slug, slug!))
    .limit(1)

  if (!body) {
    throw createError({
      status: 404,
      statusText: `Celestial body with slug ${slug} not found.`
    })
  }

  return body
})
