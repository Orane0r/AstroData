import type { WikipediaPageSummaryApi } from '../types/wikipedia-page-summary'

const FALLBACK_LANG = 'en'
const HEADERS = {
  'User-Agent': 'AstroData/1.0 (personal project; contact: orane.orveillon@outlook.fr)'
}

function getPageTitle(url: string): string {
  const pattern = '/wiki/'
  return url.substring(url.indexOf(pattern) + pattern.length, url.length)
}

async function fetchSummary(lang: string, title: string): Promise<WikipediaPageSummaryApi | null> {
  const response = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`, {
    headers: HEADERS
  })

  return response.ok ? await response.json() as WikipediaPageSummaryApi : null
}

// The stored URLs are English pages: the title in another language comes from the page's interlanguage links.
async function fetchLocalizedTitle(title: string, lang: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    prop: 'langlinks',
    lllang: lang,
    titles: decodeURIComponent(title),
    redirects: '1',
    format: 'json',
    formatversion: '2'
  })
  const response = await fetch(`https://${FALLBACK_LANG}.wikipedia.org/w/api.php?${params}`, {
    headers: HEADERS
  })

  if (!response.ok) {
    return null
  }

  const json = await response.json() as { query?: { pages?: { langlinks?: { title: string }[] }[] } }
  return json.query?.pages?.[0]?.langlinks?.[0]?.title ?? null
}

export async function fetchWikipediaImageUrl(
  url: string
): Promise<string | null> {
  const json = await fetchSummary(FALLBACK_LANG, getPageTitle(url))

  return json?.originalimage?.source ?? null
}

/**
 * Wikipedia summary of a page, in `lang` or in English when the page doesn't exist in that language.
 * @param url English Wikipedia URL of the page.
 * @param lang Wanted language (ISO 639-1 code).
 */
// TODO créer une interface pour le retour et typer le retour de l'api qui appelle cette fonction
export async function fetchWikipediaDescription(
  url: string,
  lang: string
): Promise<{ lang: string, extract: string } | null> {
  const title = getPageTitle(url)

  if (lang !== FALLBACK_LANG) {
    const localizedTitle = await fetchLocalizedTitle(title, lang)
    const summary = localizedTitle
      ? await fetchSummary(lang, encodeURIComponent(localizedTitle.replaceAll(' ', '_')))
      : null

    if (summary?.extract) {
      return { lang, extract: summary.extract }
    }
  }

  const summary = await fetchSummary(FALLBACK_LANG, title)
  return summary?.extract ? { lang: FALLBACK_LANG, extract: summary.extract } : null
}
