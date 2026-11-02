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

# Feature Scaffolding Automation
pnpm create:feature <feature-name>
npm run create:feature <feature-name>
```

> **Important:** Always run `pnpm typecheck && pnpm lint` after modifications to ensure 0 errors.

---

## Architectural Guidelines

### 1. Separation of Concerns & Feature Structure
- **`src/app/` (Next.js App Router):**
  - Contains strictly route entrypoints (`page.tsx`, `layout.tsx`, `not-found.tsx`), font definitions (`fonts.ts`), and global styles (`globals.css`).
  - **Do NOT place `.module.css` files in `src/app/`**. Routes should simply mount the feature coordinator (e.g. `<DashboardView />`, `<BranchesView />`).
- **`src/features/<feature-name>/` (Feature-Sliced Modules):**
  Every feature MUST strictly follow this identical 7-part module structure:
  - `components/`: Atomic UI components directly inside `components/` (flat, **NO nested subdirectories**), a slim `<feature>-view.tsx` coordinator, and `index.ts`.
  - `hooks/`: Feature custom hooks (`use-<feature>.ts`, `index.ts`).
  - `lib/`: Pure domain utility functions (`<feature>-utils.ts`, `index.ts`).
  - `services/`: Data fetching, APIs, query functions, and mock datasets.
  - `styles/`: **Dedicated CSS module directory** containing all scoped `.module.css` files for the feature.
  - `types/`: Domain-specific TypeScript types, interfaces, and constants.
  - `index.ts`: Public barrel export re-exporting `components`, `hooks`, `lib`, `services`, `types`.
- **Atomic Components Rule:**
  - NEVER bloat a single file with 1k+ lines of code.
  - Decompose views into modular, single-responsibility atomic components.
  - Each component imports its dedicated styles from `../styles/<component>.module.css`.
- **`src/components/` (Shared & Global Components):**
  - `ui/`: Primitive UI widgets (`badge`, `button`, `card`, `input`, `modal`).
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

---

## 4. How to Work on this Project (Workflow & Navigation)

1. **Feature Scaffolding:** Always generate new features using `pnpm create:feature <name>`.
2. **Component Decomposition:** Decompose complex UIs into small, single-responsibility atomic components in `components/`. Place them flat directly in `components/`.
3. **Dedicated Styles:** Place all CSS modules in `styles/`.
4. **Lean Routing:** Keep `src/app/` pages lean by only importing and mounting the coordinator component from `@/features/<feature>`.
5. **Quality Verification:** Always verify `pnpm typecheck` and `pnpm lint` pass with 0 errors before concluding.

