import type { Ref } from 'vue'
import { DEFAULT_PAGE_SIZE } from '~~/shared/constants/page'
import type { UseFetchOptions } from 'nuxt/app'

type PaginationFetchOptions<T> = Omit<
  UseFetchOptions<PaginatedApiResult<T>>,
  'query' | 'watch'
> & {
  pageSize?: number
  /** Externally owned page ref, e.g. store state that must survive navigation. */
  page?: Ref<number>
  query?: UseFetchOptions<PaginatedApiResult<T>>['query']
  watch?: UseFetchOptions<PaginatedApiResult<T>>['watch']
}

/**
 * `useFetch` wrapper for endpoints returning a `PaginatedApiResult`.
 *
 * Keeps `page` / `pageSize` in sync with the query string and watches them
 * automatically. The paginated response is returned as `data`.
 *
 * Passing `page` makes the caller own the page number instead of a local ref.
 * Changing one of the `watch` sources resets it to 1.
 */
export async function usePaginationFetch<T>(
  url: string,
  options: PaginationFetchOptions<T> = {}
) {
  const {
    pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
    page: externalPage,
    query,
    watch: watchOption,
    ...fetchOptions
  } = options

  const page = externalPage ?? ref(1)
  const pageSize = ref(initialPageSize)

  const watchSources = watchOption === false ? [] : (watchOption ?? [])

  if (watchSources.length) {
    // Synchronous on purpose: the page is back to 1 before `useFetch` reacts to
    // the same change. Otherwise a filter change fires two requests (old page,
    // then page 1) and the stale response can overwrite the fresh one.
    watch(watchSources, () => {
      page.value = 1
    }, { flush: 'sync' })
  }

  const asyncData = await useFetch<PaginatedApiResult<T>>(url, {
    ...fetchOptions,
    query: {
      ...query,
      page,
      pageSize
    },
    watch: watchOption === false
      ? false
      : [page, pageSize, ...watchSources]
  })

  return {
    ...asyncData,
    page,
    pageSize
  }
}
