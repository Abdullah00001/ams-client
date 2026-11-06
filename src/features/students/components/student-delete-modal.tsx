/**
 * @fileoverview Student Deletion Confirmation Modal
 * @module features/students/components/student-delete-modal
 */

"use client";

import { Modal } from "@/components/ui/modal";
import type { Student } from "../types";
import styles from "../styles/student-delete-modal.module.css";

interface StudentDeleteModalProps {
  isOpen: boolean;
  student: Student | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function StudentDeleteModal({
  isOpen,
  student,
  onConfirm,
  onCancel,
}: StudentDeleteModalProps) {
  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Remove Student?"
      description={
        <>
          Are you sure you want to remove student{" "}
          <strong className={styles.studentHighlight}>{student.name}</strong> (ID: #{student.id}) from the system?
          This action will archive enrollment records and cannot be undone.
        </>
      }
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="delete"
      confirmVariant="delete"
    />
  );
}

