/**
 * @fileoverview Dashboard Data Services & Mock Accessors
 * @module features/dashboard/services
 *
 * Provides centralized data access methods and service endpoints for the
 * Dashboard feature. When backend APIs are integrated, these functions serve
 * as the abstraction layer for fetching asynchronous remote datasets.
 */

import { LATEST_ENROLLMENTS_DATA } from "../components/latest-enrollments/latest-enrollments-data";
import { RECENT_ACTIVITIES_DATA } from "../components/recent-activity/recent-activity-data";
import { TOP_BRANCHES_DATA } from "../components/top-branches/top-branches-data";
import { REVENUE_CHART_YEARS } from "../components/revenue-chart/revenue-chart-data";
import { ENROLLMENT_CHART_YEARS } from "../components/enrollment-chart/enrollment-chart-data";
import type {
  EnrollmentItem,
  ActivityItem,
  BranchPerformance,
  YearChartData,
  YearEnrollmentData,
} from "../types";

/**
 * Service singleton providing query access to dashboard metrics.
 */
export const DashboardService = {
  /**
   * Retrieves the latest 10 student enrollments across all branches (newest first).
   * @returns {EnrollmentItem[]} Array of recent enrollment records
   */
  getLatestEnrollments: (): EnrollmentItem[] => {
    return LATEST_ENROLLMENTS_DATA;
  },

  /**
   * Retrieves the last 15 platform-wide actions and events (newest first).
   * @returns {ActivityItem[]} Array of recent activity feed records
   */
  getRecentActivities: (): ActivityItem[] => {
    return RECENT_ACTIVITIES_DATA;
  },

  /**
   * Retrieves branch revenue and active student distribution for the Donut Chart.
   * @returns {BranchPerformance[]} Branch performance breakdown
   */
  getTopBranches: (): BranchPerformance[] => {
    return TOP_BRANCHES_DATA;
  },

  /**
   * Retrieves monthly fee collection overview data for a specified year.
   * @param {number} year - The target calendar year (e.g. 2024, 2025)
   * @returns {YearChartData | undefined} Bar chart series for the requested year
   */
  getRevenueChartData: (year: number): YearChartData | undefined => {
    return REVENUE_CHART_YEARS[year];
  },

  /**
   * Retrieves monthly enrollment trends and annual growth rate for a specified year.
   * @param {number} year - The target calendar year (e.g. 2024, 2025)
   * @returns {YearEnrollmentData | undefined} Line chart series for the requested year
   */
  getEnrollmentChartData: (year: number): YearEnrollmentData | undefined => {
    return ENROLLMENT_CHART_YEARS[year];
  },
};

export {
  LATEST_ENROLLMENTS_DATA,
  RECENT_ACTIVITIES_DATA,
  TOP_BRANCHES_DATA,
  REVENUE_CHART_YEARS,
  ENROLLMENT_CHART_YEARS,
};
