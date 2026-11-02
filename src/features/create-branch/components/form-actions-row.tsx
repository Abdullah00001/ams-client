/**
 * @fileoverview Form Actions Row Component
 * @module features/create-branch/components/form-actions-row
 */

"use client";

import { Plus } from "lucide-react";
import styles from "../styles/form-actions-row.module.css";

interface FormActionsRowProps {
  onSaveDraft: () => void;
  onReset: () => void;
}

export function FormActionsRow({ onSaveDraft, onReset }: FormActionsRowProps) {
  return (
    <div className={styles.formActionsRow}>
      <button
        type="button"
        onClick={onSaveDraft}
        className={styles.draftButton}
      >
        Save as Draft
      </button>
      <button
        type="button"
        onClick={onReset}
        className={styles.resetButton}
      >
        Reset
      </button>
      <button type="submit" className={styles.submitButton}>
        <Plus size={16} /> Save Branch
      </button>
    </div>
  );
}
