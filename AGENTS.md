<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Academy Management System (AMS) — AI & Agent Guidelines

Welcome to `ams-client`! This file provides essential context, architectural standards, and strict constraints for any AI model, LLM, or autonomous agent (Antigravity, Claude Code, Cursor, Copilot, Codex, etc.) working on this repository.

---

## 1. Core Principles & Strict Rules

1. **Maintain Visual Fidelity:**
   - NEVER alter existing UI, layouts, spacing, or color palettes unless explicitly instructed by the user.
   - Any visual change must match Figma tokens and specs.
2. **Architecture Separation & Feature Structure:**
   - **NO CSS modules directly in `src/app/`:** Keep `src/app/` exclusively for Next.js App Router route entrypoints (`page.tsx`, `layout.tsx`, `not-found.tsx`, `fonts.ts`, `globals.css`). Pages simply mount the feature coordinator (e.g. `<DashboardView />`, `<BranchesView />`, `<CreateBranchView />`).
   - **Feature-Sliced Design (`src/features/<feature>/`):**
     Every feature MUST strictly adhere to this identical 7-part module structure:
     - `components/` - Atomic UI components directly inside `components/` (flat, **NO nested subdirectories**), a slim coordinator `<feature>-view.tsx` (~100-200 lines), and `index.ts`.
     - `hooks/` - Feature custom React hooks (e.g., `use-<feature>.ts` and `index.ts`).
     - `lib/` - Pure domain utility functions (e.g., `<feature>-utils.ts` and `index.ts`).
     - `services/` - Data access layer, API wrappers, and mock datasets.
     - `styles/` - **Dedicated CSS module directory** containing all feature `.module.css` files (e.g., `<feature>-view.module.css`, `<component>.module.css`).
     - `types/` - Feature domain types, interfaces, constants, and `index.ts`.
     - `index.ts` - Clean public export surface re-exporting `components`, `hooks`, `lib`, `services`, `types`.
   - **Atomic Components Rule:**
     - NEVER bloat a single file with 1k+ lines of code.
     - Decompose screens into modular, single-responsibility atomic components.
     - Each atomic component imports its own dedicated `.module.css` from `../styles/<component>.module.css`.
   - **Shared Components (`src/components/`):**
     - `ui/` - Primitives (`badge`, `button`, `card`, `input`, `modal`).
     - `layout/` - Shell structures (`sidebar`, `topbar`, `dashboard-shell`).
     - `not-found/` - Standalone 404 view component.
3. **Verification Before Concluding:**
   - Always run `pnpm typecheck` and `pnpm lint` before submitting or reporting work. Ensure 0 errors and 0 warnings.
4. **Preserve Documentation:**
   - Do not remove existing docstrings or comments unrelated to your changes.

---

## 2. Technology Stack & Ecosystem

- **Framework:** Next.js 16.4.2 (App Router with React Server Components)
- **Library:** React 19.3.0 & React DOM 19.3.0
- **Language:** TypeScript 5.9.3 (Strict mode, `"@/*": ["./src/*"]` alias)
- **Package Manager:** pnpm 12.14.0
- **Styling:** CSS Modules + Style Dictionary Design Tokens (`src/styles/tokens.css`) + Tailwind CSS v4
- **Headless UI Primitives:** Base UI 1.9.0 (`@base-ui/react`)
- **Iconography:** Lucide React 1.59.0
- **Touch Feedback:** Custom Material UI TouchRipple (`@/lib/touch-ripple`)

---

## 3. Brand Theme & Design Tokens

| Token / Concept | Value / Reference | Purpose |
| :--- | :--- | :--- |
| **DSCA Primary** | `#028c4a` | Dhaka Specialty Coffee Academy brand |
| **GBTA Primary** | `#ff7724` | Global Barista Training Academy brand |
| **Action Primary** | `#1b84ff` / `--ams-color-primary-300` | Primary buttons, links, active tabs |
| **Text Primary** | `#071437` / `--ams-color-grayscale-400` | Major headings and titles |
| **Text Secondary**| `#99a1b7` / `--ams-color-grayscale-300` | Subtitles, timestamps, muted captions |
| **Surface Page** | `#ffffff` / `#f4f6fa` | Page canvas backgrounds |
| **Border Subtle** | `#eff1f4` | Card borders, dividers, table lines |

---

## 4. Key Developer & Quality Commands

```bash
pnpm dev                       # Run local dev server on http://localhost:3000
pnpm typecheck                 # Validate TypeScript types (tsc --noEmit)
pnpm lint                      # Run ESLint validation
pnpm build                     # Production build verification
pnpm format                    # Format codebase with Prettier
pnpm create:feature <name>     # Automatically scaffold a standardized feature module
```

