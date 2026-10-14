import { and, eq } from 'drizzle-orm'

import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id')
  const id = Number.parseInt(rawId ?? '', 10)

  // TODO faire des utils pour gérer toutes les erreurs et les réutiliser partout
  if (!Number.isInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: `${rawId} is not a valid id.`
    })
  }

  // Vérifie que le corps céleste existe.
  const [parent] = await db
    .select({ id: celestialBodies.id })
    .from(celestialBodies)
    .where(eq(celestialBodies.id, id))
    .limit(1)

  if (!parent) {
    throw createError({
      statusCode: 404,
      statusMessage: `Celestial body with id ${id} not found.`
    })
  }

  // Récupère ses lunes.
  const moons = await db
    .select()
    .from(celestialBodies)
    .where(
      and(
        eq(celestialBodies.parentId, id),
        eq(celestialBodies.type, 'Moon')
      )
    )

  return moons
})
