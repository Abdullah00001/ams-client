/**
 * @fileoverview Top Branches Donut Chart (Row 3 Right)
 * @module features/dashboard/components/top-branches
 *
 * Visualizes revenue and student distribution across branches via an interactive
 * SVG annular donut chart with:
 *  - Dynamic slice expansion and elevation on hover.
 *  - Floating tooltip displaying active students and revenue contribution.
 *  - Synchronized bidirectional hover highlighting with bottom legend list.
 *  - Equal bottom padding to match Row 3 Left Enrollment chart.
 */

"use client";

import { useState, useRef, type MouseEvent } from "react";
import Link from "next/link";
import {
  TOP_BRANCHES_DATA,
  TOTAL_REVENUE_COUNT,
  type BranchPerformance,
} from "./top-branches-data";
import styles from "./top-branches.module.css";

/**
 * Universal Material UI TouchRipple event handler.
 *
 * @param {MouseEvent<HTMLElement>} event - Mouse or pointer event
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
 * Computes the exact SVG path for an annular sector (donut slice).
 * Uses standard Cartesian coordinates with 12 o'clock as -Math.PI / 2.
 *
 * @param {number} cx - Center x coordinate
 * @param {number} cy - Center y coordinate
 * @param {number} rInner - Inner radius (donut hole)
 * @param {number} rOuter - Outer radius of the donut
 * @param {number} startAngle - Start angle in radians
 * @param {number} endAngle - End angle in radians
 * @returns {string} SVG path d attribute string
 */
function describeArc(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startAngle: number,
  endAngle: number,
): string {
  const x1 = cx + rOuter * Math.cos(startAngle);
  const y1 = cy + rOuter * Math.sin(startAngle);
  const x2 = cx + rOuter * Math.cos(endAngle);
  const y2 = cy + rOuter * Math.sin(endAngle);

  const x3 = cx + rInner * Math.cos(endAngle);
  const y3 = cy + rInner * Math.sin(endAngle);
  const x4 = cx + rInner * Math.cos(startAngle);
  const y4 = cy + rInner * Math.sin(startAngle);

  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    "Z",
  ].join(" ");
}

