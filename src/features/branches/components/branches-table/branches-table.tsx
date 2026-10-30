/**
 * @fileoverview Branches Data Table Component
 * @module features/branches/components/branches-table
 *
 * Implements the 6-column branches table with status badges and quick action operations.
 */

"use client";

import { useRouter } from "next/navigation";
import {
  Edit3,
  Power,
  KeyRound,
  Trash2,
} from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import type { Branch, BranchQuickAction } from "../../types";
import styles from "./branches-table.module.css";

type BranchesTableProps = {
  branches: Branch[];
  onAction?: (action: BranchQuickAction, branch: Branch) => void;
  pageSize?: number;
};

export function BranchesTable({
  branches,
  onAction,
  pageSize = 10,
}: BranchesTableProps) {
  const router = useRouter();

  const handleRowClick = (branch: Branch, e: MouseEvent<HTMLTableRowElement>) => {
    createTouchRipple(e, "dark");
    router.push(`/admin/branches/${branch.slug}`);
  };

  const handleActionClick = (
    e: MouseEvent<HTMLButtonElement>,
    action: BranchQuickAction,
    branch: Branch,
  ) => {
    e.stopPropagation();
    createTouchRipple(e, "dark");
    if (onAction) {
      onAction(action, branch);
    }
  };

  const getAvatarClass = (brand: Branch["brand"]) => {
    if (brand === "DSCA") return styles.dscaAvatar;
    if (brand === "GBTA") return styles.gbtaAvatar;
    return styles.otherAvatar;
  };

  const getAvatarInitials = (branch: Branch) => {
    if (branch.brand === "DSCA") return "DSCA";
    if (branch.brand === "GBTA") return "GBTA";
    return branch.code.slice(0, 3);
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colBranch} />
          <col className={styles.colLocation} />
          <col className={styles.colStudents} />
          <col className={styles.colBatches} />
          <col className={styles.colStatus} />
          <col className={styles.colActions} />
        </colgroup>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.th} scope="col">Branch Name</th>
            <th className={styles.th} scope="col">Location</th>
            <th className={styles.th} scope="col">Active Students</th>
            <th className={styles.th} scope="col">Active Batches</th>
            <th className={`${styles.th} ${styles.thStatus}`} scope="col">Status</th>
            <th className={`${styles.th} ${styles.thAction}`} scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => {
            const isActive = branch.status === "Active";

            return (
              <tr
                key={branch.id}
                className={styles.row}
                onClick={(e) => handleRowClick(branch, e)}
                title={`Click to view ${branch.name} details`}
              >
                {/* Branch Name & Code */}
                <td className={styles.td}>
                  <div className={styles.branchCell}>
                    <div className={`${styles.branchAvatar} ${getAvatarClass(branch.brand)}`}>
                      {getAvatarInitials(branch)}
                    </div>
                    <div className={styles.branchInfo}>
                      <span className={styles.branchName}>{branch.name}</span>
                      <span className={styles.branchCode}>{branch.code}</span>
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className={styles.td}>
                  <span className={styles.locationText} title={branch.location}>
                    {branch.location}
                  </span>
                </td>

                {/* Active Students */}
                <td className={styles.td}>
                  <span className={styles.metricValue}>
                    {branch.activeStudents.toLocaleString()}
                  </span>
                  <span className={styles.metricSub}>students</span>
                </td>

                {/* Active Batches */}
                <td className={styles.td}>
                  <span className={styles.metricValue}>
                    {branch.activeBatches}
                  </span>
                  <span className={styles.metricSub}>batches</span>
                </td>

                {/* Status Badge */}
                <td className={styles.td}>
                  <span
                    className={`${styles.statusBadge} ${
                      isActive ? styles.statusActive : styles.statusInactive
                    }`}
                  >
                    <span className={styles.statusDot} aria-hidden="true" />
                    <span>{branch.status}</span>
                  </span>
                </td>

                {/* Quick Actions */}
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.actionsCell}>
                    {/* Edit */}
                    <button
                      type="button"
                      className={styles.actionButton}
                      title="Edit Branch"
                      aria-label={`Edit ${branch.name}`}
                      onClick={(e) => handleActionClick(e, "edit", branch)}
                    >
                      <Edit3 className={styles.actionIcon} />
                    </button>

                    {/* Toggle Status (Activate / Deactivate) */}
                    <button
                      type="button"
                      className={styles.actionButton}
                      title={isActive ? "Deactivate Branch" : "Activate Branch"}
                      aria-label={`${isActive ? "Deactivate" : "Activate"} ${branch.name}`}
                      onClick={(e) => handleActionClick(e, "toggle-status", branch)}
                    >
                      <Power className={styles.actionIcon} />
                    </button>

                    {/* Permissions */}
                    <button
                      type="button"
                      className={styles.actionButton}
                      title="Manage Permissions & Roles"
                      aria-label={`Manage permissions for ${branch.name}`}
                      onClick={(e) => handleActionClick(e, "permissions", branch)}
                    >
                      <KeyRound className={styles.actionIcon} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                      title="Delete Branch"
                      aria-label={`Delete ${branch.name}`}
                      onClick={(e) => handleActionClick(e, "delete", branch)}
                    >
                      <Trash2 className={styles.actionIcon} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {/* Fixed-slot Empty Rows: Ensures consistent 10-row height regardless of item count */}
          {Array.from({ length: Math.max(0, pageSize - branches.length) }).map(
            (_, index) => (
              <tr
                key={`empty-slot-${index}`}
                className={styles.emptyRow}
                aria-hidden="true"
              >
                <td className={styles.td}>
                  <div className={styles.emptyCellPlaceholder}>&nbsp;</div>
                </td>
                <td className={styles.td}>&nbsp;</td>
                <td className={styles.td}>&nbsp;</td>
                <td className={styles.td}>&nbsp;</td>
                <td className={styles.td}>&nbsp;</td>
                <td className={styles.td}>&nbsp;</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
