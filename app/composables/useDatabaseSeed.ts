import type { DatabaseSeedStatus } from '~~/shared/types/database'

/**
 * Global database seed status, shared between the status plugin and the
 * loading screen. The server seeds in the background after a migration.
 */
export function useDatabaseSeed() {
  const status = useState<DatabaseSeedStatus>('database-seed-status', () => ({ state: 'ready' }))

  const isDatabaseReady = computed(() => status.value.state === 'ready')

  async function refresh() {
    status.value = await $fetch<DatabaseSeedStatus>('/api/system/database-status')
  }

  async function retry() {
    status.value = await $fetch<DatabaseSeedStatus>('/api/system/database-status', { method: 'POST' })
  }

  return { status, isDatabaseReady, refresh, retry }
}
