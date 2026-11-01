import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const [body] = await db
    .select()
    .from(celestialBodies)
    .where(eq(celestialBodies.id, id))
    .limit(1)

  if (!body) {
    throw createError({
      status: 404,
      statusText: `Celestial body with id ${id} not found.`
    })
  }

  return body
})
