import type { NasaGallery } from '../types/nasa-gallery'

export async function fetchNasaImages(text: string): Promise<NasaGallery> {
  const params = new URLSearchParams({
    q: text,
    media_type: 'image'
  })

  const response = await fetch(`https://images-api.nasa.gov/search?${params}`)

  return await response.json() as NasaGallery
}
