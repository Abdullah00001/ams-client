# Sidebar architecture

The Super Admin sidebar is an App Router client component because it owns local UI state. Its navigation inventory remains static, typed data so content changes do not require editing rendering logic.

## Directory structure

```text
src/components/layout/sidebar/
├── navigation-data.ts       # Super Admin groups, items, icons, and route availability
├── sidebar.tsx              # Shell-level collapsed state and branding
├── sidebar-toggle.tsx       # The circular whole-sidebar control
├── sidebar-navigation.tsx   # Search, expanded disclosures, and compact-rail rendering
├── sidebar-navigation-item.tsx # Shared implemented/unimplemented item rendering
├── sidebar-category-flyout.tsx # Compact category trigger and floating navigation panel
└── sidebar.module.css       # Sidebar-specific visual styles
```

`DashboardShell` renders `Sidebar`; it does not own sidebar state. `Sidebar` owns whole-sidebar collapse and passes the current search value to `SidebarNavigation`. `SidebarNavigation` owns the independent expansion state for collapsible navigation groups.

## Navigation data model

`navigationItems` is the source of truth. Navigation items use a discriminated union:

```ts
{ kind: "implemented", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }
{ kind: "unimplemented", label: "All Branches", icon: Building2 }
```

Only an `implemented` item renders a `next/link`. An unimplemented destination intentionally renders inert, labelled content instead of a guessed URL or a fake page.

Groups also distinguish their disclosure behavior:

```ts
{
  id: "branch-management",
  label: "Branch Management",
  collapsible: true,
  items: [],
}
```

Use `collapsible: false` for a direct, single-item group such as Platform. Keep a group expanded by default unless the product design explicitly says otherwise.

## Making navigation changes

### Add a group

1. Add a unique `SidebarNavigationGroupId` union member.
2. Add the group to `navigationItems` in the required display order.
3. Choose `collapsible: true` only when the group is a meaningful multi-item disclosure.

```ts
{
  id: "communications",
  label: "Communications",
  collapsible: true,
  items: [],
}
```

### Add an item

Add the item to its group with a Lucide icon already used by the project. Use a route only after that route exists.

```ts
{ kind: "implemented", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }
{ kind: "unimplemented", label: "New Module", icon: Layers3 }
```

If an item is unimplemented, do not add a placeholder `href`, disabled link, or click handler. This prevents a control that appears navigable but leads nowhere.

## State and responsive behavior

`Sidebar` owns `isSidebarCollapsed`. It defaults to the responsive rail at `max-width: 1100px`, an engineering assumption because the supplied Figma evidence has no approved breakpoint. The circular `SidebarToggle` changes only the whole sidebar; its label is “Collapse sidebar” or “Expand sidebar.” The collapsed rail also exposes a “Search navigation” icon button. It is an engineering decision because Figma does not show collapsed search; it expands the same sidebar and moves focus to the existing search input without creating a second search state.

`SidebarNavigation` keeps group state in a local record keyed by group id. Group triggers use `aria-expanded` and `aria-controls`; collapsing a group applies the native `hidden` attribute to its item list, keeping the controlled panel reference valid while removing nested links from focus order. Search results temporarily show matching groups expanded so a match is never hidden by a prior disclosure choice.

The sidebar navigation itself is the vertical scroll container. Mobile drawers are intentionally outside this scope.

### Compact rail and category flyouts

When collapsed, Dashboard remains a direct icon link and every collapsible group becomes one category icon button. The button and its `SidebarCategoryFlyout` use the same `navigationItems` group object, so no compact-only labels, icons, or children are duplicated.

`SidebarCategoryFlyout` uses Base UI `Popover` with a body portal and viewport collision handling. This lets the panel remain adjacent to its rail trigger without being clipped by the sidebar scroller. Base UI also keeps the hover interaction open while the pointer crosses into the panel, handles outside press and Escape dismissal, and returns keyboard focus to the trigger. The sidebar controls the single open group id locally, so opening a second category closes the first one.

Opening a category flyout never changes `isSidebarCollapsed`; only `SidebarToggle` controls the full sidebar width. This separation prevents hover, click, or keyboard navigation from unexpectedly expanding the layout.

To add a compact category, add one `collapsible: true` group with its category `icon` to `navigationItems`. It will appear in both the expanded heading and compact rail automatically:

```ts
{
  id: "communications",
  label: "Communications",
  icon: Bell,
  collapsible: true,
  items: [],
}
```

## Accessibility and styling

- Native buttons provide Enter and Space activation for the sidebar and group controls.
- Links expose the current page with `aria-current="page"`; unimplemented destinations announce their unavailable state.
- Search has a visible control and programmatic label.
- Focus-visible styles cover the search field, current link, group trigger, and sidebar toggle.
- The sidebar background, active color, search surface, typography, radii, and spacing use generated `--ams-*` variables in `sidebar.module.css`.
- Compact flyouts are non-modal navigation regions, not application-command menus; no `menu` roles or menu-specific arrow-key model is imposed on ordinary links.
- Collapsed category triggers have accessible names; flyout headings label their navigation regions. Available links are keyboard reachable, and unavailable destinations remain labelled as unavailable rather than receiving invented URLs.

Figma confirms the dark `#0D0E12` sidebar, 265px expanded frame, approximately 70px logo header, 229px quick-search instance, category-heading icons, and nested visual hierarchy. The floating-panel examples establish the compact navigation pattern but not AMS-specific labels. The 76px rail, the ≤1100px breakpoint, disclosure behavior, and temporary AMS mark remain engineering assumptions until approved design assets and responsive frames are supplied. The active item intentionally uses the requested white-on-blue Figma treatment, despite its approximately 3.63:1 normal-text contrast; the visible focus outline remains white on that item.
