/**
 * @fileoverview Create Branch Service Layer
 * @module features/create-branch/services/create-branch.service
 */

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
  void payload;
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const branchId = `branch-${Date.now()}`;
  return {
    success: true,
    branchId,
  };
}
