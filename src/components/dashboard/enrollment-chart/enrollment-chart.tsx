"use client";

import { useState, useId, type MouseEvent } from "react";
import { Popover } from "@base-ui/react/popover";
import { ChevronDown } from "lucide-react";
import {
  ENROLLMENT_CHART_YEARS,
  ENROLLMENT_YEAR_OPTIONS,
} from "./enrollment-chart-data";
import styles from "./enrollment-chart.module.css";

const MAX_VALUE = 200;
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
    return { x, y };
  });

  const dscaSplineLinePath = buildSmoothSplinePath(dscaPoints);
  const dscaSplineAreaPath = buildSmoothSplinePath(dscaPoints, true);

  const gbtaSplineLinePath = buildSmoothSplinePath(gbtaPoints);
  const gbtaSplineAreaPath = buildSmoothSplinePath(gbtaPoints, true);

  // Active hover point for tooltip
  const activePoint = hoveredIndex !== null ? dscaPoints[hoveredIndex] : null;
  const activeGbtaPoint = hoveredIndex !== null ? gbtaPoints[hoveredIndex] : null;

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
        {/* Y-Axis */}
        <div className={styles.yAxis}>
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

            {/* Horizontal Dashed Gridlines */}
            {[0, 1, 2, 3, 4].map((lvl) => {
              const y = PADDING_Y + (lvl / 4) * (VIEW_HEIGHT - PADDING_Y * 2);
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

            {/* GBTA Area & Line (Orange) */}
            <path
              d={gbtaSplineAreaPath}
              fill={`url(#${gradientId}-orange)`}
            />
            <path
              d={gbtaSplineLinePath}
              fill="none"
              stroke="#ffa500"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {/* DSCA Area & Line (Primary Blue) */}
            <path d={dscaSplineAreaPath} fill={`url(#${gradientId}-blue)`} />
            <path
              d={dscaSplineLinePath}
              fill="none"
              stroke="#1b84ff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.75"
            />

            {/* Hover Vertical Guide Line & Glow Circles */}
            {activePoint && activeGbtaPoint && (
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
                {/* DSCA glowing circle */}
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  fill="#ffffff"
                  r="6"
                  stroke="#1b84ff"
                  strokeWidth="3"
                />
                {/* GBTA glowing circle */}
                <circle
                  cx={activeGbtaPoint.x}
                  cy={activeGbtaPoint.y}
                  fill="#ffffff"
                  r="6"
                  stroke="#ffa500"
                  strokeWidth="3"
                />
              </>
            )}

            {/* Transparent Vertical Hover Columns */}
            {dscaPoints.map((p, idx) => {
              const colWidth = usableWidth / dscaPoints.length;
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
                top: `${(Math.min(activePoint.y, activeGbtaPoint ? activeGbtaPoint.y : activePoint.y) / VIEW_HEIGHT) * 100 - 18}%`,
              }}
            >
              <div className={styles.tooltipHeader}>
                {activePoint.month} {selectedYear}
              </div>
              <div className={styles.tooltipBody}>
                <div className={styles.tooltipRow}>
                  <span className={styles.tooltipDotBlue} />
                  <span>DSCA:</span>
                  <span className={styles.tooltipValue}>
                    {activePoint.dsca} students
                  </span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.tooltipDotOrange} />
                  <span>GBTA:</span>
                  <span className={styles.tooltipValue}>
                    {activePoint.gbta} students
                  </span>
                </div>
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

      {/* Bottom Legend (Centered - matching RevenueChart) */}
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
