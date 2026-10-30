/**
 * @fileoverview Branches Page Header Component
 * @module features/branches/components/branches-header
 *
 * Renders the top title, descriptive subtitle, and "+ Create Branch" primary action button.
 */

"use client";

import { Plus } from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import styles from "./branches-header.module.css";

type BranchesHeaderProps = {
  onCreateBranch?: () => void;
};

export function BranchesHeader({ onCreateBranch }: BranchesHeaderProps) {
  const handleRipple = (e: MouseEvent<HTMLButtonElement>) => {
    createTouchRipple(e, "light");
    if (onCreateBranch) {
      onCreateBranch();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>All Branches</h1>
        <p className={styles.subtitle}>
          Super Admin has full authority to create, configure, activate, deactivate, and delete branches.
        </p>
      </div>

      <button
        type="button"
        className={styles.createButton}
        onClick={handleRipple}
        aria-label="Create new branch"
      >
        <Plus className={styles.buttonIcon} />
        <span>Create Branch</span>
      </button>
    </header>
  );
}
