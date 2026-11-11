import { needsSeed, seedDatabase } from '../db/seed'

import type { DatabaseSeedStatus } from '~~/shared/types/database'
import { consola } from 'consola'

let status: DatabaseSeedStatus = { state: 'ready' }
let running: Promise<void> | null = null

export function getDatabaseSeedStatus(): DatabaseSeedStatus {
  return status
}

export function isDatabaseSeeding(): boolean {
  return status.state === 'seeding'
}

/**
 * Re-seeds the database when a migration (or a seed data update) happened
 * since the last seed. The seed itself runs in the background so the app can
 * display its global loading state.
 */
export async function checkDatabaseSeed(): Promise<void> {
  // A running seed is polled through `getDatabaseSeedStatus()`; a failed one
  // stays failed until the user explicitly retries.
  if (running !== null || status.state === 'error') {
    return
  }

  try {
    if (await needsSeed()) {
      void startDatabaseSeed()
    } else if (status.state !== 'ready') {
      // The schema was not migrated yet on a previous check: it is now.
      status = { state: 'ready' }
    }
  } catch (error) {
    // NuxtHub applies migrations on startup, possibly after the server started
    // accepting requests: `seed_state` does not exist yet. Keep the loading
    // screen on and let the next poll re-check.
    if (isMissingTableError(error)) {
      status = { state: 'seeding', progress: { done: 0, total: 0 } }
      return
    }

    setError(error)
  }
}

export function startDatabaseSeed(): Promise<void> {
  if (running !== null) {
    return running
  }

  status = { state: 'seeding', progress: { done: 0, total: 0 } }

  running = seedDatabase({
    onProgress: (done, total) => {
      status = { state: 'seeding', progress: { done, total } }
    }
  })
    .then(() => {
      status = { state: 'ready' }
    })
    .catch((error: unknown) => {
      setError(error)
    })
    .finally(() => {
      running = null
    })

  return running
}

export function retryDatabaseSeed(): void {
  if (running !== null) {
    return
  }

  status = { state: 'ready' }
  void startDatabaseSeed()
}

function setError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  consola.error('Failed to seed the database:', error)
  status = { state: 'error', error: message }
}

/**
 * Drizzle wraps SQLite errors, so the whole cause chain is inspected.
 */
function isMissingTableError(error: unknown): boolean {
  let current: unknown = error

  while (current instanceof Error) {
    if (/no such table/i.test(current.message)) {
      return true
    }

    current = current.cause
  }

  return false
}
