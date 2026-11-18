import type { Page } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'

/**
 * Records the client-side calls to the paginated endpoint so a test can assert
 * how many requests an interaction caused (and with which parameters).
 */
function trackPaginationRequests(page: Page) {
  const requests: URL[] = []

  page.on('request', (request) => {
    const url = request.url()

    if (url.includes('/api/celestial-bodies?')) {
      requests.push(new URL(url))
    }
  })

  return {
    forPage: (pageNumber: number) => requests.filter(url => url.searchParams.get('page') === String(pageNumber)),
    forSearch: (term: string) => requests.filter(url => url.searchParams.get('search') === term)
  }
}

async function goToPage(page: Page, pageNumber: number) {
  await page.getByRole('button', { name: `Page ${pageNumber}`, exact: true }).click()
}

test('keeps the page and the filters across a body page round trip', async ({ page, goto }) => {
  const tracked = trackPaginationRequests(page)

  await goto('/catalog', { waitUntil: 'hydration' })

  const bodyNames = page.locator('tbody tr td:nth-child(2)')
  await expect(bodyNames.first()).toBeVisible()
  const firstBodyOfPageOne = await bodyNames.first().innerText()

  // Paginate.
  await goToPage(page, 2)
  await expect(bodyNames.first()).not.toHaveText(firstBodyOfPageOne)
  const firstBodyOfPageTwo = await bodyNames.first().innerText()

  expect(tracked.forPage(2)).toHaveLength(1)

  // Leave /catalog for a body page.
  await page.locator('tbody tr').first().click()
  await expect(page).toHaveURL(/\/catalog\/[\w-]+$/)

  // Come back to /catalog.
  await page.goBack()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(bodyNames.first()).toHaveText(firstBodyOfPageTwo)

  const pageTwoRequests = tracked.forPage(2)
  expect(pageTwoRequests).toHaveLength(2)
  // The state is restored as-is: no refetch of page 1 first.
  expect(tracked.forPage(1)).toHaveLength(0)
  expect(pageTwoRequests[1]!.searchParams.getAll('types')).toEqual(['Moon', 'Planet'])
})

test('resets to page 1 in a single request when a filter changes', async ({ page, goto }) => {
  const tracked = trackPaginationRequests(page)

  await goto('/catalog', { waitUntil: 'hydration' })
  await expect(page.locator('tbody tr td:nth-child(2)').first()).toBeVisible()

  await goToPage(page, 2)
  await expect.poll(() => tracked.forPage(2).length).toBe(1)

  // The search is debounced, so exactly one request is expected.
  await page.locator('input[type="search"]').fill('mars')
  await expect.poll(() => tracked.forSearch('mars').length).toBe(1)

  const searchRequests = tracked.forSearch('mars')
  expect(searchRequests).toHaveLength(1)
  // The page was reset before the request: no stale `page=2` call.
  expect(searchRequests[0]!.searchParams.get('page')).toBe('1')
  expect(searchRequests[0]!.searchParams.getAll('types')).toEqual(['Moon', 'Planet'])
})

test('keeps a legacy numeric URL as a 404', async ({ page, goto }) => {
  const response = await goto('/catalog/42', { waitUntil: 'hydration' })

  expect(response?.status()).toBe(404)
  await expect(page).toHaveURL(/\/catalog\/42$/)
})
