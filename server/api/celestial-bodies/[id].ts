import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'

export default defineEventHandler((event): Promise<CelestialBody> => {
  const id = Number.parseInt(event.context?.params?.id ?? '') as number

  if (!Number.isInteger(id)) {
    throw createError({
      status: 400,
      statusText: `${event.context?.params?.id} is not a valid id.`
    })
  }

  return db
    .select()
    .from(celestialBodies)
    .where(eq(celestialBodies.id, id))
    .then((result) => {
      if (result.length === 0) {
        throw createError({
          status: 404,
          statusText: `Celestial body with id ${id} not found.`
        })
      }

      return result[0]!
    })
})
