export interface MonthlyEnrollmentData {
  month: string;
  count: number;
  lastYearCount: number;
}

export interface YearEnrollmentData {
  total: number;
  growthPercentage: number;
  months: MonthlyEnrollmentData[];
}

export const ENROLLMENT_CHART_YEARS: Record<number, YearEnrollmentData> = {
  2024: {
    total: 2150,
    growthPercentage: 14.2,
    months: [
      { month: "Jan", count: 35, lastYearCount: 20 },
      { month: "Feb", count: 65, lastYearCount: 45 },
      { month: "Mar", count: 50, lastYearCount: 40 },
      { month: "Apr", count: 85, lastYearCount: 70 },
      { month: "May", count: 110, lastYearCount: 95 },
      { month: "Jun", count: 135, lastYearCount: 115 },
      { month: "Jul", count: 155, lastYearCount: 130 },
      { month: "Aug", count: 180, lastYearCount: 140 },
      { month: "Sep", count: 245, lastYearCount: 165 },
      { month: "Oct", count: 120, lastYearCount: 95 },
      { month: "Nov", count: 160, lastYearCount: 130 },
      { month: "Dec", count: 195, lastYearCount: 155 },
    ],
  },
  2025: {
    total: 2480,
    growthPercentage: 15.3,
    months: [
      { month: "Jan", count: 45, lastYearCount: 35 },
      { month: "Feb", count: 75, lastYearCount: 65 },
      { month: "Mar", count: 60, lastYearCount: 50 },
      { month: "Apr", count: 95, lastYearCount: 85 },
      { month: "May", count: 130, lastYearCount: 110 },
      { month: "Jun", count: 160, lastYearCount: 135 },
      { month: "Jul", count: 185, lastYearCount: 155 },
      { month: "Aug", count: 210, lastYearCount: 180 },
      { month: "Sep", count: 270, lastYearCount: 245 },
      { month: "Oct", count: 140, lastYearCount: 120 },
      { month: "Nov", count: 180, lastYearCount: 160 },
      { month: "Dec", count: 220, lastYearCount: 195 },
    ],
  },
  2026: {
    total: 2850,
    growthPercentage: 14.9,
    months: [
      { month: "Jan", count: 55, lastYearCount: 45 },
      { month: "Feb", count: 90, lastYearCount: 75 },
      { month: "Mar", count: 75, lastYearCount: 60 },
      { month: "Apr", count: 115, lastYearCount: 95 },
      { month: "May", count: 150, lastYearCount: 130 },
      { month: "Jun", count: 190, lastYearCount: 160 },
      { month: "Jul", count: 220, lastYearCount: 185 },
      { month: "Aug", count: 250, lastYearCount: 210 },
      { month: "Sep", count: 310, lastYearCount: 270 },
      { month: "Oct", count: 170, lastYearCount: 140 },
      { month: "Nov", count: 210, lastYearCount: 180 },
      { month: "Dec", count: 260, lastYearCount: 220 },
    ],
  },
};

export const ENROLLMENT_YEAR_OPTIONS = [2024, 2025, 2026] as const;
