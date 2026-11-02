import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'
import { fetchNasaImages } from '~~/server/services/nasa'

export default defineCachedEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const [body] = await db
    .select({ name: celestialBodies.name })
    .from(celestialBodies)
    .where(eq(celestialBodies.id, id))
    .limit(1)

  return body?.name ? fetchNasaImages(body.name) : null
})
