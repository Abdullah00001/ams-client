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
import { ConfirmationModal, type ConfirmationType } from "./confirmation-modal/confirmation-modal";
import { INITIAL_BRANCHES_DATA, BranchesService } from "../services";
import type { Branch, BranchQuickAction } from "../types";
import styles from "./branches-view.module.css";

const PAGE_SIZE = 10;

export function BranchesView() {
  const [branchesList, setBranchesList] = useState<Branch[]>(INITIAL_BRANCHES_DATA);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmation modal state for sensitive operations (Toggle status & Delete)
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ConfirmationType;
    branch: Branch | null;
  }>({
    isOpen: false,
    type: "activate",
    branch: null,
  });

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
      // Both activating and deactivating require confirmation as requested by UX review
      const targetType: ConfirmationType =
        branch.status === "Active" ? "deactivate" : "activate";
      setModalState({
        isOpen: true,
        type: targetType,
        branch,
      });
    } else if (action === "delete") {
      // Delete requires confirmation modal
      setModalState({
        isOpen: true,
        type: "delete",
        branch,
      });
    } else if (action === "edit") {
      showToast(`Editing ${branch.name}...`);
    }
  };

  const handleConfirmModal = () => {
    const { type, branch } = modalState;
    if (!branch) return;

    if (type === "activate" || type === "deactivate") {
      const nextStatus = type === "activate" ? "Active" : "Inactive";
      setBranchesList((prev) =>
        prev.map((b) => (b.id === branch.id ? { ...b, status: nextStatus } : b)),
      );
      showToast(`${branch.name} is now ${nextStatus}.`);
    } else if (type === "delete") {
      setBranchesList((prev) => prev.filter((b) => b.id !== branch.id));
      showToast(`${branch.name} has been deleted.`);
    }

    setModalState((prev) => ({ ...prev, isOpen: false, branch: null }));
  };

  const handleCancelModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false, branch: null }));
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

      {/* Confirmation Modal for Activate, Deactivate & Delete */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        branch={modalState.branch}
        onConfirm={handleConfirmModal}
        onCancel={handleCancelModal}
      />

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div role="status" className={styles.actionToast}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
