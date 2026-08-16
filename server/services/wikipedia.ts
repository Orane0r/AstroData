import type { WikipediaPageSummaryApi } from '../types/wikipedia-page-summary'

const BASE_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary'

export async function fetchWikipediaImageUrl(
  url: string
): Promise<string | null> {
  const pattern = '/wiki/'
  const query: string = url.substring(url.indexOf(pattern) + pattern.length, url.length)

  const response = await fetch(`${BASE_URL}/${query}`, {
    headers: {
      'User-Agent': 'AstroData/1.0 (personal project; contact: orane.orveillon@outlook.fr)'
    }
  })

  const json = await response.json() as WikipediaPageSummaryApi

  if (json.originalimage?.source) {
    return json.originalimage.source
  }
  return null
}
