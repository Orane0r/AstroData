# AGENTS.md

AstroData is a Nuxt 4 astronomy catalog: Nuxt UI frontend, Nitro API, NuxtHub SQLite + Drizzle. Use pnpm (`pnpm@11.1.3`) and Node 22. `README.md` is the default Nuxt starter boilerplate; its `npm create nuxt` quick start does not apply to this repo.

## Commands

- `pnpm install` — also runs `nuxt prepare` via postinstall; rerun after pulling so `.nuxt` types are current.
- `pnpm dev` — http://localhost:3000. Dev applies DB migrations automatically and seeds an empty DB.
- `pnpm lint` — ESLint flat config from `@nuxt/eslint`. Auto-fix with `pnpm exec eslint . --fix`.
- `pnpm typecheck` — `nuxt typecheck` (vue-tsc). CI order is lint, then typecheck.
- `pnpm exec vitest run` — one-shot Vitest. Plain `pnpm test` is watch mode.
  - `pnpm test:unit` / `pnpm test:nuxt` — run one Vitest project.
  - `pnpm exec vitest run --project unit test/unit/example.test.ts` — single test file.
- `pnpm test:e2e` — Playwright. It starts Nuxt itself; no separate dev server needed.
  - `pnpm exec playwright test tests/example.spec.ts` — single e2e file.

CI (`.github/workflows/ci.yml`) runs only lint and typecheck on push; tests are not run in CI.

## Layout

- `app/` — Nuxt 4 srcDir: pages, components, composables, utils. Components and utils are auto-imported.
- `server/` — Nitro: `api/`, `db/` (Drizzle schema, seed, migrations), `services/` (NASA + Wikipedia HTTP), `mappers/`, `middleware/`, `plugins/`, `tasks/`.
- `shared/` — code used by both sides via `~~/shared/...`; `shared/utils/*` is auto-imported in both app and server.
- `i18n/locales/{en,fr}.json` — default locale is `fr`; add every new key to both files.

## Database

- NuxtHub SQLite + Drizzle. Local DB is `.data/db/sqlite.db` (gitignored); schema is `server/db/schema.ts`; commit generated migrations under `server/db/migrations/sqlite/`.
- `pnpm exec nuxt-db generate` — generate migrations after schema changes. The `npx nuxt db generate` comment in `schema.ts` is stale and does not work.
- `pnpm exec nuxt-db migrate` — apply migrations manually; dev and production builds apply them automatically.
- `server/plugins/z-seed-database.ts` seeds only when `celestial_bodies` is empty, via `server/db/seed.ts`. The seed reads `./server/data/solar_system.json` and `wikipedia.json` using CWD-relative paths and deletes/reinserts all bodies: run it from the repo root and treat it as destructive.
- Manual seed task in dev: `curl http://localhost:3000/_nitro/tasks/seed` (list tasks at `/_nitro/tasks`).
- `server/data/messier.json` and `meteorite_landings.json` are not referenced by code or the seed yet; do not assume they are loaded.

## Server/API quirks

- `db` and `schema` are Nitro auto-imports; `hub:db`, `hub:db:schema`, and `@nuxthub/db` also work. Existing routes mostly use `hub:db` / `hub:db:schema`.
- `server/middleware/validation.ts` validates `:id` for `/api/celestial-bodies/:id` and its `moons` / `description` children. When adding a named or nested route under that path, update its regex/exclusion list or the middleware returns 400.
- NASA and Wikipedia endpoints need no API key. `images` and `description` use `defineCachedEventHandler`, so responses can be stale until the cache is invalidated; avoid network-dependent tests.
- Keep the top-level `import '@libsql/client'` in `nuxt.config.ts`: it prevents a libsql native-addon crash in Nitro dev workers on Windows.

## UI conventions

- Nuxt UI v4 + Tailwind v4. Custom colors `rock`, `star`, `stardust`, and `earth` must be registered in both `nuxt.config.ts` (`ui.theme.colors`) and `app/app.config.ts` (`ui.colors`); custom palette variables live in `app/assets/css/main.css`.
- Icon sets: Solar (`i-solar-*`, `@iconify-json/solar`), Simple Icons, and Lucide.
- ESLint is the formatter (no Prettier): 2 spaces, single quotes, no semicolons, `commaDangle: never`, `braceStyle: 1tbs`.
- `app/utils/body-config.ts.ts` really has a doubled `.ts`; `useBodyTypeConfig` is auto-imported from it.

## Tests

- Vitest projects: `test/unit/*.test.ts` (node) and `test/nuxt/*.test.ts` (Nuxt/happy-dom); Playwright uses `tests/` (per `playwright.config.ts`), not `test/e2e/`.
- `test/nuxt/` and `test/e2e/` are currently empty. Existing unit and e2e tests are scaffolds; `tests/example.spec.ts` asserts a `/Nuxt/` title while the app title is `AstroData`, so expect that assertion to be stale.
- Coverage is enabled globally in `vitest.config.ts`; every Vitest run collects it.
