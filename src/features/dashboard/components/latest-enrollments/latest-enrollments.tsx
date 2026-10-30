/**
 * @fileoverview Latest Enrollments Table Component (Row 4 Left)
 * @module features/dashboard/components/latest-enrollments
 *
 * Renders the last 10 enrollments table across all branches, showing:
 *  - Student Name & Avatar
 *  - Branch Badge (DSCA / GBTA)
 *  - Amount Paid
 *  - Enrollment Date
 *
 * Each row is clickable with Material UI touch ripple feedback and
 * deep-links to `/admin/students/{id}`.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import {
  LATEST_ENROLLMENTS_DATA,
  type EnrollmentItem,
} from "./latest-enrollments-data";
import styles from "./latest-enrollments.module.css";

/**
 * Props for LatestEnrollments.
 */
type LatestEnrollmentsProps = {
  /** Optional custom enrollment records (defaults to mock log) */
  data?: EnrollmentItem[];
};

/**
 * Latest Enrollments table card component.
 *
 * @component
 * @param {LatestEnrollmentsProps} props - Component props
 * @returns {JSX.Element} Interactive enrollment table card
 */
export function LatestEnrollments({
  data = LATEST_ENROLLMENTS_DATA,
}: LatestEnrollmentsProps) {
  const router = useRouter();

  const handleRowClick = (
    event: MouseEvent<HTMLTableRowElement>,
    studentId: string,
  ) => {
    createTouchRipple(event, "light");
    router.push(`/admin/students/${studentId}`);
  };

  return (
    <section aria-label="Recent Enrollments" className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Recent Enrollments</h2>
          <p className={styles.subtitle}>
            Manage and track recent enrollments across branches efficiently.
          </p>
        </div>

        {/* View All Link matching screenshot */}
        <Link
          className={styles.viewAllLink}
          href="/admin/students"
          onClick={(e) => createTouchRipple(e, "light")}
        >
          <span>View All</span>
          <ArrowRight aria-hidden="true" className={styles.viewAllIcon} />
        </Link>
      </div>

      {/* Responsive Table Container */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.th}>Student Name</th>
              <th className={styles.th}>Branch</th>
              <th className={styles.th}>Amount Paid</th>
              <th className={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((enrollment) => {
              const isDsca = enrollment.branch === "DSCA";

              return (
                <tr
                  className={styles.tableRow}
                  key={enrollment.id}
                  onClick={(e) => handleRowClick(e, enrollment.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/admin/students/${enrollment.id}`);
                    }
                  }}
                >
                  {/* Student Name & Course */}
                  <td className={styles.td}>
                    <div className={styles.studentCell}>
                      <div aria-hidden="true" className={styles.avatar}>
                        {enrollment.initials}
                      </div>
                      <div className={styles.studentMeta}>
                        <span className={styles.studentName}>
                          {enrollment.studentName}
                        </span>
                        <span className={styles.courseName}>
                          {enrollment.course}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Branch Badge */}
                  <td className={styles.td}>
                    <span
                      className={`${styles.branchBadge} ${
                        isDsca ? styles.branchDsca : styles.branchGbta
                      }`}
                    >
                      {enrollment.branch}
                    </span>
                  </td>

                  {/* Amount Paid */}
                  <td className={styles.td}>
                    <span className={styles.amountCell}>
                      {enrollment.amountFormatted}
                    </span>
                  </td>

                  {/* Date */}
                  <td className={styles.td}>
                    <span className={styles.dateText}>{enrollment.date}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
