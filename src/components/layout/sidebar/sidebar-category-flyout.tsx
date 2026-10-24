import { Popover } from "@base-ui/react/popover";
import type { SidebarNavigationGroup } from "./navigation-data";
import { SidebarNavigationItem } from "./sidebar-navigation-item";
import styles from "./sidebar.module.css";

type SidebarCategoryFlyoutProps = {
  group: SidebarNavigationGroup;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function SidebarCategoryFlyout({ group, isOpen, onOpenChange }: SidebarCategoryFlyoutProps) {
  const CategoryIcon = group.icon;
  const headingId = `sidebar-flyout-${group.id}-heading`;

  return (
    <Popover.Root modal={false} onOpenChange={onOpenChange} open={isOpen}>
      <Popover.Trigger
        aria-label={group.label}
        className={styles.collapsedCategoryTrigger}
        closeDelay={120}
        delay={0}
        openOnHover
        title={group.label}
        type="button"
      >
        <CategoryIcon aria-hidden="true" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner
          align="start"
          collisionAvoidance={{ align: "shift", fallbackAxisSide: "none", side: "flip" }}
          collisionPadding={12}
          positionMethod="fixed"
          side="right"
          // The compact trigger ends 12px before the rail edge; this aligns the panel to that edge.
          sideOffset={12}
        >
          <Popover.Popup
            aria-labelledby={headingId}
            className={styles.categoryFlyout}
            data-sidebar-flyout={group.id}
            initialFocus={(openType) => {
              if (openType !== "keyboard") {
                return false;
              }

              return document.querySelector<HTMLElement>(
                `[data-sidebar-flyout="${group.id}"] a[href], [data-sidebar-flyout="${group.id}"] [tabindex="0"]`,
              );
            }}
            role="region"
          >
            <h2 className={styles.categoryFlyoutHeading} id={headingId}>
              {group.label}
            </h2>
            <nav aria-label={`${group.label} navigation`}>
              <ul className={styles.categoryFlyoutList}>
                {group.items.map((item) => (
                  <SidebarNavigationItem
                    className={styles.categoryFlyoutItem}
                    item={item}
                    key={item.label}
                    showIcon={false}
                    tabbableWhenUnavailable
                  />
                ))}
              </ul>
            </nav>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
