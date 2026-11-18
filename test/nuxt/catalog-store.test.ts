import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

/**
 * A fresh Pinia per test: the store is a module-level singleton, so without it
 * state would leak from one test to the next.
 */
describe('useCatalogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts on the Moon + Planet selection, with no search and on page 1', () => {
    const store = useCatalogStore()

    expect(store.selectedTypes).toEqual(['Moon', 'Planet'])
    expect(store.search).toBe('')
    expect(store.page).toBe(1)
  })

  it('adds a type that is not selected yet', () => {
    const store = useCatalogStore()

    store.toggleType('Asteroid')

    expect(store.selectedTypes).toEqual(['Moon', 'Planet', 'Asteroid'])
  })

  it('removes a type that is already selected', () => {
    const store = useCatalogStore()

    store.toggleType('Moon')

    expect(store.selectedTypes).toEqual(['Planet'])
  })

  it('can remove every type', () => {
    const store = useCatalogStore()

    store.toggleType('Moon')
    store.toggleType('Planet')

    expect(store.selectedTypes).toEqual([])
  })

  it('replaces the array instead of mutating it, so the shallow `watch` of `useFetch` still fires', () => {
    const store = useCatalogStore()
    const before = store.selectedTypes

    store.toggleType('Asteroid')

    expect(store.selectedTypes).not.toBe(before)
    expect(before).toEqual(['Moon', 'Planet'])
  })
})
