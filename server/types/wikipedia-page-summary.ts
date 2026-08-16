export type WikipediaPageSummaryApi = {
  type: string
  title: string
  displaytitle: string
  namespace: Namespace
  wikibase_item: string
  titles: Titles
  pageid: number
  thumbnail?: Image
  originalimage?: Image
  lang: string
  dir: string
  revision: string
  tid: string
  timestamp: Date
  description: string
  description_source: string
  content_urls: ContentUrls
  extract: string
  extract_html: string
}

export type ContentUrls = {
  desktop: Desktop
  mobile: Desktop
}

export type Desktop = {
  page: string
  revisions: string
  edit: string
  talk: string
}

export type Namespace = {
  id: number
  text: string
}

export type Image = {
  source: string
  width: number
  height: number
}

export type Titles = {
  canonical: string
  normalized: string
  display: string
}
