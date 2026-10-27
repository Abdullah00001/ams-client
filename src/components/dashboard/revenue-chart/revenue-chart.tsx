"use client";

import { useState, type MouseEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import {
  REVENUE_CHART_YEARS,
  AVAILABLE_YEAR_OPTIONS,
} from "./revenue-chart-data";
import styles from "./revenue-chart.module.css";

const MAX_CHART_VALUE = 150000;
const CHART_HEIGHT_PX = 250;

/**
 * Universal Material UI TouchRipple
 */
function createRipple(event: MouseEvent<HTMLElement>) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const isKeyboard = event.clientX === 0 && event.clientY === 0;
  const x = isKeyboard ? rect.width / 2 : event.clientX - rect.left;
  const y = isKeyboard ? rect.height / 2 : event.clientY - rect.top;
  const diameter = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;

  const ripple = document.createElement("span");
  ripple.className = styles.ripple;
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${Math.round(x - diameter / 2)}px`;
  ripple.style.top = `${Math.round(y - diameter / 2)}px`;

  container.appendChild(ripple);

  window.setTimeout(() => {
    ripple.remove();
  }, 1300);
}

export function RevenueChart() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [hoveredState, setHoveredState] = useState<{
    monthIndex: number;
    series: "dsca" | "gbta";
  } | null>(null);

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

        {/* Year Filter Dropdown with TouchRipple */}
        <Popover.Root
          modal={false}
          onOpenChange={setIsYearOpen}
          open={isYearOpen}
        >
          <Popover.Trigger
            aria-expanded={isYearOpen}
            aria-label={`Select Year. Currently: ${selectedYear}`}
            className={styles.yearTrigger}
            onMouseDown={createRipple}
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
              style={{ zIndex: 9999 }}
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
                    onMouseDown={(e) => {
                      createRipple(e);
                      setSelectedYear(yr);
                      window.setTimeout(() => {
                        setIsYearOpen(false);
                      }, 120);
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

              const isCurrentMonthHovered = hoveredState?.monthIndex === idx;
              const activeSeries = hoveredState?.series ?? "gbta";

              // Sits right above the hovered segment (not at the top of the chart!)
              const tooltipBottomPx =
                activeSeries === "dsca"
                  ? bluePx + 8
                  : bluePx + orangePx + 8;

              return (
                <div
                  className={styles.barColumn}
                  key={m.month}
                  onMouseLeave={() => setHoveredState(null)}
                >
                  {/* MUI Column Highlight Overlay on hover */}
                  <div className={styles.columnHighlight} />

                  {/* MUI Style Floating Tooltip right above hovered segment */}
                  {isCurrentMonthHovered && (
                    <div
                      className={styles.tooltip}
                      style={{ bottom: `${tooltipBottomPx}px` }}
                    >
                      <div className={styles.tooltipHeader}>{m.month}</div>
                      <div className={styles.tooltipBody}>
                        {activeSeries === "gbta" ? (
                          <>
                            <span className={styles.tooltipDotOrange} />
                            <span>GBTA:</span>
                            <span className={styles.tooltipValue}>
                              ${m.gbta.toLocaleString("en-US")}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className={styles.tooltipDotBlue} />
                            <span>DSCA:</span>
                            <span className={styles.tooltipValue}>
                              ${m.dsca.toLocaleString("en-US")}
                            </span>
                          </>
                        )}
                      </div>
                      <div className={styles.tooltipCaret} />
                    </div>
                  )}

                  {/* Stacked Bar (30px wide) */}
                  <div className={styles.stackedBar}>
                    {/* Blue bottom bar: DSCA */}
                    <div
                      className={styles.barBlue}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setHoveredState({ monthIndex: idx, series: "dsca" });
                      }}
                      style={{ height: `${bluePx}px` }}
                    />

                    {/* Orange top bar: GBTA */}
                    <div
                      className={styles.barOrange}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setHoveredState({ monthIndex: idx, series: "gbta" });
                      }}
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
