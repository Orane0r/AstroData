import { BodyType, type SolarSystemBodyData } from '../types/solar-system'
import type { CelestialBodyType, NewCelestialBody } from '~~/shared/types/db'
import { removeNumberPrefix, slugify } from '~~/shared/utils/string'
import { fetchWikipediaImageUrl } from '../services/wikipedia'

const BODY_TYPE_MAP: Record<BodyType, CelestialBodyType> = {
  [BodyType.Planet]: 'Planet',
  [BodyType.Moon]: 'Moon',
  [BodyType.DwarfPlanet]: 'Dwarf planet',
  [BodyType.Asteroid]: 'Asteroid',
  [BodyType.Comet]: 'Comet',
  [BodyType.Star]: 'Star'
}

/**
 * Turns dataset data into clean data ready to be inserted in database.
 * @param body Base data.
 * @param parentId Id of the parent's body.
 * @param wikiUrl Wikipedia URL.
 * @param slug Public slug, see {@link buildSlugMap}.
 * @returns Cleaned and mapped data.
 */
export async function mapSolarSystemBodiesApiToDb(body: SolarSystemBodyData, parentId: number | null, wikiUrl: string | null, slug: string): Promise<NewCelestialBody> {
  const safeNumber = (value: unknown, defaultValue: number = 0): number => {
    const num = Number(value)
    return Number.isNaN(num) ? defaultValue : num
  }

  let imageUrl = null
  if (wikiUrl) {
    imageUrl = await fetchWikipediaImageUrl(wikiUrl)
  }

  return {
    parentId: parentId,
    name: removeNumberPrefix(body.englishName || '') || removeNumberPrefix(body.name || '') || body.id,
    slug: slug,
    type: BODY_TYPE_MAP[body.bodyType],
    meanRadius: safeNumber(body.meanRadius),
    massValue: body.mass?.massValue ?? null,
    massExponent: body.mass?.massExponent ?? null,
    volumeValue: body.vol?.volValue ?? null,
    volumeExponent: body.vol?.volExponent ?? null,
    density: safeNumber(body.density),
    gravity: safeNumber(body.gravity),
    averageTemperature: safeNumber(body.avgTemp),
    sideralOrbit: safeNumber(body.sideralOrbit),
    sideralRotation: safeNumber(body.sideralRotation),
    semimajorAxis: safeNumber(body.semimajorAxis),
    alternativeName: body.alternativeName || null,
    imageUrl: imageUrl,
    wikipedia: wikiUrl
  }
}

/**
 * Builds the public slug of every body, used as the URL identifier.
 * Uses the slugified English name, falling back to the dataset id when the name
 * is missing, and appends the body type only when two bodies would collide
 * ("Metis" the moon → "metis-moon", "(9) Metis" the asteroid → "metis-asteroid").
 * @param bodies Bodies from the dataset.
 * @returns Map of dataset id to slug.
 */
export function buildSlugMap(bodies: SolarSystemBodyData[]): Map<string, string> {
  const candidates = bodies.map(body => ({
    id: body.id,
    type: slugify(BODY_TYPE_MAP[body.bodyType] ?? body.bodyType),
    base: slugify(removeNumberPrefix(body.englishName)) || body.id
  }))

  const occurrences = new Map<string, number>()
  for (const { base } of candidates) {
    occurrences.set(base, (occurrences.get(base) ?? 0) + 1)
  }

  const used = new Set<string>()
  const slugs = new Map<string, string>()

  for (const { id, type, base } of candidates) {
    let slug = (occurrences.get(base) ?? 0) > 1 ? `${base}-${type}` : base
    let suffix = 2
    while (used.has(slug)) {
      slug = `${base}-${type}-${suffix}`
      suffix += 1
    }
    used.add(slug)
    slugs.set(id, slug)
  }

  return slugs
}
