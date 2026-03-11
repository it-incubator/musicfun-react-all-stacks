# Repository Guidelines

## Project Structure & Module Organization

This project is a Vite + React + TypeScript app.

- `src/app`: app-level setup (`store`, base API/query, app shell and main page).
- `src/features`: feature slices grouped by domain (`auth`, `playlists`, `tracks`) with `api/`, `model/`, and `ui/`.
- `src/common`: shared components, hooks, utils, routing, schemas, enums, constants, and types.
- `src/assets`: static assets (for example `src/assets/images`).
- `public`: public static files served as-is.

Keep new code feature-first: put domain-specific logic in `src/features/<feature>` and move only reusable pieces to `src/common`.

## Build, Test, and Development Commands

Use `pnpm` (lockfile is `pnpm-lock.yaml`).

- `pnpm dev`: starts local Vite dev server.
- `pnpm build`: runs TypeScript project build (`tsc -b`) and creates production bundle.
- `pnpm preview`: serves the production build locally.
- `pnpm lint`: runs ESLint on the repository.

Run `pnpm lint && pnpm build` before opening a PR.

## Coding Style & Naming Conventions

- Language: TypeScript (`.ts`, `.tsx`), React function components.
- Formatting: Prettier (`singleQuote: true`, `semi: false`, `printWidth: 120`).
- Linting: ESLint 9 + `typescript-eslint` + `react-hooks` + `react-refresh`.
- Naming:
  - Components and folders: `PascalCase` (for example `PlaylistsPage.tsx`, `Header/`).
  - Hooks: `useXxx` (for example `useInfiniteScroll.ts`).
  - Utilities/constants: `camelCase` files (for example `handleErrors.ts`).

Prefer colocating `*.types.ts` and `*.schemas.ts` next to each feature API/model.

## Testing Guidelines

There is currently no dedicated test runner configured (`test` script is not present). For now:

- Validate changes with `pnpm lint` and `pnpm build`.
- Manually verify affected flows in `pnpm dev`.

If you add tests, use Vitest + React Testing Library and place files as `*.test.ts(x)` near the unit under test.

## Commit & Pull Request Guidelines

Use Conventional Commits for every commit message:
`<type>[optional scope]: <description>`

- Main semantic types:
  - `fix`: bug fix (PATCH).
  - `feat`: new feature (MINOR).
- Allowed additional types: `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`.
- Scope is optional and placed in parentheses, for example: `feat(auth): add OAuth callback handler`.
- Breaking changes:
  - Add `!` after type/scope, for example `feat(api)!: change token format`, or
  - Add footer `BREAKING CHANGE: <description>`.
- Optional body/footer sections are allowed for context and git-trailer-style metadata.
- Keep commits focused and atomic; avoid mixing unrelated changes.
- PRs should include: purpose, key changes, manual test steps, and screenshots/GIFs for UI updates.
- Link related issue/PR numbers when available.
