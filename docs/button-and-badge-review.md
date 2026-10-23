# Button and Badge Review

No preview route is configured, and this chunk does not add one. Review these components in the first consuming screen before design sign-off.

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

<Button>Save changes</Button>
<Button type="submit" variant="secondary">Submit</Button>
<Badge tone="success">Active</Badge>
```

Manual review checklist:

- Tab to each enabled button: the 3px focus ring must be visible and unobscured.
- Confirm default buttons do not submit forms; confirm `type="submit"` does.
- Confirm disabled buttons cannot be activated by pointer or keyboard.
- Confirm badge text names the status; the color accent is supplementary, not the only signal.
- Review the provisional dark-text primary button foreground against approved Figma evidence when available.
