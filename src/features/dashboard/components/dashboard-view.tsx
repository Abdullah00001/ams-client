/**
 * @fileoverview Main Dashboard View Component
 * @module features/dashboard/components/dashboard-view
 *
 * Primary coordinator assembling the 4 dashboard rows:
 *  - Header & 5-minute Auto-Refresh Indicator
 *  - Row 1: 4 Key Metric Stat Cards
 *  - Row 2: Fees Collection Overview Bar Chart
 *  - Row 3: 2-Column Split (Enrollment Line Chart + Top Branches Donut Chart)
 *  - Row 4: 50/50 Split (Latest Enrollments Table + Recent Activity Feed)
 */

"use client";

import { DashboardHeader } from "./dashboard-header";
import { StatCards } from "./stat-cards";
import { RevenueChart } from "./revenue-chart";
import { EnrollmentChart } from "./enrollment-chart";
import { TopBranches } from "./top-branches";
import { LatestEnrollments } from "./latest-enrollments";
import { RecentActivityFeed } from "./recent-activity";
import styles from "../styles/dashboard-view.module.css";

export function DashboardView() {
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
