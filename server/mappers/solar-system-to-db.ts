import { BodyType, type SolarSystemBodyData } from '../types/solar-system'
import type { NewCelestialBody } from '../../shared/types/db'

const BODY_TYPE_MAP: Record<BodyType, NewCelestialBody['type']> = {
  [BodyType.Planet]: 'Planet',
  [BodyType.Moon]: 'Moon',
  [BodyType.DwarfPlanet]: 'Dwarf planet',
  [BodyType.Asteroid]: 'Asteroid',
  [BodyType.Comet]: 'Comet',
  [BodyType.Star]: 'Star'
}

export function mapSolarSystemBodiesApiToDb(body: SolarSystemBodyData, parentId: number | null, imageUrl: string | null): NewCelestialBody {
  const safeNumber = (value: unknown, defaultValue: number = 0): number => {
    const num = Number(value)
    return Number.isNaN(num) ? defaultValue : num
  }

  return {
    parentId: parentId,
    name: body.englishName,
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
    imageUrl: imageUrl
  }
}
