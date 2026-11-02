/**
 * @fileoverview Main Dashboard Hook
 * @module features/dashboard/hooks/use-dashboard
 */

"use client";

import { useState } from "react";
import { DashboardService } from "../services";

export function useDashboard() {
  const [selectedRevenueYear, setSelectedRevenueYear] = useState<number>(2025);
  const [selectedEnrollmentYear, setSelectedEnrollmentYear] = useState<number>(2025);

  const revenueData = DashboardService.getRevenueChartData(selectedRevenueYear);
  const enrollmentData = DashboardService.getEnrollmentChartData(selectedEnrollmentYear);
  const topBranches = DashboardService.getTopBranches();
  const latestEnrollments = DashboardService.getLatestEnrollments();
  const recentActivities = DashboardService.getRecentActivities();

  return {
    selectedRevenueYear,
    setSelectedRevenueYear,
    selectedEnrollmentYear,
    setSelectedEnrollmentYear,
    revenueData,
    enrollmentData,
    topBranches,
    latestEnrollments,
    recentActivities,
  };
}
