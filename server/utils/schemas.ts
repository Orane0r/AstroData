import { DEFAULT_PAGE_SIZE } from '~~/shared/constants/page'
import z from 'zod'

export const PAGINATION_QUERY_SCHEMA = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(DEFAULT_PAGE_SIZE)
})
