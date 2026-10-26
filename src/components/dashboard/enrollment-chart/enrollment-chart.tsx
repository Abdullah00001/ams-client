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
const PADDING_X = 24;
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

export function EnrollmentChart() {
  const gradientId = useId();
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const yearData =
    ENROLLMENT_CHART_YEARS[selectedYear] ?? ENROLLMENT_CHART_YEARS[2024];

  // Calculate coordinates for points
  const usableWidth = VIEW_WIDTH - PADDING_X * 2;
  const usableHeight = VIEW_HEIGHT - PADDING_Y * 2;

  const points = yearData.months.map((m, idx) => {
    const x = PADDING_X + (idx / (yearData.months.length - 1)) * usableWidth;
    const y =
      VIEW_HEIGHT -
      PADDING_Y -
      (Math.min(m.count, MAX_VALUE) / MAX_VALUE) * usableHeight;
    return { x, y, month: m.month, count: m.count };
  });

  const lastYearPoints = yearData.months.map((m, idx) => {
    const x = PADDING_X + (idx / (yearData.months.length - 1)) * usableWidth;
    const y =
      VIEW_HEIGHT -
      PADDING_Y -
      (Math.min(m.lastYearCount, MAX_VALUE) / MAX_VALUE) * usableHeight;
    return { x, y };
  });

  const splineLinePath = buildSmoothSplinePath(points);
  const splineAreaPath = buildSmoothSplinePath(points, true);

  const lastYearSplineLinePath = buildSmoothSplinePath(lastYearPoints);
  const lastYearSplineAreaPath = buildSmoothSplinePath(lastYearPoints, true);

  // Active hover point for tooltip
  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : null;

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

        {/* Year Dropdown */}
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

      {/* Metric Summary Row (Exact Image 1 layout) */}
      <div className={styles.metricsRow}>
        <div className={styles.metricItem}>
          <div className={styles.metricHeader}>
            <span className={styles.metricDotPrimary} />
            <span>This year</span>
          </div>
          <span className={styles.metricValue}>
            {yearData.total.toLocaleString("en-US")}
          </span>
        </div>

        <div className={styles.metricItem}>
          <div className={styles.metricHeader}>
            <span className={styles.metricDotSecondary} />
            <span>Last year</span>
          </div>
          <span className={styles.metricValue}>
            {(yearData.total * 0.86).toFixed(0)}
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className={styles.chartContainer}>
        {/* Y-Axis */}
        <div className={styles.yAxis}>
          <span className={styles.yLabel}>250</span>
          <span className={styles.yLabel}>200</span>
          <span className={styles.yLabel}>150</span>
          <span className={styles.yLabel}>100</span>
          <span className={styles.yLabel}>50</span>
          <span className={styles.yLabel}>0</span>
        </div>

        {/* Plot Area */}
        <div className={styles.plotArea}>
          <svg
            className={styles.svg}
            preserveAspectRatio="none"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          >
            <defs>
              {/* Primary Blue Gradient (AMS Primary 300) */}
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

              {/* Secondary Amber/Orange Gradient (AMS Status Warning / GBTA Orange) */}
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

            {/* Horizontal Dashed Gridlines (5 levels) */}
            {[0, 1, 2, 3, 4, 5].map((lvl) => {
              const y = PADDING_Y + (lvl / 5) * (VIEW_HEIGHT - PADDING_Y * 2);
              return (
                <line
                  key={lvl}
                  stroke="#eff1f4"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  x1={PADDING_X}
                  x2={VIEW_WIDTH - PADDING_X}
                  y1={y}
                  y2={y}
                />
              );
            })}

            {/* Last Year Area & Line (AMS Orange) */}
            <path
              d={lastYearSplineAreaPath}
              fill={`url(#${gradientId}-orange)`}
            />
            <path
              d={lastYearSplineLinePath}
              fill="none"
              stroke="#ffa500"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {/* This Year Area & Line (AMS Primary Blue) */}
            <path d={splineAreaPath} fill={`url(#${gradientId}-blue)`} />
            <path
              d={splineLinePath}
              fill="none"
              stroke="#1b84ff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.75"
            />

            {/* Hover Vertical Guide Line & Glow Circle */}
            {activePoint && (
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
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  fill="#ffffff"
                  r="6"
                  stroke="#1b84ff"
                  strokeWidth="3"
                />
              </>
            )}

            {/* Transparent Vertical Hover Columns */}
            {points.map((p, idx) => {
              const colWidth = usableWidth / points.length;
              const colX = p.x - colWidth / 2;
              return (
                <rect
                  cursor="pointer"
                  fill="transparent"
                  height={VIEW_HEIGHT}
                  key={p.month}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  width={colWidth}
                  x={colX}
                  y={0}
                />
              );
            })}
          </svg>

          {/* Floating MUI Tooltip */}
          {activePoint && (
            <div
              className={styles.tooltip}
              style={{
                left: `${(activePoint.x / VIEW_WIDTH) * 100}%`,
                top: `${(activePoint.y / VIEW_HEIGHT) * 100 - 18}%`,
              }}
            >
              <div className={styles.tooltipHeader}>
                {activePoint.month} {selectedYear}
              </div>
              <div className={styles.tooltipBody}>
                <span className={styles.tooltipDot} />
                <span>Enrolled:</span>
                <span className={styles.tooltipValue}>
                  {activePoint.count} students
                </span>
              </div>
              <div className={styles.tooltipCaret} />
            </div>
          )}

          {/* X-Axis Labels */}
          <div className={styles.xAxis}>
            {yearData.months.map((m, idx) => (
              <span
                className={`${styles.xLabel} ${hoveredIndex === idx ? styles.xLabelActive : ""}`}
                key={m.month}
              >
                {m.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
