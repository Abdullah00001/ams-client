# Accessibility and Color Usage

Future components must meet WCAG 2.2 AA in their rendered context. Normal text requires at least **4.5:1** contrast; large text requires at least **3:1**. Meaningful UI boundaries and graphical indicators require applicable non-text contrast review. Focus indicators require rendered-context checks for contrast, visibility, size, and clipping; a 3:1 outline alone does not prove conformance.

## Current palette checks

| Foreground                       | Background                                  |   Ratio | Result              |
| -------------------------------- | ------------------------------------------- | ------: | ------------------- |
| `color.text.primary` `#0D0E12`   | `color.surface.page` `#F4F6FA`              | 17.83:1 | Normal-text AA pass |
| `color.text.secondary` `#071437` | `color.surface.card` `#FFFFFF`              | 18.04:1 | Normal-text AA pass |
| `color.text.muted` `#99A1B7`     | white `#FFFFFF`                             |  2.58:1 | Fails text AA       |
| white `#FFFFFF`                  | `color.action.primary.background` `#1B84FF` |  3.63:1 | Large-text AA only  |
| white `#FFFFFF`                  | `color.surface.sidebar` `#0D0E12`           | 19.29:1 | Normal-text AA pass |
| dark text `#0D0E12`              | `color.action.primary.background` `#1B84FF` |  5.32:1 | Normal-text AA pass |

## Component rules

- Do not use `color.text.muted` for essential normal-size text on white. Use an approved compliant text role instead.
- Do not use white text as the default for ordinary 12px–16px labels on the primary blue action background. Dark text on that background is an accessibility-safe candidate, but it is not designer-approved and does not change the existing semantic token. If Figma requires white text, record the unresolved design/accessibility conflict.
- Do not silently change palette or semantic token values. Recheck the actual foreground, background, size, and weight whenever a component is implemented.
- Default to an AA-compliant combination; assess disabled and focus states separately, preserve keyboard focus, and do not use color as the only carrier of critical meaning.