### Feature Scaffolding Automation
Whenever creating a new feature, run:
```bash
npm run create:feature <feature-name>
# or
pnpm create:feature <feature-name>
```
This generates the full standard shape (`components/`, `hooks/`, `lib/`, `services/`, `styles/`, `types/`, and `index.ts`) with strict TypeScript and ESLint compliance.

---

## 5. Directory Map

```
src/
├── app/                  # Next.js App Router (pages, layouts, not-found)
│   ├── (dashboard)/      # Dashboard route group
│   │   ├── page.tsx      # Landing page mounting <DashboardView />
│   │   └── branches/     # Branch routes (/branches, /branches/create)
│   ├── fonts/            # Local Inter variable font assets
│   ├── fonts.ts          # Font configuration
│   ├── globals.css       # Tailwind v4 theme & universal token imports
│   ├── layout.tsx        # Root HTML wrapper
│   └── not-found.tsx     # 404 route rendering @/components/not-found
├── components/           # Shared global components
│   ├── layout/           # Dashboard shell, sidebar, topbar
│   ├── not-found/        # Modular 404 view component & styling
│   └── ui/               # Reusable UI primitives (button, badge, card, input, modal)
├── consts/               # Application-wide constants & routes
├── features/             # Standardized Feature-Sliced Domain Modules
│   ├── dashboard/        # Central Dashboard feature
│   │   ├── components/   # Atomic visual components & DashboardView coordinator
│   │   ├── hooks/        # useDashboard hook
│   │   ├── lib/          # dashboard-utils (formatters)
│   │   ├── services/     # dashboard.service & mock datasets
│   │   ├── styles/       # Dedicated CSS modules directory
│   │   ├── types/        # Domain types & interfaces
│   │   └── index.ts      # Public barrel
│   ├── branches/         # Branch listing, metrics, & management
│   │   ├── components/   # Atomic table, header, pagination, modal, & BranchesView
│   │   ├── hooks/        # useBranches hook
│   │   ├── lib/          # branch-utils
│   │   ├── services/     # branches.service & mock data
│   │   ├── styles/       # Dedicated CSS modules directory
│   │   ├── types/        # Branch domain models
│   │   └── index.ts      # Public barrel
│   └── create-branch/    # Branch creation registration flow
│       ├── components/   # Atomic section cards & CreateBranchView coordinator
│       ├── hooks/        # useCreateBranchForm hook
│       ├── lib/          # slug-utils & validation-utils
│       ├── services/     # create-branch.service
│       ├── styles/       # Dedicated CSS modules directory
│       ├── types/        # Form models & constants
│       └── index.ts      # Public barrel
├── hooks/                # Global custom hooks
├── lib/                  # Global utilities (e.g. touch-ripple.ts)
├── providers/            # React context providers
├── stores/               # Client state stores
├── styles/               # Generated design tokens (tokens.css)
└── types/                # Global TypeScript declarations & system types
```

---

## 6. How to Navigate & Work on This Project (AI & Human Playbook)

### Navigation Map: Finding What You Need
- **Need to add or modify a route?** Look in `src/app/(dashboard)/<route>/page.tsx`. Remember: keep this file lean. It should only import and render a view component from `@/features/<feature>`.
- **Need to modify business logic or mock data?** Look in `src/features/<feature>/hooks/` or `src/features/<feature>/services/`.
- **Need to modify UI components?** Look in `src/features/<feature>/components/` (or `src/components/ui/` for shared primitives).
- **Need to modify styling?** Look in `src/features/<feature>/styles/` for feature styles, or `src/styles/tokens.css` for design system tokens.
- **Need to build a new feature?** Run `pnpm create:feature <feature-name>` first. Never manually assemble the 7 directories from scratch.

### Step-by-Step Execution Workflow
1. **Explore First:** Read existing files in `src/features/` (e.g. `branches` or `dashboard`) to follow established patterns.
2. **Scaffold:** Execute `pnpm create:feature <feature-name>` to create the compliant 7-part architecture.
3. **Decompose into Atomic Components:**
   - Keep files small (< 250 lines).
   - Place all atomic components directly in `components/` (no subdirectories).
   - Pair each component with a dedicated `.module.css` file in `styles/`.
4. **Use Design Tokens:** Always use CSS variables (`var(--ams-*)`) from `src/styles/tokens.css`. Never introduce arbitrary hex codes.
5. **Mount to App Router:** Create the `src/app/(dashboard)/<route>/page.tsx` file and render the coordinator view.
6. **Verify Before Concluding:**
   - Run `pnpm typecheck` to confirm 0 TypeScript errors.
   - Run `pnpm lint` to confirm 0 ESLint warnings or errors.
