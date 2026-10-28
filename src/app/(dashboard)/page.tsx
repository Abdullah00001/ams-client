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

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <DashboardHeader userName="Admin" />
      <StatCards />
      <RevenueChart />

      {/* 2.3 Row 3 — Two Columns */}
      <div className={styles.rowTwoColumns}>
        <EnrollmentChart />
        <TopBranches />
      </div>

      {/* 2.4 Row 4 — Two Columns */}
      <div className={styles.rowFourColumns}>
        <LatestEnrollments />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
