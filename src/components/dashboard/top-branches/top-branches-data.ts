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
    id: "branch-1",
    name: "DSCA — Mirpur",
    shortName: "Mirpur",
    slug: "dsca-mirpur",
    activeStudents: 850,
    revenueMonthly: 185000,
    revenueFormatted: "৳ 185,000",
    percentage: 41,
    color: "#1b84ff", // AMS Primary Brand Blue (KPI Card 1)
  },
  {
    id: "branch-2",
    name: "GBTA — Dhanmondi",
    shortName: "Dhanmondi",
    slug: "gbta-dhanmondi",
    activeStudents: 620,
    revenueMonthly: 135000,
    revenueFormatted: "৳ 135,000",
    percentage: 30,
    color: "#7239ea", // AMS Brand Purple (KPI Card 2)
  },
  {
    id: "branch-3",
    name: "GBTA — Uttara",
    shortName: "Uttara",
    slug: "gbta-uttara",
    activeStudents: 410,
    revenueMonthly: 85000,
    revenueFormatted: "৳ 85,000",
    percentage: 19,
    color: "#00a3ff", // AMS Sky Blue / Info (KPI Card 3)
  },
  {
    id: "branch-4",
    name: "DSCA — Chattogram",
    shortName: "Chattogram",
    slug: "dsca-chattogram",
    activeStudents: 270,
    revenueMonthly: 45000,
    revenueFormatted: "৳ 45,000",
    percentage: 10,
    color: "#17c653", // AMS Success Green (KPI Card 4)
  },
];

export const TOTAL_REVENUE_COUNT = "৳ 450,000";
