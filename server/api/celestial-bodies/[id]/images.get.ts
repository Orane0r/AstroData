import type { CelestialBodyImage } from '~~/shared/types/api'
import { celestialBodies } from 'hub:db:schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'
import { fetchNasaImages } from '~~/server/services/nasa'
import { mapNasaImagesToCelestialBodyImages } from '~~/server/mappers/nasa-images-to-celestial-body-images'
import z from 'zod'

// TODO créer un schéma à part pour ça car réutilisé dans index.get.ts
const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
})

export default defineCachedEventHandler(async (event): Promise<PaginatedApiResult<CelestialBodyImage>> => {
  const id = Number(getRouterParam(event, 'id'))
  const { page, pageSize } = await getValidatedQuery(event, querySchema.parse)

  const [body] = await db
    .select({ name: celestialBodies.name })
    .from(celestialBodies)
    .where(eq(celestialBodies.id, id))
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
