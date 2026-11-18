import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

/**
 * Stand-in for `app/pages/catalog/index.vue`: it only talks to the facade, like
 * the real page does, and renders the state so a test can read it back.
 */
const CatalogProbe = defineComponent({
  name: 'CatalogProbe',
  setup() {
    const { selectedTypes, search, page, toggleType } = useCatalogFilters()

    return () => h('div', [
      h('span', { 'data-testid': 'types' }, selectedTypes.value.join('|')),
      h('span', { 'data-testid': 'search' }, search.value),
      h('span', { 'data-testid': 'page' }, String(page.value)),
      h('button', {
        'data-testid': 'toggle-asteroid',
        'onClick': () => toggleType('Asteroid')
      }, 'Asteroid')
    ])
  }
})

function resetFilters() {
  const { selectedTypes, search, page } = useCatalogFilters()

  selectedTypes.value = ['Moon', 'Planet']
  search.value = ''
  page.value = 1
}

describe('useCatalogFilters', () => {
  it('exposes the store state as writable refs', () => {
    resetFilters()

    const store = useCatalogStore()
    const { selectedTypes, search, page } = useCatalogFilters()

    page.value = 4
    search.value = 'mars'
    selectedTypes.value = ['Comet']

    expect(store.page).toBe(4)
    expect(store.search).toBe('mars')
    expect(store.selectedTypes).toEqual(['Comet'])
  })

  it('keeps filters and page when the page component unmounts and mounts again', async () => {
    resetFilters()

    // Visiting /catalog.
    const firstVisit = await mountSuspended(CatalogProbe)
    expect(firstVisit.get('[data-testid="types"]').text()).toBe('Moon|Planet')

    // Selecting a type, typing a search and paginating.
    await firstVisit.get('[data-testid="toggle-asteroid"]').trigger('click')
    const { search, page } = useCatalogFilters()
    search.value = 'mars'
    page.value = 3
    await nextTick()

    expect(firstVisit.get('[data-testid="types"]').text()).toBe('Moon|Planet|Asteroid')

    // Leaving /catalog for /catalog/earth.
    firstVisit.unmount()

    // Coming back to /catalog: a brand new component instance.
    const secondVisit = await mountSuspended(CatalogProbe)

    expect(secondVisit.get('[data-testid="types"]').text()).toBe('Moon|Planet|Asteroid')
    expect(secondVisit.get('[data-testid="search"]').text()).toBe('mars')
    expect(secondVisit.get('[data-testid="page"]').text()).toBe('3')

    secondVisit.unmount()
  })
})
