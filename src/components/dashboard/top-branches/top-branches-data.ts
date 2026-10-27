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

export const TOTAL_REVENUE_COUNT = "৳ 450,000";
