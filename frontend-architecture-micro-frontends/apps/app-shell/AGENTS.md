# Repository Guidelines

## Project Structure & Module Organization
This app is the integrated CommerceOS shell. Shell-owned code lives in `src/`; feature modules live in sibling workspaces under `apps/*`.

- `src/app/`: app bootstrap, router setup, and providers
- `src/api/`: client-side data access helpers grouped by domain
- `../../packages/shared/mocks/`: shared MSW handlers and in-memory store used during development
- `public/`: static assets and the MSW worker file

Use package imports such as `@commerceos/catalog/screens/...` for module screens and relative imports for shell-owned files. Do not add app-local path aliases.

## Build, Test, and Development Commands
Use npm for local work.

- `npm install`: install dependencies
- `npm run dev`: start the Vite dev server with MSW enabled in development
- `npm run build`: run TypeScript checks, then create a production build in `dist/`
- `npm run typecheck`: run `tsc --noEmit`
- `npm run lint`: run ESLint across the repo
- `npm run preview`: serve the built app locally

## Coding Style & Naming Conventions
Use TypeScript and function components. Follow the existing style: 2-space indentation, double quotes, semicolons, and trailing commas where the formatter leaves them. Keep route files aligned with URL structure (`catalog/index.tsx`, `catalog/$productId.tsx`).

Component files are typically kebab-case (`app-shell.tsx`, `status-badge.tsx`), while exported React components and TypeScript interfaces use PascalCase. Keep domain helpers close to their area (`src/api/orders.ts`, `src/utils/discounts.ts`).

## Testing Guidelines
There is no dedicated automated test runner configured yet. Until one is added, every change should pass `npm run lint`, `npm run typecheck`, and, when relevant, `npm run build`.

When adding tests, keep them next to the feature or under a focused `src/**/__tests__/` folder, and name files `*.test.ts` or `*.test.tsx`.

## Commit & Pull Request Guidelines
Recent commits use short, imperative subjects such as `Tailwind 4` and `CSS config`. Keep commit titles brief and descriptive; one logical change per commit.

Pull requests should include a concise summary, note affected routes or modules, link the related issue when applicable, and attach screenshots or short recordings for UI changes.
