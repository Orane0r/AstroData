import type { DatabaseSeedStatus } from '~~/shared/types/database'
import { checkDatabaseSeed, getDatabaseSeedStatus } from '~~/server/utils/database-seed'

/**
 * Current database seed status. Also detects migrations applied while the
 * server is already running (for example `pnpm exec nuxt-db migrate`).
 */
export default defineEventHandler(async (): Promise<DatabaseSeedStatus> => {
  await checkDatabaseSeed()

  return getDatabaseSeedStatus()
})
