import { celestialBodies } from 'hub:db:schema'
import { isSlug } from '~~/shared/utils/string'
import { eq } from 'drizzle-orm'
import z from 'zod'

const slugParamSchema = z.object({
  slug: z.string().refine(isSlug, 'Not a canonical slug.')
})

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname
  const match = /^\/api\/celestial-bodies\/([^/]+)(?:\/(?:moons|description|images))?\/?$/.exec(pathname)

  if (!match?.[1]) {
    return
  }

  const rawSlug = match[1]
  if (['averages', 'count', 'types'].includes(rawSlug) && !pathname.endsWith('/moons')) {
    return
  }

  const parsed = slugParamSchema.safeParse({ slug: rawSlug })

  if (!parsed.success) {
    throw createError({
      status: 400,
      statusText: `${rawSlug} is not a valid slug.`
    })
  }

  const { slug } = parsed.data
  const [body] = await db
    .select()
    .from(celestialBodies)
    .where(eq(celestialBodies.slug, slug))
    .limit(1)

  if (!body) {
    throw createError({
      status: 404,
      statusText: `Celestial body with slug ${slug} not found.`
    })
  }
})
