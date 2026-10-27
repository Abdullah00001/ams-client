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
      { month: "Jan", dsca: 46, gbta: 28 },
      { month: "Feb", dsca: 70, gbta: 50 },
      { month: "Mar", dsca: 56, gbta: 46 },
      { month: "Apr", dsca: 86, gbta: 72 },
      { month: "May", dsca: 112, gbta: 96 },
      { month: "Jun", dsca: 136, gbta: 116 },
      { month: "Jul", dsca: 152, gbta: 128 },
      { month: "Aug", dsca: 170, gbta: 138 },
      { month: "Sep", dsca: 234, gbta: 160 },
      { month: "Oct", dsca: 124, gbta: 96 },
      { month: "Nov", dsca: 156, gbta: 128 },
      { month: "Dec", dsca: 188, gbta: 152 },
    ],
  },
  2025: {
    year: 2025,
    growthPercentage: 15.3,
    months: [
      { month: "Jan", dsca: 52, gbta: 34 },
      { month: "Feb", dsca: 78, gbta: 58 },
      { month: "Mar", dsca: 64, gbta: 52 },
      { month: "Apr", dsca: 96, gbta: 80 },
      { month: "May", dsca: 124, gbta: 104 },
      { month: "Jun", dsca: 148, gbta: 126 },
      { month: "Jul", dsca: 168, gbta: 138 },
      { month: "Aug", dsca: 186, gbta: 148 },
      { month: "Sep", dsca: 245, gbta: 172 },
      { month: "Oct", dsca: 138, gbta: 106 },
      { month: "Nov", dsca: 170, gbta: 138 },
      { month: "Dec", dsca: 204, gbta: 166 },
    ],
  },
  2026: {
    year: 2026,
    growthPercentage: 14.9,
    months: [
      { month: "Jan", dsca: 58, gbta: 40 },
      { month: "Feb", dsca: 86, gbta: 64 },
      { month: "Mar", dsca: 72, gbta: 58 },
      { month: "Apr", dsca: 106, gbta: 88 },
      { month: "May", dsca: 136, gbta: 114 },
      { month: "Jun", dsca: 160, gbta: 136 },
      { month: "Jul", dsca: 180, gbta: 148 },
      { month: "Aug", dsca: 200, gbta: 158 },
      { month: "Sep", dsca: 250, gbta: 184 },
      { month: "Oct", dsca: 150, gbta: 116 },
      { month: "Nov", dsca: 184, gbta: 148 },
      { month: "Dec", dsca: 220, gbta: 178 },
    ],
  },
};

export const ENROLLMENT_YEAR_OPTIONS = [2024, 2025, 2026] as const;
