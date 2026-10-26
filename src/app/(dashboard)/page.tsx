import { DashboardHeader } from "@/components/dashboard/dashboard-header/dashboard-header";
import { StatCards } from "@/components/dashboard/stat-cards/stat-cards";
import styles from "@/app/(dashboard)/page.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <DashboardHeader userName="Admin" />
      <StatCards />
    </div>
  );
}
