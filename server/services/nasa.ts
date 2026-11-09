import type { Item, NasaGallery } from '../types/nasa-gallery'

export async function fetchNasaImages(text: string, page: number, pageSize: number): Promise<NasaGallery> {
  const params = new URLSearchParams({
    keywords: text,
    media_type: 'image',
    page: String(page),
    page_size: String(pageSize)
  })

  const response = await fetch(`https://images-api.nasa.gov/search?${params}`)
  const gallery = await response.json() as NasaGallery

  return {
    ...gallery,
    collection: {
      ...gallery.collection,
      items: dedupeItemsByNasaId(gallery.collection.items)
    }
  }
}

/**
 * The NASA images API can return the same asset several times (same `nasa_id`).
 * Keep only the first occurrence of each asset.
 * @param items Raw search result items.
 * @returns Items with unique NASA ids.
 */
function dedupeItemsByNasaId(items: Item[]): Item[] {
  const seen = new Set<string>()

  return items.filter((item) => {
    const nasaId = item.data[0]?.nasa_id
    if (!nasaId) {
      return true
    }
    if (seen.has(nasaId)) {
      return false
    }
    seen.add(nasaId)
    return true
  })
}
