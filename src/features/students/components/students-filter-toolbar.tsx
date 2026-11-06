/**
 * @fileoverview Students Filter Toolbar Component
 * @module features/students/components/students-filter-toolbar
 */

"use client";

import { RotateCcw, Search, X } from "lucide-react";
import type { StudentFilterParams } from "../types";
import {
  STUDENT_BATCH_OPTIONS,
  STUDENT_BRANCH_OPTIONS,
  STUDENT_COURSE_OPTIONS,
} from "../services";
import styles from "../styles/students-filter-toolbar.module.css";

interface StudentsFilterToolbarProps {
  filters: StudentFilterParams;
  onSearchChange: (query: string) => void;
  onBranchChange: (branch: string) => void;
  onCourseChange: (course: string) => void;
  onBatchChange: (batch: string) => void;
  onStatusChange: (status: string) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS = [
  "All Statuses",
  "ACTIVE",
  "ON-GOING",
  "COMPLETED",
  "IN-ACTIVE",
] as const;

export function StudentsFilterToolbar({
  filters,
  onSearchChange,
  onBranchChange,
  onCourseChange,
  onBatchChange,
  onStatusChange,
  onResetFilters,
}: StudentsFilterToolbarProps) {
  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.branch !== "All Branches" ||
    filters.course !== "All Courses" ||
    filters.batch !== "All Batches" ||
    filters.status !== "All Statuses";

  return (
    <div className={styles.toolbar}>
      {/* Search Input */}
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

      {/* Dropdown Filters (Branch, Course, Batch, Status) */}
      <div className={styles.filtersGroup}>
        {/* Branch Filter */}
        <div className={styles.filterSelectWrapper}>
          <select
            value={filters.branch}
            onChange={(e) => onBranchChange(e.target.value)}
            className={`${styles.selectInput} ${
              filters.branch !== "All Branches" ? styles.selectInputActive : ""
            }`}
            aria-label="Filter by branch"
          >
            {STUDENT_BRANCH_OPTIONS.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        {/* Course Filter */}
        <div className={styles.filterSelectWrapper}>
          <select
            value={filters.course}
            onChange={(e) => onCourseChange(e.target.value)}
            className={`${styles.selectInput} ${
              filters.course !== "All Courses" ? styles.selectInputActive : ""
            }`}
            aria-label="Filter by course"
          >
            {STUDENT_COURSE_OPTIONS.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div className={styles.filterSelectWrapper}>
          <select
            value={filters.batch}
            onChange={(e) => onBatchChange(e.target.value)}
            className={`${styles.selectInput} ${
              filters.batch !== "All Batches" ? styles.selectInputActive : ""
            }`}
            aria-label="Filter by batch"
          >
            {STUDENT_BATCH_OPTIONS.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className={styles.filterSelectWrapper}>
          <select
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`${styles.selectInput} ${
              filters.status !== "All Statuses" ? styles.selectInputActive : ""
            }`}
            aria-label="Filter by progression status"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters CTA - Always visible, disabled when no filters active */}
        <button
          type="button"
          onClick={onResetFilters}
          disabled={!isFiltered}
          className={`${styles.resetBtn} ${!isFiltered ? styles.resetBtnDisabled : ""}`}
          title={isFiltered ? "Reset all filters" : "No active filters to reset"}
          aria-disabled={!isFiltered}
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}

