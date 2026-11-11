const POLL_INTERVAL = 1000
/**
 * Loads the database seed status at startup, then polls while the database is
 * being seeded. The status is serialized during SSR so the first render
 * already shows the global loading screen when needed.
 */
export default defineNuxtPlugin(async () => {
  const { status, refresh } = useDatabaseSeed()

  // The home page is pre-rendered at build time: never bake a transient seed status into the static output.
  if (import.meta.prerender) {
    return
  }

  try {
    await refresh()
  } catch {
    status.value = { state: 'ready' }
  }

  if (!import.meta.client || status.value.state !== 'seeding') {
    return
  }

  const timer = setInterval(async () => {
    try {
      await refresh()
    } catch {
      // Keep polling: a transient network error must not leave the app stuck.
      return
    }

    if (status.value.state !== 'seeding') {
      clearInterval(timer)
    }
  }, POLL_INTERVAL)
})
