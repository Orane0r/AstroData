import type { CelestialBodyImage } from '~~/shared/types/api'
import type { Item, NasaGallery } from '../types/nasa-gallery'

/**
 * Turns a NASA image search result into clean data ready to be displayed.
 * @param nasaImages Raw NASA images API response.
 * @returns Cleaned and mapped data.
 */
export function mapNasaImagesToCelestialBodyImages(nasaImages: NasaGallery): CelestialBodyImage[] {
  return nasaImages.collection.items
    .map(mapItem)
    .filter((image): image is CelestialBodyImage => image !== null)
}

function mapItem(item: Item): CelestialBodyImage | null {
  const [datum] = item.data
  const preview = item.links.find(link => link.rel === 'preview')
  const canonical = item.links.find(link => link.rel === 'canonical')

  if (!datum || !preview || !canonical) {
    return null
  }

  return {
    title: datum.title,
    description: datum.description,
    date: datum.date_created,
    thumbnail: {
      url: preview.href,
      width: preview.width ?? 0,
      height: preview.height ?? 0
    },
    fullsize: {
      url: canonical.href,
      width: canonical.width ?? 0,
      height: canonical.height ?? 0
    }
  }
}
