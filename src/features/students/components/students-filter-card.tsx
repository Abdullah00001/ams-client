/**
 * @fileoverview Students Filter Card Component
 * @module features/students/components/students-filter-card
 *
 * Figma spec: display flex; padding 24px; flex-direction column;
 * align-items flex-end; gap 20px; border-radius 10px.
 * Row 1 — 4 inbuilt Dropdowns across full width.
 * Row 2 — Reset + Search buttons aligned to the right.
 */

"use client";

import { RotateCcw } from "lucide-react";
import type { MouseEvent } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { createTouchRipple } from "@/lib/touch-ripple";
import type { StudentFilterParams } from "../types";
import {
  STUDENT_BATCH_OPTIONS,
  STUDENT_BRANCH_OPTIONS,
  STUDENT_COURSE_OPTIONS,
} from "../services";
import styles from "../styles/students-filter-toolbar.module.css";

interface StudentsFilterCardProps {
  filters: StudentFilterParams;
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

/** Convert a plain string array to Dropdown option objects */
function toOptions(arr: readonly string[]) {
  return arr.map((v) => ({ value: v, label: v }));
}

export function StudentsFilterCard({
  filters,
  onBranchChange,
  onCourseChange,
  onBatchChange,
  onStatusChange,
  onResetFilters,
}: StudentsFilterCardProps) {
  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.branch !== "All Branches" ||
    filters.course !== "All Courses" ||
    filters.batch !== "All Batches" ||
    filters.status !== "All Statuses";

  return (
    <div className={styles.filtersCard}>
      {/* Row 1 — Filter dropdowns spanning full width */}
      <div className={styles.filtersGroup}>
        <Dropdown
          label="Branch"
          options={toOptions(STUDENT_BRANCH_OPTIONS)}
          value={filters.branch}
          onChange={onBranchChange}
          fullWidth
        />
        <Dropdown
          label="Course"
          options={toOptions(STUDENT_COURSE_OPTIONS)}
          value={filters.course}
          onChange={onCourseChange}
          fullWidth
        />
        <Dropdown
          label="Batch"
          options={toOptions(STUDENT_BATCH_OPTIONS)}
          value={filters.batch}
          onChange={onBatchChange}
          fullWidth
        />
        <Dropdown
          label="Status"
          options={toOptions(STATUS_OPTIONS)}
          value={filters.status}
          onChange={onStatusChange}
          fullWidth
        />
      </div>

      {/* Row 2 — Actions aligned to the right (align-items: flex-end on card) */}
      <div className={styles.cardActions}>
        <button
          type="button"
          onClick={onResetFilters}
          onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
            if (isFiltered) createTouchRipple(e, "dark");
          }}
          disabled={!isFiltered}
          className={`${styles.resetBtn} ${!isFiltered ? styles.resetBtnDisabled : ""}`}
          title={isFiltered ? "Reset all filters" : "No active filters to reset"}
          aria-disabled={!isFiltered}
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        <button
          type="button"
          className={styles.filterBtn}
          onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
            createTouchRipple(e, "light");
          }}
        >
          Filter
        </button>
      </div>
    </div>
  );
}
