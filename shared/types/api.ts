import type { ScientificNotation } from './math'

export type PaginatedApiResult<T> = {
  data: T[]
  total: number
}

export type CelestialBodyAverages = {
  count: number
  data: {
    mass: ScientificNotation | null
    meanRadius: number | null
    gravity: number | null
    averageTemperature: number | null
    moons: number | null
  }
}
