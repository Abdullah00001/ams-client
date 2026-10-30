/**
 * @fileoverview Branch Management Domain Types
 * @module features/branches/types
 *
 * Defines data models and action contracts for Academy Management System branches.
 */

/**
 * Operating status for an academy branch.
 * - `Active`: Fully operational campus accepting enrollments and scheduling batches.
 * - `Inactive`: Deactivated campus with suspended operations.
 */
export type BranchStatus = "Active" | "Inactive";

/**
 * Brand affiliation for visual theming.
 */
export type BranchBrand = "DSCA" | "GBTA" | "OTHER";

/**
 * Branch record data model.
 */
export interface Branch {
  /** Unique branch identifier */
  id: string;
  /** Full official branch name */
  name: string;
  /** Internal branch code (e.g. "DSCA-DHM-01") */
  code: string;
  /** URL routing slug (e.g. "dhaka-main-dhanmondi") */
  slug: string;
  /** Physical campus address / city */
  location: string;
  /** Total number of actively enrolled students */
  activeStudents: number;
  /** Number of active running course batches */
  activeBatches: number;
  /** Current operating status */
  status: BranchStatus;
  /** Brand affiliation for color accents */
  brand: BranchBrand;
  /** Contact phone */
  phone?: string;
  /** Contact email */
  email?: string;
}

/**
 * Available row action operations for Super Admin.
 */
export type BranchQuickAction = "edit" | "toggle-status" | "permissions" | "delete";

/**
 * Paginated query response container.
 */
export interface PaginatedBranches {
  /** Array of branch items for current page */
  data: Branch[];
  /** Total number of branch items across all pages */
  total: number;
  /** 1-based current page index */
  page: number;
  /** Items per page (default: 10) */
  pageSize: number;
  /** Total calculated pages */
  totalPages: number;
}
