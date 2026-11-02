/**
 * @fileoverview Top Branches Dataset (Row 3 Right)
 * @module features/dashboard/components/top-branches/top-branches-data
 *
 * Defines performance breakdown, revenue shares, and theme colors
 * for Dhaka Specialty Coffee Academy (DSCA) and Global Barista Training Academy (GBTA).
 */

/**
 * Performance metrics for an individual academy branch.
 */
export interface BranchPerformance {
  /** Unique branch slug identifier */
  id: string;
  /** Full academy title */
  name: string;
  /** Short brand abbreviation */
  shortName: string;
  /** Link slug */
  slug: string;
  /** Number of currently enrolled active students */
  activeStudents: number;
  /** Numeric monthly revenue */
  revenueMonthly: number;
  /** Formatted monthly revenue with currency symbol */
  revenueFormatted: string;
  /** Percentage contribution to total academy performance */
  percentage: number;
  /** Primary hex color representing this branch in donut chart slices */
  color: string;
}

/**
 * Current performance metrics for top branches.
 */
export const TOP_BRANCHES_DATA: BranchPerformance[] = [
  {
    id: "dsca",
    name: "DSCA",
    shortName: "DSCA",
    slug: "dsca",
    activeStudents: 1250,
    revenueMonthly: 260000,
    revenueFormatted: "৳ 260,000",
    percentage: 58,
    color: "#028c4a", // DSCA Emerald Green
  },
  {
    id: "gbta",
    name: "GBTA",
    shortName: "GBTA",
    slug: "gbta",
    activeStudents: 890,
    revenueMonthly: 190000,
    revenueFormatted: "৳ 190,000",
    percentage: 42,
    color: "#ff7724", // GBTA Vibrant Orange
  },
];

/** Aggregate total revenue formatted display value */
export const TOTAL_REVENUE_COUNT = "৳ 450,000";
