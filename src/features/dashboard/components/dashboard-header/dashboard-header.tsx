/**
 * @fileoverview Dashboard Top Header Component
 * @module features/dashboard/components/dashboard-header
 *
 * Displays greeting header with personalized username and mounts the
 * live auto-refresh indicator.
 */

import { DashboardAutoRefresh } from "../dashboard-auto-refresh/dashboard-auto-refresh";
import styles from "./dashboard-header.module.css";

/**
 * Props for DashboardHeader.
 */
type DashboardHeaderProps = {
  /** Logged-in user's display name (defaults to "Admin") */
  userName?: string;
};

/**
 * Top header component rendering greeting and real-time refresh status.
 *
 * @component
 * @param {DashboardHeaderProps} props - Header configuration props
 * @returns {JSX.Element} Dashboard header element
 */
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
