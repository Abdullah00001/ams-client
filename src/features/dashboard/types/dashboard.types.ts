export type BranchId = "DSCA" | "GBTA";
export type ActivityTag = "GBTA" | "DSCA" | "ADMIN";
export type EnrollmentStatus = "Completed" | "Pending" | "Processing";

export interface EnrollmentItem {
  id: string;
  studentName: string;
  email: string;
  initials: string;
  course: string;
  branch: BranchId;
  amountPaid: number;
  amountFormatted: string;
  date: string;
  timeAgo: string;
  status: EnrollmentStatus;
}

export interface ActivityPart {
  text: string;
  bold?: boolean;
}

export interface ActivityItem {
  id: string;
  tag: ActivityTag;
  description: string;
  parts: ActivityPart[];
  timestamp: string;
  targetUrl: string;
}

export interface BranchPerformance {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  activeStudents: number;
  revenueMonthly: number;
  revenueFormatted: string;
  percentage: number;
  color: string;
}

export type MonthlyBarData = {
  month: string;
  monthIndex: number;
  dsca: number;
  gbta: number;
  tooltipAmount: string;
  tooltipDate: string;
};

export type YearChartData = {
  year: number;
  months: MonthlyBarData[];
};

export interface MonthlyEnrollmentData {
  month: string;
  dsca: number;
  gbta: number;
}

export interface YearEnrollmentData {
  year: number;
  growthPercentage: number;
  months: MonthlyEnrollmentData[];
}
