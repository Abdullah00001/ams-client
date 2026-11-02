# Academy Management System (AMS) — Client

Frontend client for the Academy Management System (AMS), built with Next.js 16 (App Router), React 19, and TypeScript. It features a standardized Feature-Sliced Design architecture, atomic component patterns, accessible headless UI primitives, and design tokens.

---

## 1. Quick Navigation Guide

| Directory / File | Purpose |
| :--- | :--- |
| **`src/app/`** | Next.js App Router entrypoints (`page.tsx`, `layout.tsx`, `not-found.tsx`). **Lean route handlers only; no CSS modules.** |
| **`src/features/`** | Business domain modules (`dashboard`, `branches`, `create-branch`). Follows strict 7-part structure. |
| **`src/components/ui/`** | Reusable shared UI primitives (Button, Badge, Card, Input, Modal). |
| **`src/components/layout/`** | Global application shell, collapsible Sidebar, and Topbar. |
| **`src/components/not-found/`** | Animated 404 error page view and styling. |
| **`src/styles/tokens.css`** | Generated CSS custom properties (`--ams-*`) for colors, spacing, and radii. |
| **`src/lib/`** | Cross-cutting utilities (e.g., `touch-ripple.ts`). |
| **`scripts/`** | Developer automation scripts (e.g., `create-feature.mjs`). |
| **`docs/`** | Deep architectural guides and component reviews. |

---

## 2. Technology Stack

- **Framework:** Next.js 16.4.2 (App Router, Server Components by default)
- **Library:** React 19.3.0 & React DOM 19.3.0 (React Compiler enabled)
- **Language:** TypeScript 5.9.3 (Strict mode, `@/*` path aliases)
- **Package Manager:** pnpm 12.14.0
- **Styling:** CSS Modules + Tailwind CSS v4 + Style Dictionary Design Tokens
- **Headless UI Primitives:** Base UI 1.9.0 (`@base-ui/react`)
- **Iconography:** Lucide React 1.59.0
- **Touch Feedback:** Custom Material UI TouchRipple (`@/lib/touch-ripple`)

---

## 3. Developer Commands

```bash
# Start local development server (http://localhost:3000)
pnpm dev

# Typecheck codebase (tsc --noEmit)
pnpm typecheck

# Run ESLint (Flat config)
pnpm lint

# Production build & verification
pnpm build

# Automated code formatting
pnpm format
pnpm format:check

# Scaffold a new standardized feature module
pnpm create:feature <feature-name>
# or: npm run create:feature <feature-name>

# Token compilation
pnpm tokens:check
pnpm tokens:build
```

---

## 4. Feature Architecture Standard

Every business feature in `src/features/<feature-name>/` strictly follows this **7-part standard**:

```
src/features/<feature-name>/
├── components/           # Atomic UI components directly inside components/ (flat; NO subfolders)
│   ├── <feature>-view.tsx       # Slim coordinator component (~100-200 lines)
│   ├── <atomic-widget-a>.tsx    # Single-responsibility visual widget
│   ├── <atomic-widget-b>.tsx    # Single-responsibility visual widget
│   └── index.ts                 # Barrel re-exporting components
├── hooks/                # Feature custom React hooks
│   ├── use-<feature>.ts         # State, data fetching, and event handlers
│   └── index.ts                 # Barrel re-exporting hooks
├── lib/                  # Pure domain utility functions
│   ├── <feature>-utils.ts       # Formatters, calculators, validators
│   └── index.ts                 # Barrel re-exporting utilities
├── services/             # Data access layer, API wrappers, and mock datasets
│   ├── <feature>.service.ts     # Data access methods and mock fixtures
│   └── index.ts                 # Barrel re-exporting services
├── styles/               # Dedicated CSS module directory
│   ├── <feature>-view.module.css # Styles for view coordinator
│   ├── <widget-a>.module.css     # Scoped styles for widget A
│   └── <widget-b>.module.css     # Scoped styles for widget B
├── types/                # Domain TypeScript types, interfaces, and constants
│   ├── <feature>.types.ts       # Domain contracts
│   └── index.ts                 # Barrel re-exporting types
└── index.ts              # Public module entrypoint re-exporting all submodules
```

