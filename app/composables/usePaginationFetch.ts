import { DEFAULT_PAGE_SIZE } from '~~/shared/constants/page'
import type { UseFetchOptions } from 'nuxt/app'

type PaginationFetchOptions<T> = Omit<
  UseFetchOptions<PaginatedApiResult<T>>,
  'query' | 'watch'
> & {
  pageSize?: number
  query?: UseFetchOptions<PaginatedApiResult<T>>['query']
  watch?: UseFetchOptions<PaginatedApiResult<T>>['watch']
}

/**
 * `useFetch` wrapper for endpoints returning a `PaginatedApiResult`.
 *
 * Keeps `page` / `pageSize` in sync with the query string and watches them
 * automatically. The paginated response is returned as `data`.
 */
export async function usePaginationFetch<T>(
  url: string,
  options: PaginationFetchOptions<T> = {}
) {
  const {
    pageSize: initialPageSize = DEFAULT_PAGE_SIZE,
    query,
    watch,
    ...fetchOptions
  } = options

  const page = ref(1)
  const pageSize = ref(initialPageSize)

  const asyncData = await useFetch<PaginatedApiResult<T>>(url, {
    ...fetchOptions,
    query: {
      ...query,
      page,
      pageSize
    },
    watch: watch === false
      ? false
      : [page, pageSize, ...(watch ?? [])]
  })

  return {
    ...asyncData,
    page,
    pageSize
  }
}
