/**
 * @fileoverview Installment Milestone Schedule Table Component
 * @module features/create-student/components/installment-schedule-table
 */

"use client";

import type { InstallmentPlanItem } from "../types";
import { formatBDT, formatDateDisplay } from "../lib";
import styles from "../styles/installment-schedule-table.module.css";

interface InstallmentScheduleTableProps {
  installments: InstallmentPlanItem[];
}

export function InstallmentScheduleTable({
  installments,
}: InstallmentScheduleTableProps) {
  if (installments.length === 0) return null;

  return (
    <div className={styles.scheduleTableWrapper}>
      <h4 className={styles.scheduleTitle}>Installment Milestone Schedule</h4>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Installment</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {installments.map((item) => (
            <tr key={item.installmentNumber}>
              <td>{item.installmentNumber}</td>
              <td className={styles.itemLabel}>{item.label}</td>
              <td>{formatDateDisplay(item.dueDate)}</td>
              <td className={styles.itemAmount}>{formatBDT(item.amount)}</td>
              <td>
                <span
                  className={
                    item.status === "paid" ? styles.statusPaid : styles.statusPending
                  }
                >
                  {item.status === "paid" ? "Paid at Admission" : "Due"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

