/**
 * @fileoverview Students Table Header Toolbar Component
 * @module features/students/components/students-filter-toolbar
 *
 * Implements the Figma Table Card Header with:
 * - Left: "Students List" title (16px, font-weight 600) + "10x Per Page" subtitle
 * - Right: Live search input with search icon
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
    <div className={styles.tableHeaderToolbar}>
      <div className={styles.tableTitleGroup}>
        <h3 className={styles.tableTitle}>Students List</h3>
        <span className={styles.tableSubtitle}>10x Per Page</span>
      </div>

      <div className={styles.searchGroup}>
        <Search className={styles.searchIcon} />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name"
          className={styles.searchInput}
          aria-label="Search students by name"
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
