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

export const ENROLLMENT_CHART_YEARS: Record<number, YearEnrollmentData> = {
  2024: {
    year: 2024,
    growthPercentage: 14.2,
    months: [
      { month: "Jan", dsca: 22, gbta: 13 },
      { month: "Feb", dsca: 38, gbta: 27 },
      { month: "Mar", dsca: 30, gbta: 20 },
      { month: "Apr", dsca: 48, gbta: 37 },
      { month: "May", dsca: 62, gbta: 48 },
      { month: "Jun", dsca: 74, gbta: 61 },
      { month: "Jul", dsca: 85, gbta: 70 },
      { month: "Aug", dsca: 98, gbta: 82 },
      { month: "Sep", dsca: 145, gbta: 100 },
      { month: "Oct", dsca: 68, gbta: 52 },
      { month: "Nov", dsca: 90, gbta: 70 },
      { month: "Dec", dsca: 108, gbta: 87 },
    ],
  },
  2025: {
    year: 2025,
    growthPercentage: 15.3,
    months: [
      { month: "Jan", dsca: 26, gbta: 19 },
      { month: "Feb", dsca: 44, gbta: 31 },
      { month: "Mar", dsca: 35, gbta: 25 },
      { month: "Apr", dsca: 54, gbta: 41 },
      { month: "May", dsca: 72, gbta: 58 },
      { month: "Jun", dsca: 88, gbta: 72 },
      { month: "Jul", dsca: 102, gbta: 83 },
      { month: "Aug", dsca: 115, gbta: 95 },
      { month: "Sep", dsca: 158, gbta: 112 },
      { month: "Oct", dsca: 78, gbta: 62 },
      { month: "Nov", dsca: 102, gbta: 78 },
      { month: "Dec", dsca: 122, gbta: 98 },
    ],
  },
  2026: {
    year: 2026,
    growthPercentage: 14.9,
    months: [
      { month: "Jan", dsca: 32, gbta: 23 },
      { month: "Feb", dsca: 52, gbta: 38 },
      { month: "Mar", dsca: 42, gbta: 33 },
      { month: "Apr", dsca: 65, gbta: 50 },
      { month: "May", dsca: 85, gbta: 65 },
      { month: "Jun", dsca: 105, gbta: 85 },
      { month: "Jul", dsca: 120, gbta: 100 },
      { month: "Aug", dsca: 135, gbta: 115 },
      { month: "Sep", dsca: 175, gbta: 135 },
      { month: "Oct", dsca: 95, gbta: 75 },
      { month: "Nov", dsca: 118, gbta: 92 },
      { month: "Dec", dsca: 145, gbta: 115 },
    ],
  },
};

export const ENROLLMENT_YEAR_OPTIONS = [2024, 2025, 2026] as const;
