/**
 * @fileoverview Student Form Actions Component
 * @module features/create-student/components/student-form-actions
 */

"use client";

import { Loader2, UserPlus } from "lucide-react";
import styles from "../styles/student-form-actions.module.css";

interface StudentFormActionsProps {
  isSubmitting: boolean;
  onSaveDraft: () => void;
  onReset: () => void;
}

export function StudentFormActions({
  isSubmitting,
  onSaveDraft,
  onReset,
}: StudentFormActionsProps) {
  return (
    <div className={styles.formActionsRow}>
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className={styles.draftButton}
      >
        Save as Draft
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
        className={styles.resetButton}
      >
        Reset
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className={styles.spinner} />
            <span>Registering Student...</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>Save Student</span>
          </>
        )}
      </button>
    </div>
  );
}

