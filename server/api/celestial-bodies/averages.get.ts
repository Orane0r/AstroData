import { and, count, eq, isNotNull } from 'drizzle-orm'
import { scientificToValue, valueToScientific } from '~~/shared/utils/conversion'

import { CELESTIAL_BODY_TYPES } from '~~/shared/constants/db'
import type { CelestialBodyAverages } from '~~/shared/types/api'
import type { H3Event } from 'h3'
import { celestialBodies } from '~~/server/db/schema'
import { db } from 'hub:db'
import { z } from 'zod'

const querySchema = z.object({
  type: z.enum(CELESTIAL_BODY_TYPES)
})

function average(values: number[]): number | null {
  if (values.length === 0) return null
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export default defineEventHandler(async (event: H3Event): Promise<CelestialBodyAverages> => {
  const { type } = await getValidatedQuery(event, querySchema.parse)

  const [bodies, moonCounts] = await Promise.all([
    db
      .select()
      .from(celestialBodies)
      .where(eq(celestialBodies.type, type)),
    db
      .select({
        parentId: celestialBodies.parentId,
        count: count()
      })
      .from(celestialBodies)
      .where(and(eq(celestialBodies.type, 'Moon'), isNotNull(celestialBodies.parentId)))
      .groupBy(celestialBodies.parentId)
  ])

  const moonCountsByParentId = new Map<number, number>()
  for (const row of moonCounts) {
    if (row.parentId !== null) {
      moonCountsByParentId.set(row.parentId, row.count)
    }
  }

  const averages: CelestialBodyAverages['data'] = {
    mass: valueToScientific(
      average(bodies.flatMap((body) => {
        if (body.massValue == null || body.massExponent == null) return []
        return [scientificToValue({
          value: body.massValue,
          exponent: body.massExponent
        })]
      })) ?? 0
    ),
    meanRadius: average(bodies.map(body => body.meanRadius)),
    gravity: average(bodies.map(body => body.gravity)),
    averageTemperature: average(bodies.map(body => body.averageTemperature)),
    moons: average(bodies.map(body => moonCountsByParentId.get(body.id) ?? 0))
  }

  return { count: bodies.length, data: averages }
})
