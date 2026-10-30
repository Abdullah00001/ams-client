# GitHub Copilot Instructions — Academy Management System (AMS)

## Project Overview
`ams-client` is the frontend presentation client for the Academy Management System (AMS), built with Next.js 16 App Router, React 19, TypeScript, and CSS Modules.

## Architecture Guidelines
- **Route Handlers / Entrypoints:** Located in `src/app/`. Do not put component-specific CSS modules in `src/app/`.
- **Feature Modules:** Located in `src/features/<feature>/` (`components/`, `services/`, `types/`, `index.ts`).
- **Shared Primitives:** Located in `src/components/ui/` (`button`, `badge`, `card`, `input`).
- **Layout Shell:** Located in `src/components/layout/` (`sidebar`, `topbar`, `dashboard-shell`).
- **Standalone Pages:** Standalone page views such as 404 live in `src/components/not-found/` and are rendered by `src/app/not-found.tsx`.
- **Design Tokens:** Defined in `src/styles/tokens.css` with `--ams-*` prefix.
- **Brand Colors:** DSCA is `#028c4a` (Green), GBTA is `#ff7724` (Orange), Primary Action is `#1b84ff` (Blue).
- **Ripple Effect:** Import `createTouchRipple` from `@/lib/touch-ripple`.

## Quality Gates
- TypeScript Strict mode is enforced.
- Verify changes with `pnpm typecheck` and `pnpm lint`.
- Do not make unsolicited UI changes.
