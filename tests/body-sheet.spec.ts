import type { APIRequestContext, Locator, Page, Response } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'
import { DEFAULT_PAGE_SIZE } from '../shared/constants/page'

type BodySummary = {
  slug: string
  name: string
  imageUrl: string | null
}

/**
 * The catalog endpoint is the cheapest way to know which bodies have a hero
 * image, without hardcoding a slug whose `imageUrl` depends on the last seed.
 */
async function firstBodies(request: APIRequestContext): Promise<BodySummary[]> {
  const response = await request.get('/api/celestial-bodies?pageSize=100')
  expect(response.ok()).toBe(true)

  return (await response.json()).data as BodySummary[]
}

async function leftEdge(locator: Locator): Promise<number> {
  const box = await locator.boundingBox()

  if (!box) {
    throw new Error('the element has no layout box')
  }

  return box.x
}

/** Left edge of the page content, outside the flex row under test. */
function contentLeft(page: Page): Promise<number> {
  return leftEdge(page.locator('nav[aria-label="breadcrumb"]'))
}

/**
 * The pagination only matters when a gallery has several pages, and the bug
 * lives on the last one. NASA totals are large, so probe a few planets instead
 * of hardcoding a slug whose gallery could be empty on a given day.
 */
async function bodyWithGallery(request: APIRequestContext): Promise<string> {
  for (const slug of ['earth', 'mars', 'jupiter', 'moon', 'saturn', 'venus']) {
    const response = await request.get(`/api/celestial-bodies/${slug}/images`)

    if (!response.ok()) {
      continue
    }

    const { total } = await response.json() as { total: number }

    if (total > DEFAULT_PAGE_SIZE) {
      return slug
    }
  }

  throw new Error('the gallery fixtures need a body with more than one page of images')
}

function isGalleryPage(pageNumber: number): (response: Response) => boolean {
  return (response) => {
    const url = new URL(response.url())

    return url.pathname.endsWith('/images') && url.searchParams.get('page') === String(pageNumber)
  }
}

test('does not reserve room for the image when the body has none', async ({ page, goto, request }) => {
  const body = (await firstBodies(request)).find(candidate => !candidate.imageUrl)

  if (!body) {
    throw new Error('the seed needs a body without an image')
  }

  await goto(`/catalog/${body.slug}`, { waitUntil: 'hydration' })

  const heading = page.getByRole('heading', { level: 1, name: body.name })
  await expect(heading).toBeVisible()

  // With the old markup the image `v-if` sat on the `NuxtImg`, so the empty
  // `flex-1` column still took a third of the row and pushed the title right.
  expect(Math.abs(await leftEdge(heading) - await contentLeft(page))).toBeLessThan(2)
})

test('still offsets the title when the body has an image', async ({ page, goto, request }) => {
  const body = (await firstBodies(request)).find(candidate => candidate.imageUrl)

  if (!body) {
    throw new Error('the seed needs a body with an image')
  }

  await goto(`/catalog/${body.slug}`, { waitUntil: 'hydration' })

  const heading = page.getByRole('heading', { level: 1, name: body.name })
  await expect(heading).toBeVisible()

  // Control: the same measurement detects the image column, so the first test
  // cannot pass just because the title never moves.
  expect(await leftEdge(heading) - await contentLeft(page)).toBeGreaterThan(24)
})

test('shows the gallery pagination, including on the last partial page', async ({ page, goto, request }) => {
  const slug = await bodyWithGallery(request)

  await goto(`/catalog/${slug}`, { waitUntil: 'hydration' })

  // The gallery is server-rendered, so there is no initial request to wait for:
  // take the last page number from the pagination it rendered.
  const lastPageButton = page.getByRole('button', { name: /^Page \d+$/ }).last()

  // The old condition compared the page length to `pageSize`, which a page can
  // never exceed, so the pagination never rendered at all.
  await expect(lastPageButton).toBeVisible()
  const lastPage = Number(await lastPageButton.textContent())

  const lastGalleryPage = page.waitForResponse(isGalleryPage(lastPage))
  await lastPageButton.click()

  const payload = await (await lastGalleryPage).json() as { data: unknown[] }
  expect(payload.data.length, 'the fixture needs a partial last page').toBeLessThan(DEFAULT_PAGE_SIZE)

  // It also stays on that partial page, so the user can navigate back instead
  // of being stranded with no pagination.
  await expect(page.getByRole('button', { name: 'Page 1', exact: true })).toBeVisible()
})
