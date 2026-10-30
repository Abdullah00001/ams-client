/**
 * @fileoverview Main Branches View Component
 * @module features/branches/components/branches-view
 *
 * Assembles the header, paginated table (10 per page), and interactive action notifications.
 */

"use client";

import { useState } from "react";
import { BranchesHeader } from "./branches-header/branches-header";
import { BranchesTable } from "./branches-table/branches-table";
import { BranchPagination } from "./branch-pagination/branch-pagination";
import { INITIAL_BRANCHES_DATA, BranchesService } from "../services";
import type { Branch, BranchQuickAction } from "../types";
import styles from "./branches-view.module.css";

const PAGE_SIZE = 10;

export function BranchesView() {
  const [branchesList, setBranchesList] = useState<Branch[]>(INITIAL_BRANCHES_DATA);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const paginatedResult = BranchesService.getBranches(currentPage, PAGE_SIZE, branchesList);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCreateBranch = () => {
    showToast("Create Branch form modal will open here.");
  };

  const handleAction = (action: BranchQuickAction, branch: Branch) => {
    if (action === "toggle-status") {
      const nextStatus = branch.status === "Active" ? "Inactive" : "Active";
      setBranchesList((prev) =>
        prev.map((b) => (b.id === branch.id ? { ...b, status: nextStatus } : b)),
      );
      showToast(`${branch.name} is now ${nextStatus}.`);
    } else if (action === "delete") {
      if (window.confirm(`Are you sure you want to delete "${branch.name}"?`)) {
        setBranchesList((prev) => prev.filter((b) => b.id !== branch.id));
        showToast(`${branch.name} has been deleted.`);
      }
    } else if (action === "edit") {
      showToast(`Editing ${branch.name}...`);
    } else if (action === "permissions") {
      showToast(`Managing permissions for ${branch.name}...`);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header with Left Title/Desc and Right '+ Create Branch' CTA */}
      <BranchesHeader onCreateBranch={handleCreateBranch} />

      {/* Main Table Card (Figma Inspect Design) */}
      <div className={styles.tableCard}>
        <BranchesTable
          branches={paginatedResult.data}
          pageSize={PAGE_SIZE}
          onAction={handleAction}
        />

        {/* Bottom Pagination Bar: 10 rows per page */}
        <BranchPagination
          currentPage={paginatedResult.page}
          totalPages={paginatedResult.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div role="status" className={styles.actionToast}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
