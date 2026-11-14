import type { CelestialBodyImage } from '~~/shared/types/api'
import { PAGINATION_QUERY_SCHEMA } from '~~/server/utils/schemas'
import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'
import { fetchNasaImages } from '~~/server/services/nasa'
import { mapNasaImagesToCelestialBodyImages } from '~~/server/mappers/nasa-images-to-celestial-body-images'

export default defineCachedEventHandler(async (event): Promise<PaginatedApiResult<CelestialBodyImage>> => {
  const slug = getRouterParam(event, 'slug')
  const { page, pageSize } = await getValidatedQuery(event, PAGINATION_QUERY_SCHEMA.parse)

  const [body] = await db
    .select({ name: celestialBodies.name })
    .from(celestialBodies)
    .where(eq(celestialBodies.slug, slug!))
    .limit(1)

  if (!body?.name) {
    return {
      data: [],
      total: 0
    }
  }

  const nasaImages = await fetchNasaImages(body.name, page, pageSize)
  return {
    data: mapNasaImagesToCelestialBodyImages(nasaImages),
    total: nasaImages.collection.metadata.total_hits
  }
})
