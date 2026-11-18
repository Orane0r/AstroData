import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { Ref } from 'vue'
import { nextTick, ref, watch } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_PAGE_SIZE } from '~~/shared/constants/page'

type FetchOptions = {
  query: {
    page: Ref<number>
    pageSize: Ref<number>
    [key: string]: unknown
  }
  watch: unknown
}

const { useFetchMock } = vi.hoisted(() => ({
  useFetchMock: vi.fn<(url: string, options: FetchOptions) => { data: Ref<null> }>()
}))

// `useFetch` is mocked so the tests only observe what the wrapper hands over:
// the real one would issue a request on every assertion.
mockNuxtImport('useFetch', () => useFetchMock)

function lastFetchOptions(): FetchOptions {
  const calls = useFetchMock.mock.calls
  return calls[calls.length - 1]![1]
}

describe('usePaginationFetch', () => {
  beforeEach(() => {
    useFetchMock.mockReset()
    useFetchMock.mockImplementation(() => ({ data: ref(null) }))
  })

  it('uses the page ref it is given instead of a local one', async () => {
    const page = ref(3)

    const { page: returnedPage, pageSize } = await usePaginationFetch('/api/celestial-bodies', { page })
    const options = lastFetchOptions()

    expect(returnedPage).toBe(page)
    expect(options.query.page).toBe(page)
    expect(pageSize.value).toBe(DEFAULT_PAGE_SIZE)
    expect(options.query.pageSize).toBe(pageSize)
  })

  it('creates a local page ref when none is given', async () => {
    const { page } = await usePaginationFetch('/api/celestial-bodies')

    expect(page.value).toBe(1)
    expect(lastFetchOptions().query.page).toBe(page)
  })

  it('keeps a custom page size', async () => {
    const { pageSize } = await usePaginationFetch('/api/celestial-bodies', { pageSize: 5 })

    expect(pageSize.value).toBe(5)
    expect(lastFetchOptions().query.pageSize).toBe(pageSize)
  })

  it('forwards the caller query alongside page and pageSize', async () => {
    const search = ref('mars')
    const types = ref(['Moon'])

    await usePaginationFetch('/api/celestial-bodies', {
      query: { search, types }
    })

    const { query } = lastFetchOptions()

    expect(query.search).toBe(search)
    expect(query.types).toBe(types)
    expect((query.page as Ref<number>).value).toBe(1)
    expect((query.pageSize as Ref<number>).value).toBe(DEFAULT_PAGE_SIZE)
  })

  it('watches page, pageSize and the given sources', async () => {
    const page = ref(2)
    const search = ref('mars')

    const { pageSize } = await usePaginationFetch('/api/celestial-bodies', {
      page,
      watch: [search]
    })

    expect(lastFetchOptions().watch).toEqual([page, pageSize, search])
  })

  it('resets the page to 1 before anything else reacts to a filter change', async () => {
    const page = ref(3)
    const search = ref('mars')
    await usePaginationFetch('/api/celestial-bodies', { page, watch: [search] })

    page.value = 4
    const seenByOtherWatchers: number[] = []
    // Default `flush: 'pre'`, like the watcher installed by `useFetch`.
    watch(search, () => seenByOtherWatchers.push(page.value))

    search.value = 'vega'

    // Synchronous: `useFetch` must not refetch the old page first.
    expect(page.value).toBe(1)

    await nextTick()
    expect(seenByOtherWatchers).toEqual([1])
  })

  it('does not reset when watch is disabled', async () => {
    const page = ref(3)
    const search = ref('mars')

    await usePaginationFetch('/api/celestial-bodies', { page, watch: false })

    expect(lastFetchOptions().watch).toBe(false)

    page.value = 5
    search.value = 'vega'
    await nextTick()

    expect(page.value).toBe(5)
  })
})
