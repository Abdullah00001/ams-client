/**
 * @fileoverview Students Search Toolbar Component
 * @module features/students/components/students-filter-toolbar
 *
 * Slim search row rendered as the first row inside the table card.
 * Dropdown filters live in <StudentsFilterCard> above the table card.
 */

"use client";

import { Search, X } from "lucide-react";
import type { StudentFilterParams } from "../types";
import styles from "../styles/students-filter-toolbar.module.css";

interface StudentsFilterToolbarProps {
  filters: StudentFilterParams;
  onSearchChange: (query: string) => void;
}

export function StudentsFilterToolbar({
  filters,
  onSearchChange,
}: StudentsFilterToolbarProps) {
  return (
    <div className={styles.searchToolbar}>
      <div className={styles.searchGroup}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, ID, phone..."
          className={styles.searchInput}
          aria-label="Search students"
        />
        {filters.searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className={styles.clearSearchBtn}
            aria-label="Clear search query"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