export function TopBranches() {
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
    align: "left" | "right";
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Exact Donut Geometry (Zero Gap / Continuous Ring matching MUI exactly)
  const segments = TOP_BRANCHES_DATA.map((branch, idx) => {
    const priorPercent = TOP_BRANCHES_DATA.slice(0, idx).reduce(
      (sum, b) => sum + b.percentage,
      0,
    );
    const startAngle =
      -Math.PI / 2 + (priorPercent / 100) * 2 * Math.PI;
    const endAngle =
      -Math.PI / 2 +
      ((priorPercent + branch.percentage) / 100) * 2 * Math.PI;

    const normalPath = describeArc(115, 115, 70, 92, startAngle, endAngle);
    const hoveredPath = describeArc(115, 115, 68, 97, startAngle, endAngle);

    // Mid-angle on outer perimeter for default tooltip anchoring on legend hover
    const midAngle = (startAngle + endAngle) / 2;
    const defaultX = 115 + 104 * Math.cos(midAngle);
    const defaultY = 115 + 104 * Math.sin(midAngle);

    return {
      ...branch,
      startAngle,
      endAngle,
      normalPath,
      hoveredPath,
      defaultX,
      defaultY,
    };
  });

  const activeSegment = segments.find((b) => b.id === hoveredBranchId);
  const activeBranch: BranchPerformance | null = activeSegment ?? null;

  const handleSliceMouseMove = (e: MouseEvent<SVGPathElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Center of donut in wrapper pixels
    const centerX = rect.width / 2;
    const isRightSide = rawX >= centerX;

    // Tooltip placed with offset away from the center hole, NEVER obscuring the number!
    setTooltipPos({
      x: isRightSide ? rawX + 14 : rawX - 14,
      y: rawY - 10,
      align: isRightSide ? "left" : "right",
    });
  };

  const handleLegendHover = (branchId: string | null) => {
    setHoveredBranchId(branchId);
    if (!branchId) {
      setTooltipPos(null);
      return;
    }
    const seg = segments.find((s) => s.id === branchId);
    if (seg && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const segX = centerX + (seg.defaultX - 115);
      const segY = centerY + (seg.defaultY - 115);
      const isRightSide = segX >= centerX;

      setTooltipPos({
        x: isRightSide ? segX + 8 : segX - 8,
        y: segY,
        align: isRightSide ? "left" : "right",
      });
    }
  };

  const resetSelection = () => {
    setHoveredBranchId(null);
    setTooltipPos(null);
  };

  return (
    <section aria-label="Top Performing Branch" className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Top Performing Branch</h2>
        <p className={styles.subtitle}>Ranked by revenue this month</p>
      </div>

      {/* Donut Chart (Exact MUI Style & AMS Theme) */}
      <div
        className={styles.donutWrapper}
        onClick={(e) => {
          if (
            e.target === wrapperRef.current ||
            (e.target as HTMLElement).tagName === "svg"
          ) {
            resetSelection();
          }
        }}
        ref={wrapperRef}
      >
        <svg
          className={styles.donutSvg}
          style={{ overflow: "visible" }}
          viewBox="0 0 230 230"
        >
          {segments.map((s) => {
            const isHovered = hoveredBranchId === s.id;
            const isDimmed =
              hoveredBranchId !== null && hoveredBranchId !== s.id;

            return (
              <path
                className={`${styles.donutSlice} ${isHovered ? styles.donutSliceHovered : ""} ${isDimmed ? styles.donutSliceDimmed : ""}`}
                d={isHovered ? s.hoveredPath : s.normalPath}
                fill={s.color}
                key={s.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hoveredBranchId === s.id) {
                    resetSelection();
                  } else {
                    setHoveredBranchId(s.id);
                    handleSliceMouseMove(e);
                  }
                }}
                onMouseEnter={(e) => {
                  setHoveredBranchId(s.id);
                  handleSliceMouseMove(e);
                }}
                onMouseLeave={resetSelection}
                onMouseMove={handleSliceMouseMove}
              />
            );
          })}
        </svg>

        {/* Donut Center Display (Clickable & hoverable to reset to Total) */}
        <div
          aria-label="Reset selection to total"
          className={styles.donutCenter}
          onClick={resetSelection}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              resetSelection();
            }
          }}
          onMouseEnter={resetSelection}
          role="button"
          tabIndex={0}
          title="Click to reset to total"
        >
          <span
            className={styles.donutCenterLabel}
            style={{
              color: activeBranch ? activeBranch.color : undefined,
            }}
          >
            {activeBranch ? activeBranch.shortName : "Total"}
          </span>
          <span className={styles.donutCenterValue}>
            {activeBranch ? activeBranch.revenueFormatted : TOTAL_REVENUE_COUNT}
          </span>
        </div>

        {/* Floating Pill Tooltip (Positioned safely away from the center hole) */}
        {activeSegment && tooltipPos && (
          <div
            className={`${styles.tooltip} ${tooltipPos.align === "right" ? styles.tooltipAlignRight : styles.tooltipAlignLeft}`}
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <span
              className={styles.tooltipDot}
              style={{ backgroundColor: activeSegment.color }}
            />
            <span className={styles.tooltipText}>
              {activeSegment.shortName}
            </span>
            <span className={styles.tooltipValue}>
              {activeSegment.revenueFormatted}
            </span>
          </div>
        )}
      </div>

      {/* Dashed Horizontal Divider */}
      <div className={styles.divider} />

      {/* Centered Horizontal Legend with AMS Theme Dots & TouchRipple */}
      <div className={styles.legend}>
        {TOP_BRANCHES_DATA.map((branch) => {
          const isActive = hoveredBranchId === branch.id;
          const isDimmed =
            hoveredBranchId !== null && hoveredBranchId !== branch.id;

          return (
            <Link
              className={`${styles.legendItem} ${isActive ? styles.legendItemActive : ""} ${isDimmed ? styles.legendItemDimmed : ""}`}
              href={`/admin/branches/${branch.slug}`}
              key={branch.id}
              onMouseDown={createRipple}
              onMouseEnter={() => handleLegendHover(branch.id)}
              onMouseLeave={() => handleLegendHover(null)}
            >
              <span
                className={styles.legendDot}
                style={{ backgroundColor: branch.color }}
              />
              <span>{branch.shortName}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
