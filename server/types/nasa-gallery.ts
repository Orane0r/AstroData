export interface NasaGallery {
  collection: Collection
}

export interface Collection {
  version: string
  href: string
  items: Item[]
  metadata: Metadata
  links: CollectionLink[]
}

export interface Item {
  href: string
  data: Datum[]
  links: ItemLink[]
}

export interface Datum {
  center: string
  date_created: Date
  description: string
  keywords: string[]
  location?: string
  media_type: MediaType
  nasa_id: string
  photographer?: string
  title: string
  album?: string[]
}

export type MediaType = 'image' | 'video' | 'audio'

export interface ItemLink {
  href: string
  rel: Rel
  render?: MediaType
  width?: number
  size?: number
  height?: number
}

export type Rel = 'alternate' | 'preview' | 'captions' | 'canonical'

export interface CollectionLink {
  rel: string
  prompt: string
  href: string
}

export interface Metadata {
  total_hits: number
}
