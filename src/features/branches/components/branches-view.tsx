/**
 * @fileoverview Main Branches View Component
 * @module features/branches/components/branches-view
 *
 * Slim coordinator component assembling the header, paginated table, and interactive action modals.
 */

"use client";

import { BranchesHeader } from "./branches-header";
import { BranchesTable } from "./branches-table";
import { BranchPagination } from "./branch-pagination";
import { ConfirmationModal } from "./confirmation-modal";
import { useBranches } from "../hooks";
import styles from "../styles/branches-view.module.css";

export function BranchesView() {
  const {
    pageSize,
    paginatedResult,
    toastMessage,
    modalState,
    setCurrentPage,
    handleCreateBranch,
    handleAction,
    handleConfirmModal,
    handleCancelModal,
  } = useBranches();

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header with Left Title/Desc and Right '+ Create Branch' CTA */}
      <BranchesHeader onCreateBranch={handleCreateBranch} />

      {/* Main Table Card (Figma Inspect Design) */}
      <div className={styles.tableCard}>
        <BranchesTable
          branches={paginatedResult.data}
          pageSize={pageSize}
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

      {/* Floating feedback notification toast */}
      {toastMessage && (
        <div role="status" className={styles.toastNotice}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
