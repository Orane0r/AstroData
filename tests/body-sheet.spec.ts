import type { APIRequestContext, Locator, Page } from '@playwright/test'
import { expect, test } from '@nuxt/test-utils/playwright'

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
