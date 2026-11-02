import type { NasaGallery } from '../types/nasa-gallery'

export async function fetchNasaImages(text: string, page: number, pageSize: number): Promise<NasaGallery> {
  const params = new URLSearchParams({
    q: text,
    media_type: 'image',
    page: String(page),
    page_size: String(pageSize)
  })

  const response = await fetch(`https://images-api.nasa.gov/search?${params}`)

  return await response.json() as NasaGallery
}
