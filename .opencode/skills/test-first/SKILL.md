---
name: test-first
description: Ask the user which test to create or update after any behaviour change, before declaring the work done. Names the layer (Vitest unit/nuxt or Playwright), the file, and what the test proves.
---

# Test first

AstroData does not run tests in CI (`lint` + `typecheck` only), so a behavior change without a test has no gate. Never end an implementation with "done" on its own.

## When to trigger

After implementing a feature, fixing a bug, changing behavior, or discovering a production-only failure. Doc, comment, style-only, and dependency-bump changes do not need a test: say so in one line instead of asking.

## What to do

1. Stop before the final summary: do not present the work as finished.
2. Propose one test maximum, in a table: layer, file, what it proves, cost.
3. Ask the user whether to write it. If they decline, say the change is unverified and why it matters.
4. Only write it after approval (edits need approval in this repo anyway).

## Picking the layer

| Change                                                                                        | Layer              | Location                   |
| --------------------------------------------------------------------------------------------- | ------------------ | -------------------------- |
| Pure logic, no Nuxt (`shared/utils`, mappers, formatting)                                     | `unit` (node)      | `test/unit/<name>.test.ts` |
| Store, facade composable, component, anything using auto-imports or `useFetch`                | `nuxt` (happy-dom) | `test/nuxt/<name>.test.ts` |
| Navigation, round trip across pages, request count, build-only failure, 404/redirect contract | Playwright         | `tests/<page>.spec.ts`     |

`unit` cannot resolve `~~/…` or auto-imports: import `shared/utils` through a relative path (`../../shared/utils/string`).

## Conventions

- Read state through the facade (`useCatalogFilters`), never the store, when a page is the subject.
- Mock `useFetch` with `mockNuxtImport`; keep network out of tests.
- In Playwright, assert on requests (`page.on('request')`) or row content, not on styling classes.
- Give each store test a fresh `setActivePinia(createPinia())` in `beforeEach`.

## Before saying it passes

- Targeted run first, then the full suite: `pnpm exec vitest run`, and `pnpm exec playwright test` when e2e changed.
- Then `pnpm lint` and `pnpm typecheck`.
- Optional but convincing: break the implementation on purpose once and check the test fails.
