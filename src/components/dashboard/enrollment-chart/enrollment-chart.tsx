"use client";

import { useState, useId, useRef, useEffect, type MouseEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import {
  ENROLLMENT_CHART_YEARS,
  ENROLLMENT_YEAR_OPTIONS,
} from "./enrollment-chart-data";
import styles from "./enrollment-chart.module.css";

const MAX_VALUE = 250;
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
 * Creates smooth cubic bezier path through data points (tension = 0.28 for natural curves)
 */
function buildSmoothSplinePath(
  points: { x: number; y: number }[],
  isArea = false,
  baselineY = 200,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  const tension = 0.28;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  if (isArea) {
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    d += ` L ${lastX.toFixed(1)} ${baselineY.toFixed(1)} L ${firstX.toFixed(1)} ${baselineY.toFixed(1)} Z`;
  }

  return d;
}

function getTooltipStyle(
  monthIndex: number,
  point: { x: number; y: number },
  viewWidth: number,
): React.CSSProperties {
  const topPx = point.y;

  if (monthIndex === 0) {
    return {
      left: "0px",
      top: `${topPx}px`,
      transform: "translate(0, calc(-100% - 12px))",
    };
  }

  if (monthIndex === 11) {
    return {
      left: `${viewWidth}px`,
      top: `${topPx}px`,
      transform: "translate(-100%, calc(-100% - 12px))",
    };
  }

  return {
    left: `${point.x}px`,
    top: `${topPx}px`,
    transform: "translate(-50%, calc(-100% - 12px))",
  };
}

function getCaretStyle(monthIndex: number): React.CSSProperties {
  if (monthIndex === 0) {
    return {
      left: "14px",
      right: "auto",
      transform: "rotate(45deg)",
    };
  }

  if (monthIndex === 11) {
    return {
      left: "auto",
      right: "14px",
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
  const plotAreaRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [hoveredState, setHoveredState] = useState<{
    monthIndex: number;
    series: "dsca" | "gbta";
  } | null>(null);
  const [hoveredLegendSeries, setHoveredLegendSeries] = useState<
    "dsca" | "gbta" | null
  >(null);

  // Exact 1:1 screen pixel dimensions (no stretching, perfect circles)
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 220,
  });

  useEffect(() => {
    if (!plotAreaRef.current) return;
    const updateSize = () => {
      if (!plotAreaRef.current) return;
      const rect = plotAreaRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(plotAreaRef.current);
    return () => ro.disconnect();
  }, []);

  const viewWidth = dimensions.width;
  const viewHeight = dimensions.height;

  const yearData =
    ENROLLMENT_CHART_YEARS[selectedYear] ?? ENROLLMENT_CHART_YEARS[2024];

  // Calculate coordinates in 1:1 physical pixels (edge-to-edge from 0 to viewWidth)
  const usableWidth = viewWidth;
  const usableHeight = viewHeight - PADDING_Y * 2;

  // Blue line: DSCA
  const dscaPoints = yearData.months.map((m, idx) => {
    const x = (idx / (yearData.months.length - 1)) * usableWidth;
    const y =
      viewHeight -
      PADDING_Y -
      (Math.min(m.dsca, MAX_VALUE) / MAX_VALUE) * usableHeight;
    return { x, y, month: m.month, dsca: m.dsca, gbta: m.gbta };
  });

  // Orange line: GBTA
  const gbtaPoints = yearData.months.map((m, idx) => {
    const x = (idx / (yearData.months.length - 1)) * usableWidth;
    const y =
      viewHeight -
      PADDING_Y -
      (Math.min(m.gbta, MAX_VALUE) / MAX_VALUE) * usableHeight;
    return { x, y, month: m.month, dsca: m.dsca, gbta: m.gbta };
  });

  const baselineY = viewHeight - PADDING_Y;
  const dscaSplineLinePath = buildSmoothSplinePath(dscaPoints, false, baselineY);
  const dscaSplineAreaPath = buildSmoothSplinePath(dscaPoints, true, baselineY);

  const gbtaSplineLinePath = buildSmoothSplinePath(gbtaPoints, false, baselineY);
  const gbtaSplineAreaPath = buildSmoothSplinePath(gbtaPoints, true, baselineY);

  // Active series resolution
  const activeSeries =
    hoveredState?.series ?? hoveredLegendSeries ?? null;
  const isAnyActive = activeSeries !== null;

  const isDscaProminent = !isAnyActive || activeSeries === "dsca";
  const isGbtaProminent = !isAnyActive || activeSeries === "gbta";

  // Active hover points for tooltip & circles
  const activeDscaPoint =
    hoveredState !== null ? dscaPoints[hoveredState.monthIndex] : null;
  const activeGbtaPoint =
    hoveredState !== null ? gbtaPoints[hoveredState.monthIndex] : null;

  const activePoint =
    hoveredState !== null
      ? hoveredState.series === "dsca"
        ? activeDscaPoint
        : activeGbtaPoint
      : null;

  const activeMonth =
    hoveredState !== null ? yearData.months[hoveredState.monthIndex] : null;


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
              style={{ zIndex: 9999 }}
            >
              <Popover.Popup className={styles.yearPopup}>
                {ENROLLMENT_YEAR_OPTIONS.map((yr) => (
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
          ref={plotAreaRef}
        >
          <svg
            className={styles.svg}
            height={viewHeight}
            viewBox={`0 0 ${viewWidth} ${viewHeight}`}
            width={viewWidth}
          >
            <defs>
              {/* Emerald Green Gradient (DSCA) - Light, airy MUI aesthetic */}
              <linearGradient
                id={`${gradientId}-blue`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#028c4a" stopOpacity="0.16" />
                <stop offset="70%" stopColor="#028c4a" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#028c4a" stopOpacity="0.0" />
              </linearGradient>

              {/* Orange Gradient (GBTA) - Light, airy MUI aesthetic */}
              <linearGradient
                id={`${gradientId}-orange`}
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ff7724" stopOpacity="0.14" />
                <stop offset="70%" stopColor="#ff7724" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#ff7724" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Dashed Gridlines spanning edge-to-edge */}
            {[0, 1, 2, 3, 4, 5].map((lvl) => {
              const y = PADDING_Y + (lvl / 5) * (viewHeight - PADDING_Y * 2);
              return (
                <line
                  key={lvl}
                  stroke="#eff1f4"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  x1={0}
                  x2={viewWidth}
                  y1={y}
                  y2={y}
                />
              );
            })}

            {/* GBTA Area & Line (Orange) - Thin crisp 2px line */}
            <path
              className={styles.pathTransition}
              d={gbtaSplineAreaPath}
              fill={`url(#${gradientId}-orange)`}
              opacity={isGbtaProminent ? 1 : 0.08}
            />
            <path
              className={styles.pathTransition}
              d={gbtaSplineLinePath}
              fill="none"
              opacity={isGbtaProminent ? 1 : 0.3}
              stroke="#ff7724"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                hoveredState?.series === "gbta" || hoveredLegendSeries === "gbta"
                  ? 2.25
                  : 1.85
              }
              vectorEffect="non-scaling-stroke"
            />

            {/* DSCA Area & Line (Emerald Green) - Thin crisp 2px line */}
            <path
              className={styles.pathTransition}
              d={dscaSplineAreaPath}
              fill={`url(#${gradientId}-blue)`}
              opacity={isDscaProminent ? 1 : 0.08}
            />
            <path
              className={styles.pathTransition}
              d={dscaSplineLinePath}
              fill="none"
              opacity={isDscaProminent ? 1 : 0.3}
              stroke="#028c4a"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={
                hoveredState?.series === "dsca" || hoveredLegendSeries === "dsca"
                  ? 2.5
                  : 2.0
              }
              vectorEffect="non-scaling-stroke"
            />

            {/* Vertical Guide Line & Crisp Circle for the hovered series ONLY */}
            {hoveredState && activePoint && (
              <>
                {/* Thin, crisp dashed vertical guide */}
                <line
                  stroke="#cbd5e1"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={PADDING_Y}
                  y2={viewHeight - PADDING_Y}
                />

                {/* Soft Glowing Halo around the hovered point */}
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  fill={hoveredState.series === "dsca" ? "#028c4a" : "#ff7724"}
                  fillOpacity="0.2"
                  r="8"
                />

                {/* Single Crisp Point Circle on the hovered line */}
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  fill={hoveredState.series === "dsca" ? "#028c4a" : "#ff7724"}
                  r="4.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>

          {/* HTML Flex Overlay for 100% bulletproof mouse hover across all browsers */}
          <div
            className={styles.hoverOverlay}
            onMouseLeave={() => setHoveredState(null)}
          >
            {yearData.months.map((m, idx) => (
              <div
                className={styles.hoverColumn}
                key={m.month}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const rawY = e.clientY - rect.top;
                  const dscaY = dscaPoints[idx].y;
                  const gbtaY = gbtaPoints[idx].y;
                  const series: "dsca" | "gbta" =
                    Math.abs(rawY - dscaY) <= Math.abs(rawY - gbtaY)
                      ? "dsca"
                      : "gbta";
                  setHoveredState({ monthIndex: idx, series });
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const rawY = e.clientY - rect.top;
                  const dscaY = dscaPoints[idx].y;
                  const gbtaY = gbtaPoints[idx].y;
                  const series: "dsca" | "gbta" =
                    Math.abs(rawY - dscaY) <= Math.abs(rawY - gbtaY)
                      ? "dsca"
                      : "gbta";
                  setHoveredState({ monthIndex: idx, series });
                }}
              />
            ))}
          </div>

          {/* Floating MUI Tooltip - Only displays data for the hovered branch line */}
          {hoveredState && activePoint && activeMonth && (
            <div
              className={styles.tooltip}
              style={getTooltipStyle(hoveredState.monthIndex, activePoint, viewWidth)}
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
                  left: "0px",
                  transform: "none",
                  textAlign: "left",
                };
              } else if (idx === yearData.months.length - 1) {
                positionStyle = {
                  right: "0px",
                  left: "auto",
                  transform: "none",
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

      {/* Bottom Legend (Centered - matching RevenueChart) */}
      <div className={styles.legend}>
        <div
          className={styles.legendItem}
          onMouseEnter={() => setHoveredLegendSeries("dsca")}
          onMouseLeave={() => setHoveredLegendSeries(null)}
        >
          <span className={`${styles.legendDot} ${styles.legendDotBlue}`} />
          <span>DSCA</span>
        </div>
        <div
          className={styles.legendItem}
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
