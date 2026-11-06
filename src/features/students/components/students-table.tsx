/**
 * @fileoverview Students Data Table Component
 * @module features/students/components/students-table
 */

"use client";

import { Edit3, Trash2, ChevronDown } from "lucide-react";
import type { MouseEvent } from "react";
import { DropdownMenu } from "@/components/ui/dropdown";
import { createTouchRipple } from "@/lib/touch-ripple";
import type {
  CertificateStatus,
  PaymentStatus,
  Student,
  StudentQuickAction,
  StudentStatus,
} from "../types";
import {
  getCertificateStatusBadge,
  getPaymentStatusBadge,
  getStudentAvatarPalette,
  getStudentStatusBadge,
} from "../lib";
import styles from "../styles/students-table.module.css";

interface StudentsTableProps {
  students: Student[];
  pageSize?: number;
  currentPage?: number;
  onAction: (action: StudentQuickAction, student: Student, extraPayload?: unknown) => void;
}

export function StudentsTable({
  students,
  pageSize = 10,
  currentPage = 1,
  onAction,
}: StudentsTableProps) {
  const handleRowClick = (student: Student, e: MouseEvent<HTMLTableRowElement>) => {
    createTouchRipple(e, "dark");
    onAction("view", student);
  };

  const handleRipple = (e: MouseEvent<HTMLElement>, callback: () => void) => {
    e.stopPropagation();
    createTouchRipple(e, "dark");
    callback();
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colSl} />
          <col className={styles.colName} />
          <col className={styles.colContact} />
          <col className={styles.colBranch} />
          <col className={styles.colCourse} />
          <col className={styles.colPayment} />
          <col className={styles.colCertificate} />
          <col className={styles.colStatus} />
          <col className={styles.colActions} />
        </colgroup>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.th} scope="col">SL</th>
            <th className={styles.th} scope="col">Student Name</th>
            <th className={styles.th} scope="col">Contact</th>
            <th className={styles.th} scope="col">Branch</th>
            <th className={styles.th} scope="col">Course / Batch</th>
            <th className={styles.th} scope="col">Payment</th>
            <th className={styles.th} scope="col">Certificate</th>
            <th className={styles.th} scope="col">Status</th>
            <th className={`${styles.th} ${styles.thAction}`} scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => {
            const serialNumber = String((currentPage - 1) * pageSize + index + 1).padStart(2, "0");
            const avatarColor = getStudentAvatarPalette(student.id + student.name);
            const statusConfig = getStudentStatusBadge(student.status);
            const paymentConfig = getPaymentStatusBadge(student.paymentStatus);
            const certConfig = getCertificateStatusBadge(student.certificateStatus);

            return (
              <tr
                key={student.id}
                className={styles.row}
                onClick={(e) => handleRowClick(student, e)}
                title={`Click to view profile of ${student.name}`}
              >
                {/* SL (Serial Number) */}
                <td className={styles.td}>
                  <span className={styles.slText}>{serialNumber}</span>
                </td>

                {/* Student Name & Avatar */}
                <td className={styles.td}>
                  <div className={styles.studentCell}>
                    <div
                      className={styles.avatar}
                      style={{
                        backgroundColor: avatarColor.bg,
                        color: avatarColor.text,
                        borderColor: avatarColor.border,
                      }}
                    >
                      {student.initials}
                    </div>
                    <div className={styles.studentInfo}>
                      <span className={styles.studentName}>{student.name}</span>
                      <span className={styles.studentEmail}>{student.email}</span>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className={styles.td}>
                  <span className={styles.contactText}>{student.phone}</span>
                </td>

                {/* Branch */}
                <td className={styles.td}>
                  <span className={styles.branchTag}>{student.branch}</span>
                </td>

                {/* Course & Batch */}
                <td className={styles.td}>
                  <div className={styles.courseInfo}>
                    <span className={styles.courseTag}>{student.course}</span>
                    <span className={styles.batchText}>{student.batch}</span>
                  </div>
                </td>

                {/* Payment Status Dropdown Menu */}
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        className={styles.statusPill}
                        style={{
                          backgroundColor: paymentConfig.bg,
                          color: paymentConfig.color,
                          borderColor: paymentConfig.border,
                        }}
                        title={`Payment: ${student.paymentStatus} (Click to change)`}
                      >
                        <span className={styles.pillDot} />
                        <span>{paymentConfig.label}</span>
                        <ChevronDown size={11} />
                      </button>
                    }
                    items={[
                      {
                        label: "Mark as Complete",
                        onClick: () => onAction("change-payment", student, "Complete" as PaymentStatus),
                      },
                      {
                        label: "Mark as Due",
                        onClick: () => onAction("change-payment", student, "Due" as PaymentStatus),
                      },
                    ]}
                  />
                </td>

                {/* Certificate Status Dropdown Menu */}
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        className={styles.statusPill}
                        style={{
                          backgroundColor: certConfig.bg,
                          color: certConfig.color,
                          borderColor: certConfig.border,
                        }}
                        title={`Certificate: ${student.certificateStatus} (Click to change)`}
                      >
                        <span className={styles.pillDot} />
                        <span>{certConfig.label}</span>
                        <ChevronDown size={11} />
                      </button>
                    }
                    items={[
                      {
                        label: "Mark as Issued",
                        onClick: () => onAction("change-certificate", student, "Issued" as CertificateStatus),
                      },
                      {
                        label: "Mark as Pending",
                        onClick: () => onAction("change-certificate", student, "Pending" as CertificateStatus),
                      },
                    ]}
                  />
                </td>

                {/* Active Progression Status Dropdown Menu */}
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu
                    trigger={
                      <button
                        type="button"
                        className={styles.statusPill}
                        style={{
                          backgroundColor: statusConfig.bg,
                          color: statusConfig.color,
                          borderColor: statusConfig.border,
                        }}
                        title={`Status: ${student.status} (Click to change)`}
                      >
                        <span className={styles.pillDot} />
                        <span>{statusConfig.label}</span>
                        <ChevronDown size={11} />
                      </button>
                    }
                    items={[
                      {
                        label: "Set ACTIVE",
                        onClick: () => onAction("change-status", student, "ACTIVE" as StudentStatus),
                      },
                      {
                        label: "Set ON-GOING",
                        onClick: () => onAction("change-status", student, "ON-GOING" as StudentStatus),
                      },
                      {
                        label: "Set COMPLETED",
                        onClick: () => onAction("change-status", student, "COMPLETED" as StudentStatus),
                      },
                      {
                        label: "Set IN-ACTIVE",
                        onClick: () => onAction("change-status", student, "IN-ACTIVE" as StudentStatus),
                      },
                    ]}
                  />
                </td>

                {/* Quick Actions (Edit & Delete only — matching Branches Table) */}
                <td className={`${styles.td} ${styles.tdAction}`} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.actionsCell}>
                    {/* Edit */}
                    <button
                      type="button"
                      className={styles.actionButton}
                      title={`Edit ${student.name}`}
                      aria-label={`Edit ${student.name}`}
                      onClick={(e) => handleRipple(e, () => onAction("edit", student))}
                    >
                      <Edit3 className={styles.actionIcon} />
                    </button>

                    {/* Remove / Delete */}
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      title={`Remove ${student.name}`}
                      aria-label={`Remove ${student.name}`}
                      onClick={(e) => handleRipple(e, () => onAction("delete", student))}
                    >
                      <Trash2 className={styles.actionIcon} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Fixed-slot Empty Rows: Keeps consistent table height */}
          {Array.from({ length: Math.max(0, pageSize - students.length) }).map((_, index) => (
            <tr key={`empty-slot-${index}`} className={styles.emptyRow} aria-hidden="true">
              <td className={styles.td}>
                <div className={styles.emptyCellPlaceholder}>&nbsp;</div>
              </td>
              <td className={styles.td}>&nbsp;</td>
              <td className={styles.td}>&nbsp;</td>
              <td className={styles.td}>&nbsp;</td>
              <td className={styles.td}>&nbsp;</td>
              <td className={styles.td}>&nbsp;</td>
              <td className={styles.td}>&nbsp;</td>
              <td className={styles.td}>&nbsp;</td>
              <td className={`${styles.td} ${styles.tdAction}`}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

