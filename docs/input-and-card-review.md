# Input and Card Review

No Input or Card Figma specification, screenshot, or component asset is available. These are small token-based engineering baselines for review, not approved visual replicas.

```tsx
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

<Input id="student-email" label="Email address" type="email" required />
<Input
  id="student-email"
  label="Email address"
  invalid
  errorMessage="Enter a valid email address."
/>
<Card>Future dashboard content</Card>
```

Use native controlled or uncontrolled input semantics:

```tsx
<Input label="Search" value={query} onChange={(event) => setQuery(event.target.value)} />
<Input label="Filter" defaultValue="All students" />
```

## Accessibility and review notes

- `label` renders a programmatically associated `<label>`. When omitting it, provide an `aria-label`; do not use a placeholder as the label.
- `invalid` adds `aria-invalid`; `errorMessage` is associated with the input. Existing `aria-describedby` IDs are retained alongside generated helper/error IDs.
- Error text uses accessible secondary text plus the literal `Error:` label. The status-error color is a border accent only because it is not suitable for small text on white.
- Input boundaries use `color.text.secondary` for sufficient contrast. Card's `color.border.subtle` is a restrained visual grouping treatment and needs Figma/context review before being treated as a meaningful graphical boundary.
- Card uses the observed 8px radius and 16px internal spacing tokens as a baseline; it deliberately has no shadow or dashboard-specific semantics.
- Manually verify labels, error association, native disabled/read-only behavior, focus-ring clipping, and responsive width in a consuming screen. Card remains a neutral non-focusable `<div>` without landmark semantics.
