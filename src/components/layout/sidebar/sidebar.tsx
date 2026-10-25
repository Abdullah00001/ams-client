"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarToggle } from "./sidebar-toggle";
import styles from "./sidebar.module.css";

const tabletQuery = "(max-width: 1100px)";

export function Sidebar() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const navigationSearchRef = useRef<HTMLInputElement>(null);
  const shouldFocusSearchRef = useRef(false);

  // Synchronize the responsive rail before paint so narrow viewports never briefly show nested rows.
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(tabletQuery);
    const syncSidebarToViewport = () => setIsSidebarCollapsed(mediaQuery.matches);

    syncSidebarToViewport();
    mediaQuery.addEventListener("change", syncSidebarToViewport);

    return () => mediaQuery.removeEventListener("change", syncSidebarToViewport);
  }, []);

  useEffect(() => {
    if (isSidebarCollapsed !== false || !shouldFocusSearchRef.current) {
      return;
    }

    navigationSearchRef.current?.focus();
    shouldFocusSearchRef.current = false;
  }, [isSidebarCollapsed]);

  function toggleSidebar() {
    const currentlyCollapsed = isSidebarCollapsed ?? window.matchMedia(tabletQuery).matches;

    setIsSidebarCollapsed(!currentlyCollapsed);
    setSearchQuery("");
  }

  function expandSidebarForSearch() {
    shouldFocusSearchRef.current = true;
    setIsSidebarCollapsed(false);
  }

  return (
    <aside
      aria-label="Super Admin sidebar"
      className={clsx(
        styles.sidebar,
        isSidebarCollapsed === true && styles.sidebarCollapsed,
        isSidebarCollapsed === false && styles.sidebarExpanded,
      )}
    >
      <div className={styles.sidebarContent}>
        <div className={styles.branding}>
          <div aria-hidden="true" className={styles.brandMark}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className={styles.brandName}>AMS</span>
        </div>

        <SidebarNavigation
          isSidebarCollapsed={isSidebarCollapsed ?? false}
          navigationSearchRef={navigationSearchRef}
          onCollapsedSearchActivate={expandSidebarForSearch}
          onSearchQueryChange={setSearchQuery}
          searchQuery={searchQuery}
        />
      </div>

      <SidebarToggle isSidebarCollapsed={isSidebarCollapsed ?? false} onToggle={toggleSidebar} />
    </aside>
  );
}
