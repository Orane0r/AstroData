import { CELESTIAL_BODY_TYPES, CELESTIAL_BODY_TYPE_ORDER } from '~~/shared/constants/db'

import { celestialBodies } from '~~/server/db/schema'
import { sql } from 'drizzle-orm'

export const SQL_ORDER_BODY_TYPE = sql`CASE ${celestialBodies.type} ${sql.join(
  CELESTIAL_BODY_TYPES.map(type => sql`WHEN ${type} THEN ${CELESTIAL_BODY_TYPE_ORDER[type]}`),
  sql.raw(' ')
)} END`
