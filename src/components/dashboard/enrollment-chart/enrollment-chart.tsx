"use client";

import { useState, useId, type MouseEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import {
  ENROLLMENT_CHART_YEARS,
  ENROLLMENT_YEAR_OPTIONS,
} from "./enrollment-chart-data";
import styles from "./enrollment-chart.module.css";

const MAX_VALUE = 250;
const VIEW_WIDTH = 560;
const VIEW_HEIGHT = 200;
const PADDING_X = 0;
const PADDING_Y = 16;

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

/**
 * Creates smooth cubic bezier path through data points (Catmull-Rom spline)
 */
function buildSmoothSplinePath(
  points: { x: number; y: number }[],
  isArea = false,
  baselineY = VIEW_HEIGHT - PADDING_Y,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  if (isArea) {
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    d += ` L ${lastX.toFixed(1)} ${baselineY} L ${firstX.toFixed(1)} ${baselineY} Z`;
  }

  return d;
}

function getTooltipStyle(
  monthIndex: number,
  point: { x: number; y: number },
): React.CSSProperties {
  const topPercent = (point.y / VIEW_HEIGHT) * 100;

  if (monthIndex === 0) {
    return {
      left: "0%",
      top: `${topPercent}%`,
      transform: "translate(0, calc(-100% - 14px))",
    };
  }

  if (monthIndex === 11) {
    return {
      left: "100%",
      top: `${topPercent}%`,
      transform: "translate(-100%, calc(-100% - 14px))",
    };
  }

  return {
    left: `${(point.x / VIEW_WIDTH) * 100}%`,
    top: `${topPercent}%`,
    transform: "translate(-50%, calc(-100% - 14px))",
  };
}

function getCaretStyle(monthIndex: number): React.CSSProperties {
  if (monthIndex === 0) {
    return {
      left: "16px",
      right: "auto",
      transform: "rotate(45deg)",
    };
  }

  if (monthIndex === 11) {
    return {
      left: "auto",
      right: "16px",
      transform: "rotate(45deg)",
    };
  }

  return {
    left: "50%",
    right: "auto",
    transform: "translateX(-50%) rotate(45deg)",
  };
}

export function EnrollmentChart() {
  const gradientId = useId();
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [hoveredState, setHoveredState] = useState<{
    monthIndex: number;
    series: "dsca" | "gbta";
  } | null>(null);
  const [hoveredLegendSeries, setHoveredLegendSeries] = useState<
    "dsca" | "gbta" | null
  >(null);

  const yearData =
    ENROLLMENT_CHART_YEARS[selectedYear] ?? ENROLLMENT_CHART_YEARS[2024];

  // Calculate coordinates for points (edge-to-edge spanning from x=0 to x=VIEW_WIDTH)
  const usableWidth = VIEW_WIDTH - PADDING_X * 2;
  const usableHeight = VIEW_HEIGHT - PADDING_Y * 2;

  // Blue line: DSCA
  const dscaPoints = yearData.months.map((m, idx) => {
    const x = PADDING_X + (idx / (yearData.months.length - 1)) * usableWidth;
    const y =
      VIEW_HEIGHT -
      PADDING_Y -
      (Math.min(m.dsca, MAX_VALUE) / MAX_VALUE) * usableHeight;
    return { x, y, month: m.month, dsca: m.dsca, gbta: m.gbta };
  });

  // Orange line: GBTA
  const gbtaPoints = yearData.months.map((m, idx) => {
    const x = PADDING_X + (idx / (yearData.months.length - 1)) * usableWidth;
    const y =
      VIEW_HEIGHT -
      PADDING_Y -
      (Math.min(m.gbta, MAX_VALUE) / MAX_VALUE) * usableHeight;
    return { x, y, month: m.month, dsca: m.dsca, gbta: m.gbta };
  });

  const dscaSplineLinePath = buildSmoothSplinePath(dscaPoints);
  const dscaSplineAreaPath = buildSmoothSplinePath(dscaPoints, true);

  const gbtaSplineLinePath = buildSmoothSplinePath(gbtaPoints);
  const gbtaSplineAreaPath = buildSmoothSplinePath(gbtaPoints, true);

  // Active series resolution
  const activeSeries =
    hoveredState?.series ?? hoveredLegendSeries ?? null;
  const isAnyActive = activeSeries !== null;

  const isDscaProminent = !isAnyActive || activeSeries === "dsca";
  const isGbtaProminent = !isAnyActive || activeSeries === "gbta";

  // Active hover point for tooltip & single circle
  const activePoint =
    hoveredState !== null
      ? hoveredState.series === "dsca"
        ? dscaPoints[hoveredState.monthIndex]
        : gbtaPoints[hoveredState.monthIndex]
      : null;

  const activeMonth =
    hoveredState !== null ? yearData.months[hoveredState.monthIndex] : null;

  const handlePlotMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const ratioX = Math.max(0, Math.min(1, rawX / rect.width));
    const monthIdx = Math.round(ratioX * (yearData.months.length - 1));

    const svgY = (rawY / rect.height) * VIEW_HEIGHT;

    const dscaY = dscaPoints[monthIdx].y;
    const gbtaY = gbtaPoints[monthIdx].y;

    const distDsca = Math.abs(svgY - dscaY);
    const distGbta = Math.abs(svgY - gbtaY);

    const series: "dsca" | "gbta" = distDsca <= distGbta ? "dsca" : "gbta";

    setHoveredState({ monthIndex: monthIdx, series });
  };

  const handlePlotMouseLeave = () => {
    setHoveredState(null);
  };

  return (
    <section aria-label="New Enrollments Per Month" className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>New Enrollments</h2>
          <p className={styles.subtitle}>
            (+{yearData.growthPercentage}%) than last year
          </p>
        </div>

        {/* Year Dropdown with TouchRipple */}
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
            >
              <Popover.Popup className={styles.yearPopup}>
                {ENROLLMENT_YEAR_OPTIONS.map((yr) => (
                  <button
                    className={`${styles.yearOption} ${yr === selectedYear ? styles.yearOptionSelected : ""}`}
                    key={yr}
                    onMouseDown={createRipple}
                    onClick={() => {
                      setSelectedYear(yr);
                      window.setTimeout(() => {
                        setIsYearOpen(false);
                      }, 180);
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

      {/* Chart Canvas Area */}
      <div className={styles.chartContainer}>
        {/* Y-Axis: 250 down to 0 */}
        <div className={styles.yAxis}>
          <span className={styles.yLabel}>250</span>
          <span className={styles.yLabel}>200</span>
          <span className={styles.yLabel}>150</span>
          <span className={styles.yLabel}>100</span>
          <span className={styles.yLabel}>50</span>
          <span className={styles.yLabel}>0</span>
        </div>

        {/* Plot Area */}
        <div
          className={styles.plotArea}
          onMouseLeave={handlePlotMouseLeave}
          onMouseMove={handlePlotMouseMove}
        >
          <svg
            className={styles.svg}
            preserveAspectRatio="none"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          >
            <defs>
              {/* Primary Blue Gradient (DSCA) */}
              <linearGradient
                id={`${gradientId}-blue`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#1b84ff" stopOpacity="0.25" />
                <stop offset="85%" stopColor="#1b84ff" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#1b84ff" stopOpacity="0.0" />
              </linearGradient>

              {/* Orange Gradient (GBTA) */}
              <linearGradient
                id={`${gradientId}-orange`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ffa500" stopOpacity="0.20" />
                <stop offset="85%" stopColor="#ffa500" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#ffa500" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dashed Gridlines spanning edge-to-edge */}
            {[0, 1, 2, 3, 4, 5].map((lvl) => {
              const y = PADDING_Y + (lvl / 5) * (VIEW_HEIGHT - PADDING_Y * 2);
              return (
                <line
                  key={lvl}
                  stroke="#eff1f4"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  x1={0}
                  x2={VIEW_WIDTH}
                  y1={y}
                  y2={y}
                />
              );
            })}

            {/* GBTA Area & Line (Orange) */}
            <path
              className={styles.pathTransition}
              d={gbtaSplineAreaPath}
              fill={`url(#${gradientId}-orange)`}
              opacity={isGbtaProminent ? 1 : 0.1}
            />
            <path
              className={styles.pathTransition}
              d={gbtaSplineLinePath}
              fill="none"
              opacity={isGbtaProminent ? 1 : 0.25}
              stroke="#ffa500"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                hoveredState?.series === "gbta" || hoveredLegendSeries === "gbta"
                  ? 3.5
                  : 2.5
              }
            />

            {/* DSCA Area & Line (Primary Blue) */}
            <path
              className={styles.pathTransition}
              d={dscaSplineAreaPath}
              fill={`url(#${gradientId}-blue)`}
              opacity={isDscaProminent ? 1 : 0.1}
            />
            <path
              className={styles.pathTransition}
              d={dscaSplineLinePath}
              fill="none"
              opacity={isDscaProminent ? 1 : 0.25}
              stroke="#1b84ff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                hoveredState?.series === "dsca" || hoveredLegendSeries === "dsca"
                  ? 3.75
                  : 2.75
              }
            />

            {/* Hover Vertical Guide Line & Single Glowing Circle on Hovered Line */}
            {hoveredState && activePoint && (
              <>
                <line
                  stroke="#99a1b7"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={PADDING_Y}
                  y2={VIEW_HEIGHT - PADDING_Y}
                />
                {/* Single Glowing Circle matching the hovered line */}
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  fill="#ffffff"
                  r="6"
                  stroke={hoveredState.series === "dsca" ? "#1b84ff" : "#ffa500"}
                  strokeWidth="3.5"
                />
              </>
            )}
          </svg>

          {/* Floating MUI Tooltip - Only displays data for the hovered branch line */}
          {hoveredState && activePoint && activeMonth && (
            <div
              className={styles.tooltip}
              style={getTooltipStyle(hoveredState.monthIndex, activePoint)}
            >
              <div className={styles.tooltipHeader}>
                {activeMonth.month} {selectedYear}
              </div>
              <div className={styles.tooltipBody}>
                <div className={styles.tooltipRow}>
                  <span
                    className={
                      hoveredState.series === "dsca"
                        ? styles.tooltipDotBlue
                        : styles.tooltipDotOrange
                    }
                  />
                  <span>
                    {hoveredState.series === "dsca" ? "DSCA:" : "GBTA:"}
                  </span>
                  <span className={styles.tooltipValue}>
                    {hoveredState.series === "dsca"
                      ? activeMonth.dsca
                      : activeMonth.gbta}{" "}
                    students
                  </span>
                </div>
              </div>
              <div
                className={styles.tooltipCaret}
                style={getCaretStyle(hoveredState.monthIndex)}
              />
            </div>
          )}

          {/* X-Axis Month Labels: Aligned perfectly from 'J' of Jan at 0 to 'c' of Dec at 100% */}
          <div className={styles.xAxis}>
            {yearData.months.map((m, idx) => {
              let positionStyle: React.CSSProperties;
              if (idx === 0) {
                positionStyle = {
                  left: "0%",
                  transform: "none",
                  textAlign: "left",
                };
              } else if (idx === yearData.months.length - 1) {
                positionStyle = {
                  left: "100%",
                  transform: "translateX(-100%)",
                  textAlign: "right",
                };
              } else {
                positionStyle = {
                  left: `${(idx / (yearData.months.length - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                };
              }

              const isHovered = hoveredState?.monthIndex === idx;

              return (
                <span
                  className={`${styles.xLabel} ${isHovered ? styles.xLabelActive : ""}`}
                  key={m.month}
                  style={positionStyle}
                >
                  {m.month}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Legend (Centered - matching RevenueChart with interactive hover) */}
      <div className={styles.legend}>
        <div
          className={`${styles.legendItem} ${hoveredLegendSeries === "dsca" || hoveredState?.series === "dsca" ? styles.legendItemActive : ""}`}
          onMouseEnter={() => setHoveredLegendSeries("dsca")}
          onMouseLeave={() => setHoveredLegendSeries(null)}
        >
          <span className={`${styles.legendDot} ${styles.legendDotBlue}`} />
          <span>DSCA</span>
        </div>
        <div
          className={`${styles.legendItem} ${hoveredLegendSeries === "gbta" || hoveredState?.series === "gbta" ? styles.legendItemActive : ""}`}
          onMouseEnter={() => setHoveredLegendSeries("gbta")}
          onMouseLeave={() => setHoveredLegendSeries(null)}
        >
          <span className={`${styles.legendDot} ${styles.legendDotOrange}`} />
          <span>GBTA</span>
        </div>
      </div>
    </section>
  );
}