### Golden Architectural Rules
1. **No CSS Modules in `src/app/`:** App Router files (`page.tsx`) must be thin wrappers mounting the coordinator from `@/features/<feature>`.
2. **Atomic Components Only:** NEVER bloat a file with 1k+ lines of code. Split complex views into atomic, single-responsibility components.
3. **Flat `components/` Directory:** Atomic components reside directly inside `components/`. Do not create nested subfolders like `components/tables/rows/`.
4. **Dedicated `styles/` Directory:** All CSS modules for a feature reside in `src/features/<feature>/styles/`.
5. **Design Tokens as Source of Truth:** Use `--ams-*` variables from `src/styles/tokens.css`. Never use ad-hoc hex values.
6. **Preserve Visual Fidelity:** Never alter layouts, colors, or spacing without explicit user instruction.

---

## 5. How to Create a New Feature

Follow this workflow to add any new feature:

1. **Run the Automated Scaffolder:**
   ```bash
   pnpm create:feature student-management
   ```
   This generates the full 7-part module structure with boilerplate code and 0 lint/type errors.

2. **Define Data Models in `types/`:**
   Add TypeScript interfaces and statuses to `types/student-management.types.ts`.

3. **Implement Data Service in `services/`:**
   Add query functions or mock data fixtures in `services/student-management.service.ts`.

4. **Add Business Logic in `hooks/`:**
   Manage state, filtering, and mutations in `hooks/use-student-management.ts`.

5. **Build Atomic Components in `components/` & `styles/`:**
   Build single-responsibility components in `components/` and style them with dedicated CSS modules in `styles/`.

6. **Assemble Coordinator View:**
   Combine the hook and atomic components in `components/student-management-view.tsx`.

7. **Mount in Next.js App Router:**
   Create `src/app/(dashboard)/students/page.tsx`:
   ```tsx
   import { StudentManagementView } from "@/features/student-management";

   export default function StudentsPage() {
     return <StudentManagementView />;
   }
   ```

8. **Verify Quality Gates:**
   ```bash
   pnpm typecheck && pnpm lint
   ```

---

## 6. Brand Theme & Design Tokens

| Token / Concept | Value / Reference | Purpose |
| :--- | :--- | :--- |
| **DSCA Primary** | `#028c4a` (`--ams-color-brand-dsca`) | Dhaka Specialty Coffee Academy brand |
| **GBTA Primary** | `#ff7724` (`--ams-color-brand-gbta`) | Global Barista Training Academy brand |
| **Action Primary** | `#1b84ff` (`--ams-color-primary-300`) | Primary buttons, links, active tabs |
| **Text Primary** | `#071437` (`--ams-color-grayscale-400`) | Headings, titles, high-emphasis text |
| **Text Secondary**| `#99a1b7` (`--ams-color-grayscale-300`) | Subtitles, timestamps, muted captions |
| **Surface Page** | `#ffffff` / `#f4f6fa` (`--ams-color-surface-page`) | Main page background |
| **Border Subtle** | `#eff1f4` (`--ams-color-border-subtle`) | Card borders, table dividers |

---

## 7. Documentation Index

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Comprehensive architecture & engineering manual.
- [`AGENTS.md`](AGENTS.md) — AI agent directives and strict constraints.
- [`CLAUDE.md`](CLAUDE.md) — Instructions and commands for Claude and LLM assistants.
- [`docs/accessibility-and-color-usage.md`](docs/accessibility-and-color-usage.md) — Color contrast and accessibility specs.
- [`docs/sidebar-architecture.md`](docs/sidebar-architecture.md) — Collapsible sidebar design specs.
