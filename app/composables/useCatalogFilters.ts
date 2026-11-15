import type { Ref } from 'vue'

/**
 * Public contract of the catalog state.
 */
type CatalogFilters = {
  selectedTypes: Ref<CelestialBodyType[]>
  search: Ref<string>
  page: Ref<number>
  toggleType: (type: CelestialBodyType) => void
}

export function useCatalogFilters(): CatalogFilters {
  const store = useCatalogStore()
  const { selectedTypes, search, page } = storeToRefs(store)

  return {
    selectedTypes,
    search,
    page,
    toggleType: store.toggleType
  }
}
