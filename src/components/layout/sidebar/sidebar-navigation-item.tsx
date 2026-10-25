"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { SidebarNavigationItem as SidebarNavigationItemData } from "./navigation-data";
import { createRipple } from "./sidebar-ripple";
import styles from "./sidebar.module.css";

type SidebarNavigationItemProps = {
  className?: string;
  item: SidebarNavigationItemData;
  showIcon?: boolean;
  tabbableWhenUnavailable?: boolean;
};

export function SidebarNavigationItem({
  className,
  item,
  showIcon = true,
  tabbableWhenUnavailable = false,
}: SidebarNavigationItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;
  const isCurrentPage =
    item.kind === "implemented" &&
    (pathname === item.href || (item.href === "/" && pathname === "/dashboard"));
  const itemContent = (
    <>
      {showIcon ? (
        <Icon aria-hidden="true" className={styles.navigationIcon} size={17} strokeWidth={1.9} />
      ) : null}
      <span className={styles.navigationLabel}>{item.label}</span>
    </>
  );
  const itemClassName = clsx(styles.navigationItem, isCurrentPage && styles.currentItem, className);

  if (item.kind === "implemented") {
    return (
      <li>
        <Link
          aria-current={isCurrentPage ? "page" : undefined}
          aria-label={item.label}
          className={itemClassName}
          href={item.href}
          onClick={(e) => createRipple(e, isCurrentPage)}
        >
          {itemContent}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <span
        aria-disabled="true"
        aria-label={`${item.label}, unavailable in this release`}
        className={itemClassName}
        onClick={(e) => createRipple(e, false)}
        tabIndex={tabbableWhenUnavailable ? 0 : undefined}
      >
        {itemContent}
      </span>
    </li>
  );
}
