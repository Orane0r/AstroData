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

export type CelestialBodyImage = {
  title: string
  description: string
  date: Date
  thumbnail: Image
  fullsize: Image
}

type Image = {
  url: string
  height: number
  width: number
}
