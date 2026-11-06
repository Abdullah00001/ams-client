/**
 * @fileoverview Student Success Modal Component
 * @module features/create-student/components/student-success-modal
 */

"use client";

import { Users } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import type { CreatedStudentSummary } from "../types";
import { formatBDT } from "../lib";
import styles from "../styles/student-success-modal.module.css";

interface StudentSuccessModalProps {
  isOpen: boolean;
  student: CreatedStudentSummary | null;
  onOpenInvoice: () => void;
  onCreateAnother: () => void;
  onViewAllStudents: () => void;
}

export function StudentSuccessModal({
  isOpen,
  student,
  onOpenInvoice,
  onCreateAnother,
  onViewAllStudents,
}: StudentSuccessModalProps) {
  if (!student) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCreateAnother}
      onConfirm={onOpenInvoice}
      title="Student Added Successfully!"
      confirmLabel="Generate Invoice"
      cancelLabel="Register Another"
      variant="success"
      confirmVariant="primary"
      description={
        <div className={styles.modalBody}>
          <div className={styles.badgeRow}>
            <span className={styles.studentIdBadge}>Student ID: #{student.studentId}</span>
            <span className={styles.statusBadge}>{student.status}</span>
          </div>

          <p className={styles.leadText}>
            <strong>{student.fullName}</strong> has been enrolled in{" "}
            <strong>{student.courseName}</strong> ({student.batchName}) at{" "}
            <strong>{student.branchName}</strong>.
          </p>

          <div className={styles.feeSnapshot}>
            <div className={styles.feeItem}>
              <span className={styles.feeLabel}>Net Tuition:</span>
              <span className={styles.feeVal}>{formatBDT(student.netFee)}</span>
            </div>
            <div className={styles.feeItem}>
              <span className={styles.feeLabel}>Paid at Admission:</span>
              <span className={styles.feePaid}>{formatBDT(student.paidAmount)}</span>
            </div>
            <div className={styles.feeItem}>
              <span className={styles.feeLabel}>Remaining Due:</span>
              <span className={styles.feeDue}>{formatBDT(student.dueAmount)}</span>
            </div>
          </div>

          <div className={styles.secondaryLinks}>
            <button
              type="button"
              onClick={onViewAllStudents}
              className={styles.allStudentsLink}
            >
              <Users size={14} />
              <span>Go to All Students List</span>
            </button>
          </div>
        </div>
      }
    />
  );
}
