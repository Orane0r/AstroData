import { isDatabaseSeeding } from '../utils/database-seed'

const ALLOWED_PREFIXES = ['/api/system/database-status']

/**
 * While the database is being seeded, refuse data requests: the seed runs in a
 * single SQLite transaction, so concurrent queries must not interleave with it.
 */
export default defineEventHandler((event) => {
  if (!isDatabaseSeeding()) {
    return
  }

  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/') || ALLOWED_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return
  }

  throw createError({
    statusCode: 503,
    statusMessage: 'Database seeding in progress'
  })
})
