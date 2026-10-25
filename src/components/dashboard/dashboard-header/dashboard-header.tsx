"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./dashboard-header.module.css";

type DashboardHeaderProps = {
  userName?: string;
  onBranchChange?: (branch: string) => void;
};

export function DashboardHeader({
  userName = "Admin",
  onBranchChange,
}: DashboardHeaderProps) {
  const [selectedBranch, setSelectedBranch] = useState("all");

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedBranch(val);
    onBranchChange?.(val);
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleArea}>
        <h1 className={styles.title}>Welcome back, {userName}</h1>
        <p className={styles.subtitle}>
          Track real-time school statistics and key performance metrics.
        </p>
      </div>

      <div className={styles.filterControls}>
        <div className={styles.selectWrapper}>
          <select
            aria-label="Select Branch"
            className={styles.branchSelect}
            onChange={handleBranchChange}
            value={selectedBranch}
          >
            <option value="all">All Branches</option>
            <option value="main">Main Campus</option>
            <option value="dhanmondi">Dhanmondi Branch</option>
            <option value="uttara">Uttara Branch</option>
          </select>
          <ChevronDown aria-hidden="true" className={styles.selectIcon} size={15} />
        </div>
      </div>
    </header>
  );
}
