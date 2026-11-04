/**
 * @fileoverview Main Branches Management Hook
 * @module features/branches/hooks/use-branches
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_BRANCHES_DATA, BranchesService } from "../services";
import type { Branch, BranchQuickAction } from "../types";
import type { ConfirmationType } from "../components/confirmation-modal";

const PAGE_SIZE = 10;

export function useBranches() {
  const router = useRouter();
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
    router.push("/branches/create", { scroll: false });
  };

  const handleAction = (action: BranchQuickAction, branch: Branch) => {
    if (action === "toggle-status") {
      const targetType: ConfirmationType =
        branch.status === "Active" ? "deactivate" : "activate";
      setModalState({
        isOpen: true,
        type: targetType,
        branch,
      });
    } else if (action === "delete") {
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

  return {
    pageSize: PAGE_SIZE,
    currentPage,
    setCurrentPage,
    paginatedResult,
    toastMessage,
    modalState,
    handleCreateBranch,
    handleAction,
    handleConfirmModal,
    handleCancelModal,
  };
}
