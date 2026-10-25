import { celestialBodies } from 'hub:db:schema'
import { eq } from 'drizzle-orm'
import z from 'zod'

const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
})

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname
  const match = /^\/api\/celestial-bodies\/([^/]+)(?:\/moons)?\/?$/.exec(pathname)

  if (!match?.[1]) {
    return
  }

  const rawId = match[1]
  if (['averages', 'count', 'types'].includes(rawId) && !pathname.endsWith('/moons')) {
    return
  }

  const parsed = idParamSchema.safeParse({ id: rawId })

  if (!parsed.success) {
    throw createError({
      status: 400,
      statusText: `${rawId} is not a valid id.`
    })
  }

  const { id } = parsed.data
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
})
