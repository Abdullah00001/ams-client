/**
 * @fileoverview Student Invoice & Receipt Modal Component
 * @module features/create-student/components/student-invoice-modal
 */

"use client";

import { Download, Mail, Printer, X } from "lucide-react";
import type { CreatedStudentSummary } from "../types";
import { formatBDT, formatDateDisplay } from "../lib";
import styles from "../styles/student-invoice-modal.module.css";

interface StudentInvoiceModalProps {
  isOpen: boolean;
  student: CreatedStudentSummary | null;
  onClose: () => void;
  onDownloadSlip: () => void;
  onPrint: () => void;
  onDirectEmail: () => void;
}

export function StudentInvoiceModal({
  isOpen,
  student,
  onClose,
  onDownloadSlip,
  onPrint,
  onDirectEmail,
}: StudentInvoiceModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modalCard}>
        {/* Modal Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.topBarTitle}>
            <span className={styles.invoiceTag}>OFFICIAL RECEIPT</span>
            <span>Invoice #{student.studentId}-2026</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close invoice"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Invoice Canvas */}
        <div className={styles.invoiceCanvas}>
          {/* Header */}
          <div className={styles.invoiceHeader}>
            <div>
              <h2 className={styles.academyName}>Brew Desk Academy</h2>
              <p className={styles.academySub}>Dhaka Specialty Coffee & Barista Academy</p>
            </div>
            <div className={styles.invoiceMetaRight}>
              <span className={styles.metaDate}>
                Date: {formatDateDisplay(student.enrollmentDate)}
              </span>
              <span className={styles.metaStatus}>
                Status: <strong>{student.dueAmount === 0 ? "PAID IN FULL" : "PARTIAL DUE"}</strong>
              </span>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Student & Course Details Grid */}
          <div className={styles.detailsGrid}>
            <div className={styles.infoCol}>
              <span className={styles.colTitle}>Student Information</span>
              <span className={styles.infoValue}><strong>{student.fullName}</strong></span>
              <span className={styles.infoSub}>ID: #{student.studentId}</span>
              <span className={styles.infoSub}>Contact: {student.phone}</span>
              <span className={styles.infoSub}>Email: {student.email}</span>
            </div>

            <div className={styles.infoCol}>
              <span className={styles.colTitle}>Enrollment Details</span>
              <span className={styles.infoValue}><strong>{student.courseName}</strong></span>
              <span className={styles.infoSub}>Batch: {student.batchName}</span>
              <span className={styles.infoSub}>Campus: {student.branchName}</span>
              <span className={styles.infoSub}>Payment: {student.paymentType.toUpperCase()}</span>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <table className={styles.feeTable}>
            <thead>
              <tr>
                <th>Description</th>
                <th className={styles.thRight}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Course Tuition & Certification Fee</td>
                <td className={styles.tdRight}>{formatBDT(student.baseFee)}</td>
              </tr>
              {student.discountAmount > 0 ? (
                <tr>
                  <td className={styles.discountRow}>Scholarship / Discount Waiver</td>
                  <td className={`${styles.tdRight} ${styles.discountRow}`}>
                    -{formatBDT(student.discountAmount)}
                  </td>
                </tr>
              ) : null}
              <tr className={styles.netRow}>
                <td><strong>Total Net Payable Fee</strong></td>
                <td className={styles.tdRight}><strong>{formatBDT(student.netFee)}</strong></td>
              </tr>
              <tr className={styles.paidRow}>
                <td>Amount Paid at Admission</td>
                <td className={styles.tdRight}>{formatBDT(student.paidAmount)}</td>
              </tr>
              <tr className={styles.dueRow}>
                <td><strong>Remaining Balance Due</strong></td>
                <td className={styles.tdRight}><strong>{formatBDT(student.dueAmount)}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* Installment Schedule if applicable */}
          {student.installments.length > 0 ? (
            <div className={styles.installmentSection}>
              <span className={styles.scheduleHeading}>Installment Milestone Breakdown:</span>
              <div className={styles.installmentPills}>
                {student.installments.map((ins) => (
                  <div key={ins.installmentNumber} className={styles.installmentPill}>
                    <span className={styles.pillLabel}>{ins.label}</span>
                    <span className={styles.pillAmount}>{formatBDT(ins.amount)}</span>
                    <span className={styles.pillDate}>{formatDateDisplay(ins.dueDate)}</span>
                    <span
                      className={ins.status === "paid" ? styles.pillPaid : styles.pillPending}
                    >
                      {ins.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Action Footer */}
        <div className={styles.footerActions}>
          <div className={styles.actionGroup}>
            <button
              type="button"
              onClick={onDownloadSlip}
              className={styles.actionBtnPrimary}
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className={styles.actionBtnSecondary}
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onDirectEmail}
              className={styles.actionBtnSecondary}
            >
              <Mail size={15} />
              <span>Direct Email</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.doneBtn}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

