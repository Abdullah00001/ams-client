# Design Tokens Architecture

This directory houses the source-of-truth design tokens for the Academy Management System (AMS) client, compiled using **Style Dictionary v5**.

---

## 1. Directory Structure

```text
tokens/
├── config.mjs              # Style Dictionary v5 build configuration
├── check.mjs               # Non-destructive token verification script
├── README.md               # Design token documentation
└── src/
    └── primitives/         # Tier 1: Raw values (color, spacing, radius, typography)
        ├── color.json
        ├── spacing.json
        ├── radius.json
        └── typography.json
    └── semantics/          # Tier 2: Intent-based aliases of primitive values
        ├── color.json
        └── typography.json
```

The compiled CSS output is generated to:

```text
src/styles/tokens.css       # Auto-generated CSS custom properties (--ams-*)
```

---

## 2. Token Format (W3C DTCG Standard)

All token source files adhere to the **W3C Design Tokens Community Group (DTCG)** specification:

- `$value`: Literal value (`#1B84FF`, `16px`, `700`, etc.)
- `$type`: Token type identifier (`color`, `dimension`, `fontWeight`, `fontFamily`)
- `$description`: Purpose and context of the token
- `$extensions`: Custom metadata including provenance tracking

### Example

```json
{
  "color": {
    "primary": {
      "300": {
        "$value": "#1B84FF",
        "$type": "color",
        "$description": "Primary brand accent 300",
        "$extensions": {
          "ams": {
            "provenance": "CONFIRMED"
          }
        }
      }
    }
  }
}
```

---

## 3. Provenance Classifications

Every token is explicitly categorized within its `$extensions.ams.provenance` field:

- **`CONFIRMED`**: Explicitly approved design specification or brand value.
- **`OBSERVED`**: Extracted directly from existing Figma screens; not yet officially universalized.
- **`ASSUMED`**: Engineering decision introduced to maintain semantic consistency where design was missing.
- **`UNVERIFIED`**: Cannot be verified from available evidence.

---

## 4. Naming Conventions

Style Dictionary automatically transforms token object hierarchies into kebab-case CSS custom properties prefixed with `--ams-`:

| Token Path             | Generated CSS Custom Property |
| :--------------------- | :---------------------------- |
| `color.base.black`     | `--ams-color-base-black`      |
| `color.primary.300`    | `--ams-color-primary-300`     |
| `color.status.success` | `--ams-color-status-success`  |
| `spacing.4`            | `--ams-spacing-4`             |
| `spacing.2-5`          | `--ams-spacing-2-5`           |
| `radius.8`             | `--ams-radius-8`              |
| `font.size.24`         | `--ams-font-size-24`          |
| `font.weight.bold`     | `--ams-font-weight-bold`      |

---

## 5. Token Layers and Semantic Aliases

AMS uses a three-tier token model:

1. **Primitives** are raw, reusable values such as `color.primary.300`.
2. **Semantics** describe a usage role and alias a primitive, such as `color.action.primary.background` → `{color.primary.300}`.
3. **Components** will alias semantic tokens for a specific component when that component exists; no component tokens are defined yet.

Semantic names describe intent, not the current literal value. Add semantic aliases under `tokens/src/semantics/` with the same DTCG fields as primitives, and use a complete DTCG alias as `$value`. For example:

```json
{
  "$value": "{color.base.black}",
  "$type": "color"
}
```

A primitive's provenance applies to its value only. Its semantic role must be classified separately: a confirmed `color.grayscale.100` value does not make `color.surface.page` confirmed unless that page-surface usage is independently specified. Use `ASSUMED` when an engineering mapping is useful but design evidence is absent.

With CSS reference output enabled, aliases compile as linked custom properties rather than duplicated literals:

```css
--ams-color-action-primary-background: var(--ams-color-primary-300);
```

When future component aliases are justified, place them in `tokens/src/components/`, alias semantic tokens where possible, and retain the required description and provenance metadata.

## 6. Adding or Modifying Tokens

1. Locate or create the appropriate JSON file under `tokens/src/primitives/`.
2. Define the token adhering to the DTCG format (`$value`, `$type`, `$description`, and `$extensions.ams.provenance`).
3. Run `pnpm tokens:build` to regenerate `src/styles/tokens.css`.
4. Run `pnpm tokens:check` to verify that all tokens pass validation and that the generated file matches the sources.

For semantic or future component tokens, choose `semantics/` or `components/` instead of `primitives/` and make `$value` a DTCG alias.

## 7. Build & Verification Commands

| Command             | Action                                                                                                                                                                                        |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm tokens:build` | Compiles source tokens in `tokens/src/` to `src/styles/tokens.css`                                                                                                                            |
| `pnpm tokens:check` | Read-only validation of every `tokens/src/**/*.json` file: syntax, DTCG structure, types, provenance, aliases, cycles, duplicate paths/properties, generated references, and output freshness |

---

## 8. Generated Files & Editing Policy

- **`src/styles/tokens.css` is an auto-generated artifact.**
- **NEVER edit `src/styles/tokens.css` manually.** Any direct modifications will be overwritten upon the next build and will cause `pnpm tokens:check` to fail in CI.
- Always make changes in `tokens/src/**/*.json` and compile via `pnpm tokens:build`.

---

## 9. Token Layer Status

The architecture has three tiers:

1. **Primitives (`tokens/src/primitives/`) — [ACTIVE]:** Raw, literal design values (colors, spacing, typography).
2. **Semantics (`tokens/src/semantics/`) — [ACTIVE]:** Purpose-driven aliases (e.g. `--ams-color-surface-page` referencing `{color.grayscale.100}`).
3. **Components (`tokens/src/components/`) — [FUTURE]:** Component-scoped aliases (e.g. `--ams-button-primary-bg`).

---

## 10. Styling Integration Strategy

The generated CSS custom properties will be consumed through two coordinated channels:

1. **Tailwind CSS v4:** Mapped in `src/app/globals.css` inside `@theme inline` so utilities can reference tokens (e.g., `bg-[var(--ams-color-primary-300)]` or semantic `@theme` mappings).
2. **CSS Modules:** Directly referenced in `*.module.css` files (e.g., `background: var(--ams-color-primary-300);`) for component-specific visual states and animations.
