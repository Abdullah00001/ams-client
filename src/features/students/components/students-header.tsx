/**
 * @fileoverview Students Page Header Component
 * @module features/students/components/students-header
 */

"use client";

import { Download, Plus } from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import styles from "../styles/students-header.module.css";

interface StudentsHeaderProps {
  totalCount: number;
  onAddNewStudent: () => void;
  onExportData: () => void;
}

export function StudentsHeader({
  totalCount,
  onAddNewStudent,
  onExportData,
}: StudentsHeaderProps) {
  const handleRipple = (e: MouseEvent<HTMLButtonElement>, callback: () => void) => {
    createTouchRipple(e, "light");
    callback();
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>All Students</h1>
          <span className={styles.countBadge}>{totalCount} Total</span>
        </div>
        <p className={styles.subtitle}>
          Super Admin has full authority to view, filter, track payments, certificates, and manage students across branches.
        </p>
      </div>

      <div className={styles.actionsGroup}>
        {/* Export Data Button */}
        <button
          type="button"
          className={styles.exportButton}
          onClick={(e) => handleRipple(e, onExportData)}
          aria-label="Export students data as CSV"
        >
          <Download className={styles.buttonIcon} />
          <span>Export Data</span>
        </button>

        {/* Add New Student Button */}
        <button
          type="button"
          className={styles.createButton}
          onClick={(e) => handleRipple(e, onAddNewStudent)}
          aria-label="Add new student with full profile"
        >
          <Plus className={styles.buttonIcon} />
          <span>Add Student</span>
        </button>
      </div>
    </header>
  );
}

