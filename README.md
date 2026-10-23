# Academy Management System (AMS) — Client

Frontend client for the Academy Management System (AMS) dashboard, built with Next.js App Router, React 19, and TypeScript.

---

## 1. Project Overview

`ams-client` is the frontend presentation layer for the AMS dashboard. It provides administrative, teacher, and student dashboard interfaces based on Figma specifications, utilizing accessible UI primitives, design tokens, and a clean responsive layout.

---

## 2. Existing Technology Stack

- **Framework:** Next.js 16.4.2 (App Router, Server Components by default)
- **Library:** React 19.3.0 & React DOM 19.3.0 (with React Compiler)
- **Language:** TypeScript 5.9.3 (strict mode)
- **Package Manager:** pnpm 12.14.0
- **Layout & Utilities:** Tailwind CSS 4.3.3 (via `@tailwindcss/turbopack`)
- **Interactive Primitives:** Base UI 1.9.0 (`@base-ui/react`)
- **Icons:** Lucide React 1.59.0
- **Class Utilities:** clsx 2.1.1
- **Quality Tooling:** ESLint 9 (Flat config) & Prettier 3.9.10
- **Token Engine:** Style Dictionary 5.7.0 (installed, configuration pending)

---

## 3. Prerequisites

- **Node.js:** `>= 20.0.0` (Tested on `v24.17.0`)
- **pnpm:** `12.14.0`

---

## 4. Development & Quality Commands

| Command             | Purpose                                                          |
| :------------------ | :--------------------------------------------------------------- |
| `pnpm dev`          | Starts the Next.js development server at `http://localhost:3000` |
| `pnpm build`        | Compiles an optimized production build                           |
| `pnpm start`        | Runs the compiled production server                              |
| `pnpm lint`         | Runs ESLint to check for code quality and Next.js best practices |
| `pnpm typecheck`    | Runs the TypeScript compiler (`tsc --noEmit`) to verify types    |
| `pnpm format:check` | Verifies source code adheres to Prettier formatting standards    |
| `pnpm format`       | Automatically formats files across the repository with Prettier  |

---

## 5. Current Implementation Status

- **Foundation Baseline (Current):**
  - Next.js App Router root layout and root landing route (`src/app/page.tsx`).
  - ESLint flat configuration and Prettier configuration established.
  - Quality verification scripts (`typecheck`, `format:check`, `format`, `lint`) enabled.
- **Planned / Pending Implementation (Future Chunks):**
  - **Design Tokens:** Style Dictionary v5 pipeline and DTCG token sources (`tokens/`).
  - **Typography:** Inter font family integration via `next/font/google`.
  - **Components:** Reusable UI library (`src/components/ui/`) leveraging Base UI and CSS Modules.
  - **Dashboard Shell:** Sidebar, Topbar, and responsive desktop-to-tablet shell (`src/components/layout/`).
  - **Dashboard Routes:** Primary dashboard route at `src/app/(dashboard)/dashboard/page.tsx`.
  - **Domain Fixtures:** Strongly typed mock data fixtures (`src/features/dashboard/`).

---

## 6. Planned Styling Architecture

The project enforces a clear styling contract:

1. **Design Tokens as Source of Truth:**
   - W3C DTCG tokens compiled via Style Dictionary into CSS Custom Properties (`--ams-*`).
2. **Tailwind CSS v4 for Structural Layout:**
   - Grid, Flexbox, layout spacing, and responsive visibility across Desktop, Laptop, and Tablet.
3. **CSS Modules for Component Aesthetics:**
   - Component visual surfaces, borders, elevations, hover/focus states, and micro-interactions.
4. **Accessible Headless Primitives:**
   - Base UI (`@base-ui/react`) for compound interactive elements (Dialog, Menu, Tooltip).

---

## 7. Incremental Implementation Workflow

All modifications follow a strict, phased, and verifiable engineering sequence:

1. **Repository Audit & Planning** (Completed in Chunks 01 & 02).
2. **Tooling & Quality Baseline** (Completed in Chunk 03).
3. **Token Engine & Primitives** (Next: Style Dictionary v5 setup and DTCG token files).
4. **Semantics & Component Tokens** (Semantic aliases and component token compilation).
5. **Global Styles & Typography** (Inter font migration and Tailwind v4 token binding).
6. **UI Components** (Atomic primitives built with native HTML, Base UI, and CSS Modules).
7. **Dashboard Shell & Screens** (Responsive shell and dashboard domain views).
8. **Verification & Hardening** (Quality gates, responsive audit, and accessibility checks).
