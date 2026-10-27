import { DashboardHeader } from "@/components/dashboard/dashboard-header/dashboard-header";
import { StatCards } from "@/components/dashboard/stat-cards/stat-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart/revenue-chart";
import { EnrollmentChart } from "@/components/dashboard/enrollment-chart/enrollment-chart";
import { TopBranches } from "@/components/dashboard/top-branches/top-branches";
import { LatestEnrollments } from "@/components/dashboard/latest-enrollments/latest-enrollments";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity/recent-activity";
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
