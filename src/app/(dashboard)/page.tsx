/**
 * @fileoverview Main Academy Dashboard Page
 * @module app/(dashboard)/page
 *
 * Primary landing view of the Academy Management System (AMS).
 * Organizes the 4 distinct layout sections:
 *  - Header & 5-minute Auto-Refresh Indicator
 *  - Row 1: 4 Key Metric Stat Cards
 *  - Row 2: Fees Collection Overview Bar Chart
 *  - Row 3: 2-Column Split (Enrollment Line Chart + Top Branches Donut Chart)
 *  - Row 4: 50/50 Split (Latest Enrollments Table + Recent Activity Feed)
 */

import {
  DashboardHeader,
  StatCards,
  RevenueChart,
  EnrollmentChart,
  TopBranches,
  LatestEnrollments,
  RecentActivityFeed,
} from "@/features/dashboard";
import styles from "@/app/(dashboard)/page.module.css";

/**
 * Dashboard root page component.
 *
 * @component
 * @returns {JSX.Element} Composed responsive dashboard dashboard view
 */
export default function DashboardPage() {
  return (
    <div className={styles.page}>
      {/* Dashboard Top Header & Auto-Refresh Indicator */}
      <DashboardHeader userName="Admin" />

      {/* Row 1: 4 Key Performance Stat Cards */}
      <StatCards />

      {/* Row 2: Fees Collection Overview (Bar Chart) */}
      <RevenueChart />

      {/* Row 3: Two Columns (Student Enrollment Trends + Top Branches) */}
      <div className={styles.rowTwoColumns}>
        <EnrollmentChart />
        <TopBranches />
      </div>

      {/* Row 4: Two Columns 50/50 (Latest Enrollments Table + Recent Activity Feed) */}
      <div className={styles.rowFourColumns}>
        <LatestEnrollments />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
