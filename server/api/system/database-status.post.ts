import type { DatabaseSeedStatus } from '~~/shared/types/database'
import { getDatabaseSeedStatus, retryDatabaseSeed } from '~~/server/utils/database-seed'

/**
 * Retries a failed database seed.
 */
export default defineEventHandler((): DatabaseSeedStatus => {
  retryDatabaseSeed()

  return getDatabaseSeedStatus()
})
