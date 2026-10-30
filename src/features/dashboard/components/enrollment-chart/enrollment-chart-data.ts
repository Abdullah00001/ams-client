/**
 * @fileoverview Enrollment Chart Datasets (Row 3 Left)
 * @module features/dashboard/components/enrollment-chart/enrollment-chart-data
 *
 * Provides annual trend lines and monthly student admission figures
 * across DSCA and GBTA branches.
 */

/**
 * Monthly enrollment counts for each academy branch.
 */
export interface MonthlyEnrollmentData {
  /** 3-letter month label */
  month: string;
  /** Enrolled students in DSCA */
  dsca: number;
  /** Enrolled students in GBTA */
  gbta: number;
}

/**
 * Annual enrollment dataset with calculated annual growth rate.
 */
export interface YearEnrollmentData {
  /** Target fiscal / calendar year */
  year: number;
  /** Overall year-over-year percentage growth */
  growthPercentage: number;
  /** 12-month data series */
  months: MonthlyEnrollmentData[];
}

/**
 * Multi-year enrollment datasets for the line chart.
 */
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
    growthPercentage: 18.6,
    months: [
      { month: "Jan", dsca: 54, gbta: 34 },
      { month: "Feb", dsca: 82, gbta: 60 },
      { month: "Mar", dsca: 68, gbta: 52 },
      { month: "Apr", dsca: 98, gbta: 84 },
      { month: "May", dsca: 130, gbta: 110 },
      { month: "Jun", dsca: 155, gbta: 132 },
      { month: "Jul", dsca: 178, gbta: 146 },
      { month: "Aug", dsca: 198, gbta: 162 },
      { month: "Sep", dsca: 270, gbta: 188 },
      { month: "Oct", dsca: 145, gbta: 112 },
      { month: "Nov", dsca: 182, gbta: 148 },
      { month: "Dec", dsca: 218, gbta: 176 },
    ],
  },
  2026: {
    year: 2026,
    growthPercentage: 22.4,
    months: [
      { month: "Jan", dsca: 65, gbta: 42 },
      { month: "Feb", dsca: 98, gbta: 74 },
      { month: "Mar", dsca: 80, gbta: 64 },
      { month: "Apr", dsca: 118, gbta: 98 },
      { month: "May", dsca: 152, gbta: 128 },
      { month: "Jun", dsca: 184, gbta: 154 },
      { month: "Jul", dsca: 208, gbta: 172 },
      { month: "Aug", dsca: 232, gbta: 190 },
      { month: "Sep", dsca: 312, gbta: 220 },
      { month: "Oct", dsca: 172, gbta: 132 },
      { month: "Nov", dsca: 214, gbta: 174 },
      { month: "Dec", dsca: 256, gbta: 206 },
    ],
  },
};

/** Selectable calendar years in the chart filter popover */
export const AVAILABLE_YEAR_OPTIONS = [2024, 2025, 2026];
