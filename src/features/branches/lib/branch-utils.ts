/**
 * @fileoverview Branches Domain Utilities
 * @module features/branches/lib/branch-utils
 */

import type { Branch, BranchStatus } from "../types";

/**
 * Checks if a branch is currently operating.
 */
export function isBranchActive(branch: Branch): boolean {
  return branch.status === "Active";
}

/**
 * Filters branches list by status.
 */
export function filterBranchesByStatus(
  branches: Branch[],
  status: BranchStatus,
): Branch[] {
  return branches.filter((b) => b.status === status);
}

/**
 * Calculates summary metrics for branches list.
 */
export function calculateBranchMetrics(branches: Branch[]) {
  const activeCount = branches.filter((b) => b.status === "Active").length;
  const totalStudents = branches.reduce((acc, b) => acc + (b.activeStudents || 0), 0);
  const totalBatches = branches.reduce((acc, b) => acc + (b.activeBatches || 0), 0);

  return {
    totalBranches: branches.length,
    activeBranches: activeCount,
    inactiveBranches: branches.length - activeCount,
    totalStudents,
    totalBatches,
  };
}
