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
2. **Architecture Separation:**
   - **NO CSS modules directly in `src/app/`:** Keep `src/app/` exclusively for Next.js App Router route entrypoints (`page.tsx`, `layout.tsx`, `not-found.tsx`, `fonts.ts`, `globals.css`).
   - **Feature-Sliced Design (`src/features/<feature>/`):**
     - `components/` - Feature-specific UI components, their `.module.css`, and mock data.
     - `services/` - Data access layer, query functions, and API wrappers.
     - `types/` - Feature domain types and interfaces.
     - `index.ts` - Clean public export surface for the feature.
   - **Shared Components (`src/components/`):**
     - `ui/` - Primitives (`badge`, `button`, `card`, `input`).
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
pnpm dev         # Run local dev server on http://localhost:3000
pnpm typecheck   # Validate TypeScript types (tsc --noEmit)
pnpm lint        # Run ESLint validation
pnpm build       # Production build verification
pnpm format      # Format codebase with Prettier
```

---

## 5. Directory Map

```
src/
├── app/                  # Next.js App Router (pages, layouts, not-found)
│   ├── (dashboard)/      # Dashboard route group
│   ├── fonts/            # Local Inter variable font assets
│   ├── fonts.ts          # Font configuration
│   ├── globals.css       # Tailwind v4 theme & universal token imports
│   ├── layout.tsx        # Root HTML wrapper
│   └── not-found.tsx     # 404 route rendering @/components/not-found
├── components/           # Shared global components
│   ├── layout/           # Dashboard shell, sidebar, topbar
│   ├── not-found/        # Modular 404 view component & styling
│   └── ui/               # Reusable UI primitives (button, badge, card, input)
├── consts/               # Application-wide constants & routes
├── features/             # Feature-sliced domain modules
│   └── dashboard/        # Dashboard feature (components, services, types)
├── hooks/                # Global custom hooks
├── lib/                  # Utilities (e.g. touch-ripple.ts)
├── providers/            # React context providers
├── stores/               # Client state stores
├── styles/               # Generated design tokens (tokens.css)
└── types/                # Global TypeScript declarations & system types
```
