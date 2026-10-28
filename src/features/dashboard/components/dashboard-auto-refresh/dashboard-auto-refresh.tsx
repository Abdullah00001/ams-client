"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import styles from "./dashboard-auto-refresh.module.css";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export function DashboardAutoRefresh() {
  const router = useRouter();
  const [lastRefreshed, setLastRefreshed] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      setLastRefreshed(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    }, 0);

    const interval = window.setInterval(() => {
      setIsRefreshing(true);
      router.refresh();
      setLastRefreshed(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      window.setTimeout(() => setIsRefreshing(false), 1000);
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [router]);

  return (
    <div
      aria-label="Dashboard auto-refreshes every 5 minutes"
      className={styles.refreshIndicator}
      title={
        lastRefreshed
          ? `Auto-refreshes every 5m · Last updated: ${lastRefreshed}`
          : "Auto-refreshes every 5m"
      }
    >
      <RefreshCw
        aria-hidden="true"
        className={`${styles.refreshIcon} ${
          isRefreshing ? styles.refreshIconSpin : ""
        }`}
      />
      <span>Auto-refreshes every 5m</span>
    </div>
  );
}
