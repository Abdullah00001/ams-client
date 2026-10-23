import { ChevronLeft, ChevronRight } from "lucide-react";
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
      className={styles.sidebarToggle}
      onClick={onToggle}
      type="button"
    >
      {isSidebarCollapsed ? (
        <ChevronRight aria-hidden="true" />
      ) : (
        <ChevronLeft aria-hidden="true" />
      )}
    </button>
  );
}
