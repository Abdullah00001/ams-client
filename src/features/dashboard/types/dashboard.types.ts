/**
 * @fileoverview Dashboard Domain Types
 * @module features/dashboard/types
 *
 * Defines the core TypeScript types, interfaces, and data models used across
 * the Dashboard feature modules, including charts, branch metrics, enrollment
 * records, and activity feed streams.
 */

/**
 * Recognized branch identifiers in the Academy Management System.
 * - `DSCA`: Dhaka Specialty Coffee Academy (Primary brand color: #028c4a)
 * - `GBTA`: Global Barista Training Academy (Primary brand color: #ff7724)
 */
export type BranchId = "DSCA" | "GBTA";

/**
 * Platform tags for the Recent Activity Feed.
 * Represents which entity or administrative domain triggered the event.
 */
export type ActivityTag = "GBTA" | "DSCA" | "ADMIN";

/**
 * Current lifecycle status of an enrollment transaction.
 */
export type EnrollmentStatus = "Completed" | "Pending" | "Processing";

/**
 * Data model for a single enrollment entry in the Latest Enrollments table (Row 4 Left).
 */
export interface EnrollmentItem {
  /** Unique student record identifier (e.g. "stu-101") */
  id: string;
  /** Full name of the enrolled student */
  studentName: string;
  /** Primary contact email address */
  email: string;
  /** Two-letter initials for avatar badge fallback */
  initials: string;
  /** Name of the enrolled course or diploma */
  course: string;
  /** Campus / academy branch */
  branch: BranchId;
  /** Raw numeric payment amount in BDT */
  amountPaid: number;
  /** Formatted currency string with symbol (e.g. "৳ 25,000") */
  amountFormatted: string;
  /** Human-readable enrollment date (e.g. "Oct 27, 2026") */
  date: string;
  /** Relative time elapsed since enrollment (e.g. "2 mins ago") */
  timeAgo: string;
  /** Payment & processing status */
  status: EnrollmentStatus;
}

/**
 * Text token fragment with optional bold emphasis for rich activity descriptions.
 */
export interface ActivityPart {
  /** Text snippet */
  text: string;
  /** If true, renders with semi-bold / bold weight */
  bold?: boolean;
}

/**
 * Data model for a platform-wide event in the Recent Activity Feed (Row 4 Right).
 */
export interface ActivityItem {
  /** Unique activity identifier */
  id: string;
  /** Branch or admin origin tag */
  tag: ActivityTag;
  /** Full plain text description for accessibility and screen readers */
  description: string;
  /** Rich formatted text fragments */
  parts: ActivityPart[];
  /** Relative timestamp (e.g. "2 mins ago", "Yesterday") */
  timestamp: string;
  /** Deep link destination on row click */
  targetUrl: string;
}

/**
 * Branch performance data model for the Top Branches Donut Chart card (Row 3 Right).
 */
export interface BranchPerformance {
  /** Lowercase branch slug id */
  id: string;
  /** Full branch name */
  name: string;
  /** Short abbreviation */
  shortName: string;
  /** URL slug */
  slug: string;
  /** Current active enrolled student count */
  activeStudents: number;
  /** Monthly revenue in BDT */
  revenueMonthly: number;
  /** Formatted monthly revenue string */
  revenueFormatted: string;
  /** Percentage contribution to total school revenue */
  percentage: number;
  /** Theme hex color representing the branch in donut slices */
  color: string;
}

/**
 * Monthly bar data model for the Fees Collection Overview Chart (Row 2).
 */
export type MonthlyBarData = {
  /** 3-letter month name (e.g. "Jan", "Feb") */
  month: string;
  /** 0-indexed month sequence (0 = Jan, 11 = Dec) */
  monthIndex: number;
  /** DSCA fee collection amount in BDT */
  dsca: number;
  /** GBTA fee collection amount in BDT */
  gbta: number;
  /** Formatted tooltip amount */
  tooltipAmount: string;
  /** Formatted tooltip date label */
  tooltipDate: string;
};

/**
 * Annual dataset container for the Revenue Bar Chart.
 */
export type YearChartData = {
  /** Target fiscal / calendar year */
  year: number;
  /** 12-month series data */
  months: MonthlyBarData[];
};

/**
 * Monthly enrollment data point for the Student Enrollment Line Chart (Row 3 Left).
 */
export interface MonthlyEnrollmentData {
  /** 3-letter month abbreviation */
  month: string;
  /** DSCA monthly enrollment count */
  dsca: number;
  /** GBTA monthly enrollment count */
  gbta: number;
}

/**
 * Annual enrollment dataset container including annual growth rate.
 */
export interface YearEnrollmentData {
  /** Target year */
  year: number;
  /** Year-over-year percentage growth rate */
  growthPercentage: number;
  /** Monthly enrollment data points */
  months: MonthlyEnrollmentData[];
}
