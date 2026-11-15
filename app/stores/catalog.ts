export const useCatalogStore = defineStore('catalog', () => {
  const selectedTypes = ref<CelestialBodyType[]>(['Moon', 'Planet'])
  const search = ref('')
  const page = ref(1)

  /**
   * Reassigns the array instead of pushing into it: `watch` sources are not
   * deep by default, so a mutation would not retrigger `useFetch`.
   */
  function toggleType(type: CelestialBodyType) {
    selectedTypes.value = selectedTypes.value.includes(type)
      ? selectedTypes.value.filter(selected => selected !== type)
      : [...selectedTypes.value, type]
  }

  return { selectedTypes, search, page, toggleType }
})
