# CLAUDE.md — Instructions for Claude & AI Agents

This repository is **`ams-client`**, the frontend client for the **Academy Management System (AMS)**. It is built using Next.js 16 (App Router), React 19, TypeScript, CSS Modules, Style Dictionary design tokens, and Base UI.

---

## Commands for Building, Testing & Checking

```bash
# Development server (http://localhost:3000)
pnpm dev

# Typechecking (TypeScript strict mode)
pnpm typecheck

# Linting (ESLint 9 flat config)
pnpm lint

# Production build
pnpm build

# Formatting with Prettier
pnpm format
pnpm format:check

# Design Tokens (Style Dictionary)
pnpm tokens:check
pnpm tokens:build
```

> **Important:** Always run `pnpm typecheck && pnpm lint` after modifications to ensure 0 errors.

---

## Architectural Guidelines

### 1. Separation of Concerns
- **`src/app/` (Next.js App Router):**
  - Contains strictly route entrypoints (`page.tsx`, `layout.tsx`, `not-found.tsx`), font definitions (`fonts.ts`), and global styles (`globals.css`).
  - **Do NOT place `.module.css` files in `src/app/`**. Place component styles inside their respective component directory.
- **`src/features/<feature-name>/` (Feature-Sliced Modules):**
  - `components/`: UI components and their scoped `.module.css`.
  - `services/`: Data fetching, APIs, and query functions.
  - `types/`: Domain-specific TypeScript types and interfaces.
  - `index.ts`: Public barrel export for the feature.
- **`src/components/` (Shared & Global Components):**
  - `ui/`: Primitive UI widgets (`badge`, `button`, `card`, `input`).
  - `layout/`: Shell layout structures (`dashboard-shell`, `sidebar`, `topbar`).
  - `not-found/`: 404 view component and styling.

### 2. Styling & Design System
- **Design Tokens:** Always prefer design tokens defined in `src/styles/tokens.css` (e.g. `var(--ams-color-grayscale-400)`, `var(--ams-radius-8)`, `var(--ams-spacing-4)`).
- **Core Brand Colors:**
  - **DSCA (Dhaka Specialty Coffee Academy):** `#028c4a`
  - **GBTA (Global Barista Training Academy):** `#ff7724`
  - **Primary Action:** `#1b84ff` (`--ams-color-primary-300`)
  - **Primary Text:** `#071437` (`--ams-color-grayscale-400`)
  - **Muted Text:** `#99a1b7` (`--ams-color-grayscale-300`)
- **Interactive Feedback:** Use the custom Material UI TouchRipple utility (`createTouchRipple(event, "light" | "dark")` from `@/lib/touch-ripple`) on interactive cards, buttons, and navigation items.

### 3. UI Preservation Rule
- **Never alter the visual layout, spacing, colors, or animations of existing components unless explicitly requested by the user.**
- Keep existing code and documentation integrity intact.
