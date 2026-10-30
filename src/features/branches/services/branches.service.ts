/**
 * @fileoverview Branches Data Service
 * @module features/branches/services/branches.service
 *
 * Provides query methods and state handlers for the branches management feature.
 */

import { INITIAL_BRANCHES_DATA } from "./branches-mock-data";
import type { Branch, PaginatedBranches } from "../types";

export const BranchesService = {
  /**
   * Retrieves all branches with pagination support (default 10 items per page).
   *
   * @param {number} [page=1] - 1-indexed target page
   * @param {number} [pageSize=10] - Number of records per page
   * @param {Branch[]} [customData] - Optional in-memory dataset to query from
   * @returns {PaginatedBranches} Paginated response containing records and metadata
   */
  getBranches: (
    page: number = 1,
    pageSize: number = 10,
    customData: Branch[] = INITIAL_BRANCHES_DATA,
  ): PaginatedBranches => {
    const total = customData.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * pageSize;
    const data = customData.slice(startIndex, startIndex + pageSize);

    return {
      data,
      total,
      page: validPage,
      pageSize,
      totalPages,
    };
  },
};
