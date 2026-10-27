import { DashboardAutoRefresh } from "@/components/dashboard/dashboard-auto-refresh/dashboard-auto-refresh";
import styles from "./dashboard-header.module.css";

type DashboardHeaderProps = {
  userName?: string;
};

export function DashboardHeader({ userName = "Admin" }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>Welcome back, {userName}</h1>
        <p className={styles.subtitle}>
          Track real-time school statistics and key performance metrics.
        </p>
      </div>
      <DashboardAutoRefresh />
    </header>
  );
}
