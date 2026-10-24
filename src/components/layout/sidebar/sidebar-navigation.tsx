import { type RefObject, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import {
  navigationItems,
  type SidebarNavigationGroup,
  type SidebarNavigationGroupId,
} from "./navigation-data";
import { SidebarCategoryFlyout } from "./sidebar-category-flyout";
import { SidebarNavigationItem } from "./sidebar-navigation-item";
import styles from "./sidebar.module.css";

type SidebarNavigationProps = {
  isSidebarCollapsed: boolean;
  navigationSearchRef: RefObject<HTMLInputElement | null>;
  onCollapsedSearchActivate: () => void;
  onSearchQueryChange: (query: string) => void;
  searchQuery: string;
};

type SidebarNavigationGroupProps = {
  group: SidebarNavigationGroup;
  isGroupExpanded: boolean;
  onExpandedChange: (groupId: SidebarNavigationGroupId) => void;
};

export function SidebarNavigation({
  isSidebarCollapsed,
  navigationSearchRef,
  onCollapsedSearchActivate,
  onSearchQueryChange,
  searchQuery,
}: SidebarNavigationProps) {
  const [expandedGroups, setExpandedGroups] = useState<
    Partial<Record<SidebarNavigationGroupId, boolean>>
  >({});
  const [openFlyoutGroupId, setOpenFlyoutGroupId] = useState<SidebarNavigationGroupId | null>(null);
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const isSearching = normalizedQuery.length > 0;
  const visibleGroups = navigationItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.label.toLocaleLowerCase().includes(normalizedQuery)),
    }))
    .filter((group) => group.items.length > 0) as SidebarNavigationGroup[];

  function toggleNavigationGroup(groupId: SidebarNavigationGroupId) {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [groupId]: !(currentGroups[groupId] ?? true),
    }));
  }

  function handleFlyoutOpenChange(groupId: SidebarNavigationGroupId, isOpen: boolean) {
    setOpenFlyoutGroupId((currentGroupId) => {
      if (isOpen) {
        return groupId;
      }

      return currentGroupId === groupId ? null : currentGroupId;
    });
  }

  return (
    <>
      <button
        aria-label="Search navigation"
        className={styles.collapsedSearchButton}
        onClick={onCollapsedSearchActivate}
        type="button"
      >
        <Search aria-hidden="true" />
      </button>
      <form
        className={styles.searchForm}
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        <label className={styles.visuallyHidden} htmlFor="sidebar-navigation-search">
          Search sidebar navigation
        </label>
        <Search aria-hidden="true" className={styles.searchIcon} size={18} strokeWidth={2.5} />
        <input
          className={styles.searchInput}
          id="sidebar-navigation-search"
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Quick Search"
          ref={navigationSearchRef}
          type="search"
          value={searchQuery}
        />
      </form>

      <nav aria-label="Super Admin primary navigation" className={styles.navigation}>
        {isSidebarCollapsed ? (
          <CollapsedSidebarNavigation
            groups={visibleGroups}
            onFlyoutOpenChange={handleFlyoutOpenChange}
            openFlyoutGroupId={openFlyoutGroupId}
          />
        ) : (
          <ExpandedSidebarNavigation
            expandedGroups={expandedGroups}
            groups={visibleGroups}
            isSearching={isSearching}
            onExpandedChange={toggleNavigationGroup}
          />
        )}

        {visibleGroups.length === 0 ? (
          <p className={styles.emptySearchResult} role="status">
            No navigation items match “{searchQuery}”.
          </p>
        ) : null}
      </nav>
    </>
  );
}

type ExpandedSidebarNavigationProps = {
  expandedGroups: Partial<Record<SidebarNavigationGroupId, boolean>>;
  groups: SidebarNavigationGroup[];
  isSearching: boolean;
  onExpandedChange: (groupId: SidebarNavigationGroupId) => void;
};

function ExpandedSidebarNavigation({
  expandedGroups,
  groups,
  isSearching,
  onExpandedChange,
}: ExpandedSidebarNavigationProps) {
  return groups.map((group) => (
    <SidebarNavigationGroup
      group={group}
      isGroupExpanded={isSearching || expandedGroups[group.id] !== false}
      key={group.id}
      onExpandedChange={onExpandedChange}
    />
  ));
}

type CollapsedSidebarNavigationProps = {
  groups: SidebarNavigationGroup[];
  onFlyoutOpenChange: (groupId: SidebarNavigationGroupId, isOpen: boolean) => void;
  openFlyoutGroupId: SidebarNavigationGroupId | null;
};

function CollapsedSidebarNavigation({
  groups,
  onFlyoutOpenChange,
  openFlyoutGroupId,
}: CollapsedSidebarNavigationProps) {
  const dashboardGroup = groups.find((group) => group.id === "platform");
  const categoryGroups = groups.filter((group) => group.collapsible);

  return (
    <div className={styles.collapsedNavigationGroups}>
      {dashboardGroup ? (
        <ul className={styles.collapsedDashboardList}>
          {dashboardGroup.items.map((item) => (
            <SidebarNavigationItem item={item} key={item.label} />
          ))}
        </ul>
      ) : null}

      <div className={styles.collapsedCategoryList}>
        {categoryGroups.map((group) => (
          <SidebarCategoryFlyout
            group={group}
            isOpen={openFlyoutGroupId === group.id}
            key={group.id}
            onOpenChange={(isOpen) => onFlyoutOpenChange(group.id, isOpen)}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarNavigationGroup({
  group,
  isGroupExpanded,
  onExpandedChange,
}: SidebarNavigationGroupProps) {
  const headingId = `sidebar-group-${group.id}`;
  const listId = `${headingId}-items`;
  const GroupIcon = group.icon;
  const isDashboardGroup = group.id === "platform";

  return (
    <section aria-labelledby={headingId} className={styles.group}>
      {isDashboardGroup ? (
        <h2 className={styles.visuallyHidden} id={headingId}>
          {group.label}
        </h2>
      ) : (
        <h2 className={styles.groupHeading} id={headingId}>
          <button
            aria-controls={listId}
            aria-expanded={isGroupExpanded}
            className={styles.groupTrigger}
            onClick={() => onExpandedChange(group.id)}
            type="button"
          >
            <span className={styles.groupTriggerLabel}>
              <GroupIcon aria-hidden="true" className={styles.groupIcon} />
              <span>{group.label}</span>
            </span>
            {isGroupExpanded ? (
              <ChevronDown aria-hidden="true" />
            ) : (
              <ChevronRight aria-hidden="true" />
            )}
          </button>
        </h2>
      )}

      <ul
        className={isDashboardGroup ? styles.navigationList : styles.nestedNavigationList}
        hidden={group.collapsible && !isGroupExpanded}
        id={listId}
      >
        {group.items.map((item) => (
          <SidebarNavigationItem item={item} key={item.label} showIcon={isDashboardGroup} />
        ))}
      </ul>
    </section>
  );
}
