import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import styles from "./sidebar.module.css";

type SidebarToggleProps = {
  isSidebarCollapsed: boolean;
  onToggle: () => void;
};

export function SidebarToggle({ isSidebarCollapsed, onToggle }: SidebarToggleProps) {
  const accessibleName = isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar";

  return (
    <button
      aria-label={accessibleName}
      aria-pressed={isSidebarCollapsed}
      className={clsx(
        styles.sidebarToggle,
        isSidebarCollapsed && styles.sidebarToggleCollapsed
      )}
      onClick={onToggle}
      type="button"
    >
      <span className={styles.toggleArrow}>
        <ArrowLeft aria-hidden="true" size={14} strokeWidth={2} />
      </span>
    </button>
  );
}
