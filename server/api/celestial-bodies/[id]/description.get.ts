import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'
import { fetchWikipediaDescription } from '~~/server/services/wikipedia'
import { z } from 'zod'

const querySchema = z.object({
  lang: z.string().regex(/^[a-z]{2,3}$/)
})

export default defineCachedEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const { lang } = await getValidatedQuery(event, querySchema.parse)

  const [body] = await db
    .select({ wikipedia: celestialBodies.wikipedia })
    .from(celestialBodies)
    .where(eq(celestialBodies.id, id))
    .limit(1)

  return body?.wikipedia ? fetchWikipediaDescription(body.wikipedia, lang) : null
})
