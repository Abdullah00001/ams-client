"use client";

import { useState } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import {
  REVENUE_CHART_YEARS,
  AVAILABLE_YEAR_OPTIONS,
} from "./revenue-chart-data";
import styles from "./revenue-chart.module.css";

const MAX_CHART_VALUE = 150000;
const CHART_HEIGHT_PX = 250;

export function RevenueChart() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(6); // Default: Jul (matching Figma)

  const currentYearData =
    REVENUE_CHART_YEARS[selectedYear] ?? REVENUE_CHART_YEARS[2024];

  return (
    <section aria-label="Fees Collection Overview" className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Fees Collection Overview</h2>
          <p className={styles.subtitle}>
            Track collected and pending fees over time.
          </p>
        </div>

        {/* Year Filter Dropdown (Replaces View All Transactions) */}
        <Popover.Root
          modal={false}
          onOpenChange={setIsYearOpen}
          open={isYearOpen}
        >
          <Popover.Trigger
            aria-label={`Select Year. Currently: ${selectedYear}`}
            className={styles.yearTrigger}
            type="button"
          >
            <span>{selectedYear}</span>
            <ChevronDown
              aria-hidden="true"
              className={styles.yearChevron}
              size={14}
            />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Positioner
              align="end"
              positionMethod="fixed"
              side="bottom"
              sideOffset={4}
            >
              <Popover.Popup className={styles.yearPopup}>
                {AVAILABLE_YEAR_OPTIONS.map((yr) => (
                  <button
                    className={`${styles.yearOption} ${yr === selectedYear ? styles.yearOptionSelected : ""}`}
                    key={yr}
                    onClick={() => {
                      setSelectedYear(yr);
                      setIsYearOpen(false);
                    }}
                    type="button"
                  >
                    <span>{yr}</span>
                  </button>
                ))}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Chart Area */}
      <div className={styles.chartArea}>
        {/* Y-Axis Labels */}
        <div className={styles.yAxis}>
          <span className={styles.yLabel}>$150k</span>
          <span className={styles.yLabel}>$100k</span>
          <span className={styles.yLabel}>$75k</span>
          <span className={styles.yLabel}>$50k</span>
          <span className={styles.yLabel}>$25k</span>
          <span className={styles.yLabel}>$0</span>
        </div>

        {/* Plot Area */}
        <div className={styles.plotArea}>
          {/* Horizontal Gridlines */}
          <div className={styles.gridLines}>
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
            <div className={styles.gridLine} />
          </div>

          {/* Stacked Bars Container */}
          <div className={styles.barsContainer}>
            {currentYearData.months.map((m, idx) => {
              const bluePx = Math.round(
                (m.dsca / MAX_CHART_VALUE) * CHART_HEIGHT_PX,
              );
              const orangePx = Math.round(
                (m.gbta / MAX_CHART_VALUE) * CHART_HEIGHT_PX,
              );
              const isHovered = hoveredMonthIndex === idx;

              return (
                <div
                  className={styles.barColumn}
                  key={m.month}
                  onMouseEnter={() => setHoveredMonthIndex(idx)}
                >
                  {/* Tooltip (Matching Figma Screenshot 1, 2, 4) */}
                  {isHovered && (
                    <div className={styles.tooltip}>
                      <span className={styles.tooltipDate}>{m.tooltipDate}</span>
                      <div className={styles.tooltipRow}>
                        <span className={styles.tooltipDot} />
                        <span>{m.tooltipAmount}</span>
                      </div>
                      <div className={styles.tooltipCaret} />
                    </div>
                  )}

                  {/* Stacked Bar (30px wide) */}
                  <div className={styles.stackedBar}>
                    <div
                      className={styles.barBlue}
                      style={{ height: `${bluePx}px` }}
                    />
                    <div
                      className={styles.barOrange}
                      style={{ height: `${orangePx}px` }}
                    />
                  </div>

                  {/* Month Label */}
                  <span className={styles.monthLabel}>{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Legend (Centered) */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotBlue}`} />
          <span>DSCA</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotOrange}`} />
          <span>GBTA</span>
        </div>
      </div>
    </section>
  );
}
