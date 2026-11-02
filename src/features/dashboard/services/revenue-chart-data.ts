/**
 * @fileoverview Revenue Chart Datasets (Row 2)
 * @module features/dashboard/components/revenue-chart/revenue-chart-data
 *
 * Provides annual bar chart data points for the "Fees Collection Overview"
 * component, segmented by DSCA and GBTA academy branches.
 */

/**
 * Monthly fee collection data point for a single calendar month.
 */
export type MonthlyBarData = {
  /** 3-letter month label */
  month: string;
  /** Month index (0-11) */
  monthIndex: number;
  /** DSCA fee collection value in BDT */
  dsca: number;
  /** GBTA fee collection value in BDT */
  gbta: number;
  /** Formatted tooltip amount */
  tooltipAmount: string;
  /** Formatted tooltip date */
  tooltipDate: string;
};

/**
 * Annual dataset container for the Fees Collection Bar Chart.
 */
export type YearChartData = {
  /** Target year */
  year: number;
  /** 12-month array of bar metric points */
  months: MonthlyBarData[];
};

/**
 * Historical and projected annual fee collection records.
 */
export const REVENUE_CHART_YEARS: Record<number, YearChartData> = {
  2024: {
    year: 2024,
    months: [
      { month: "Jan", monthIndex: 0, dsca: 84000, gbta: 66000, tooltipDate: "Jan 01 2024", tooltipAmount: "$1,025" },
      { month: "Feb", monthIndex: 1, dsca: 77000, gbta: 18000, tooltipDate: "Feb 01 2024", tooltipAmount: "$850" },
      { month: "Mar", monthIndex: 2, dsca: 16000, gbta: 44000, tooltipDate: "Mar 01 2024", tooltipAmount: "$620" },
      { month: "Apr", monthIndex: 3, dsca: 55000, gbta: 20000, tooltipDate: "Apr 01 2024", tooltipAmount: "$740" },
      { month: "May", monthIndex: 4, dsca: 54000, gbta: 61000, tooltipDate: "May 01 2024", tooltipAmount: "$1,120" },
      { month: "Jun", monthIndex: 5, dsca: 72000, gbta: 20000, tooltipDate: "Jun 01 2024", tooltipAmount: "$910" },
      { month: "Jul", monthIndex: 6, dsca: 84000, gbta: 66000, tooltipDate: "Jul 01 2024", tooltipAmount: "$1,025" },
      { month: "Aug", monthIndex: 7, dsca: 42000, gbta: 42000, tooltipDate: "Aug 01 2024", tooltipAmount: "$840" },
      { month: "Sep", monthIndex: 8, dsca: 42000, gbta: 13000, tooltipDate: "Sep 01 2024", tooltipAmount: "$550" },
      { month: "Oct", monthIndex: 9, dsca: 61000, gbta: 44000, tooltipDate: "Oct 01 2024", tooltipAmount: "$1,050" },
      { month: "Nov", monthIndex: 10, dsca: 64000, gbta: 20000, tooltipDate: "Nov 01 2024", tooltipAmount: "$840" },
      { month: "Dec", monthIndex: 11, dsca: 48000, gbta: 24000, tooltipDate: "Dec 01 2024", tooltipAmount: "$720" },
    ],
  },
  2025: {
    year: 2025,
    months: [
      { month: "Jan", monthIndex: 0, dsca: 78000, gbta: 55000, tooltipDate: "Jan 01 2025", tooltipAmount: "$980" },
      { month: "Feb", monthIndex: 1, dsca: 70000, gbta: 22000, tooltipDate: "Feb 01 2025", tooltipAmount: "$820" },
      { month: "Mar", monthIndex: 2, dsca: 25000, gbta: 38000, tooltipDate: "Mar 01 2025", tooltipAmount: "$610" },
      { month: "Apr", monthIndex: 3, dsca: 50000, gbta: 26000, tooltipDate: "Apr 01 2025", tooltipAmount: "$760" },
      { month: "May", monthIndex: 4, dsca: 60000, gbta: 48000, tooltipDate: "May 01 2025", tooltipAmount: "$1,080" },
      { month: "Jun", monthIndex: 5, dsca: 80000, gbta: 28000, tooltipDate: "Jun 01 2025", tooltipAmount: "$950" },
      { month: "Jul", monthIndex: 6, dsca: 90000, gbta: 60000, tooltipDate: "Jul 01 2025", tooltipAmount: "$1,150" },
      { month: "Aug", monthIndex: 7, dsca: 48000, gbta: 38000, tooltipDate: "Aug 01 2025", tooltipAmount: "$860" },
      { month: "Sep", monthIndex: 8, dsca: 52000, gbta: 18000, tooltipDate: "Sep 01 2025", tooltipAmount: "$620" },
      { month: "Oct", monthIndex: 9, dsca: 70000, gbta: 48000, tooltipDate: "Oct 01 2025", tooltipAmount: "$1,120" },
      { month: "Nov", monthIndex: 10, dsca: 68000, gbta: 24000, tooltipDate: "Nov 01 2025", tooltipAmount: "$890" },
      { month: "Dec", monthIndex: 11, dsca: 55000, gbta: 30000, tooltipDate: "Dec 01 2025", tooltipAmount: "$800" },
    ],
  },
  2026: {
    year: 2026,
    months: [
      { month: "Jan", monthIndex: 0, dsca: 92000, gbta: 72000, tooltipDate: "Jan 01 2026", tooltipAmount: "$1,200" },
      { month: "Feb", monthIndex: 1, dsca: 84000, gbta: 25000, tooltipDate: "Feb 01 2026", tooltipAmount: "$920" },
      { month: "Mar", monthIndex: 2, dsca: 20000, gbta: 50000, tooltipDate: "Mar 01 2026", tooltipAmount: "$710" },
      { month: "Apr", monthIndex: 3, dsca: 62000, gbta: 28000, tooltipDate: "Apr 01 2026", tooltipAmount: "$850" },
      { month: "May", monthIndex: 4, dsca: 65000, gbta: 70000, tooltipDate: "May 01 2026", tooltipAmount: "$1,280" },
      { month: "Jun", monthIndex: 5, dsca: 85000, gbta: 30000, tooltipDate: "Jun 01 2026", tooltipAmount: "$1,040" },
      { month: "Jul", monthIndex: 6, dsca: 96000, gbta: 75000, tooltipDate: "Jul 01 2026", tooltipAmount: "$1,310" },
      { month: "Aug", monthIndex: 7, dsca: 50000, gbta: 48000, tooltipDate: "Aug 01 2026", tooltipAmount: "$940" },
      { month: "Sep", monthIndex: 8, dsca: 55000, gbta: 20000, tooltipDate: "Sep 01 2026", tooltipAmount: "$690" },
      { month: "Oct", monthIndex: 9, dsca: 78000, gbta: 55000, tooltipDate: "Oct 01 2026", tooltipAmount: "$1,220" },
      { month: "Nov", monthIndex: 10, dsca: 75000, gbta: 28000, tooltipDate: "Nov 01 2026", tooltipAmount: "$980" },
      { month: "Dec", monthIndex: 11, dsca: 62000, gbta: 35000, tooltipDate: "Dec 01 2026", tooltipAmount: "$890" },
    ],
  },
};

/** Selectable calendar years in the chart filter popover */
export const AVAILABLE_YEAR_OPTIONS = [2024, 2025, 2026];
