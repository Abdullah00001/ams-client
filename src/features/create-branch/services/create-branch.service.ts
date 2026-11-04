/**
 * @fileoverview Create Branch Service Layer
 * @module features/create-branch/services/create-branch.service
 */

import { INITIAL_BRANCHES_DATA } from "@/features/branches/services";
import type { Branch } from "@/features/branches/types";
import {
  MOCK_EXISTING_USERS,
  type CreateBranchFormData,
  type ExistingUser,
} from "../types";

/**
 * Searches existing users by name, email, or phone.
 * Simulates an asynchronous backend query with simulated latency.
 */
export async function searchExistingUsers(
  query: string,
): Promise<ExistingUser[]> {
  const normalizedQuery = query.toLowerCase().trim();

  // Simulate network latency (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!normalizedQuery) {
    return [];
  }

  return MOCK_EXISTING_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery) ||
      user.phone.includes(normalizedQuery),
  );
}

/**
 * Submits a new branch creation payload to the backend API.
 */
export async function submitCreateBranch(
  payload: CreateBranchFormData,
): Promise<{ success: boolean; branchId: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const branchId = `branch-${Date.now()}`;

  const newBranch: Branch = {
    id: branchId,
    name: payload.name,
    code: payload.code || `AMS-${(payload.slug || "BR").toUpperCase().slice(0, 6)}`,
    slug: payload.slug,
    location: payload.address || "Main Campus Location",
    activeStudents: 0,
    activeBatches: 0,
    status: payload.status,
    brand: payload.brand || (payload.name.toUpperCase().includes("GBTA") ? "GBTA" : "DSCA"),
    phone: payload.phone,
    email: payload.email,
  };

  INITIAL_BRANCHES_DATA.unshift(newBranch);

  return {
    success: true,
    branchId,
  };
}
