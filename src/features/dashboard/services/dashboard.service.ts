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

export const DashboardService = {
  getLatestEnrollments: (): EnrollmentItem[] => {
    return LATEST_ENROLLMENTS_DATA;
  },

  getRecentActivities: (): ActivityItem[] => {
    return RECENT_ACTIVITIES_DATA;
  },

  getTopBranches: (): BranchPerformance[] => {
    return TOP_BRANCHES_DATA;
  },

  getRevenueChartData: (year: number): YearChartData | undefined => {
    return REVENUE_CHART_YEARS[year];
  },

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
