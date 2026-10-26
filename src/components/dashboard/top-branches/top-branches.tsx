"use client";

import { useState, useRef, type MouseEvent } from "react";
import Link from "next/link";
import {
  TOP_BRANCHES_DATA,
  TOTAL_REVENUE_COUNT,
  type BranchPerformance,
} from "./top-branches-data";
import styles from "./top-branches.module.css";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

export function TopBranches() {
  const [hoveredBranchId, setHoveredBranchId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Calculate slice geometry and offsets (ordered as in AMS data)
  let accumulatedPercent = 0;
  const segments = TOP_BRANCHES_DATA.map((branch) => {
    const strokeDasharray = `${(branch.percentage / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * CIRCUMFERENCE);

    // Midpoint angle for default positioning
    const startAngle = (accumulatedPercent / 100) * 360;
    const midAngle = startAngle + (branch.percentage / 100) * 180;
    accumulatedPercent += branch.percentage;

    const rad = ((midAngle - 90) * Math.PI) / 180;
    const defaultX = 115 + (RADIUS + 15) * Math.cos(rad);
    const defaultY = 115 + (RADIUS + 15) * Math.sin(rad);

    return {
      ...branch,
      strokeDasharray,
      strokeDashoffset,
      defaultX,
      defaultY,
    };
  });

  const activeSegment = segments.find((b) => b.id === hoveredBranchId);
  const activeBranch: BranchPerformance | null = activeSegment ?? null;

  const handleSliceMouseMove = (e: MouseEvent<SVGCircleElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Clamp within wrapper so tooltip never overflows outside card bounds
    const clampedX = Math.max(65, Math.min(rect.width - 65, rawX));
    const clampedY = Math.max(25, Math.min(rect.height - 25, rawY - 14));

    setTooltipPos({ x: clampedX, y: clampedY });
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
      const scale = rect.width / 230;
      setTooltipPos({
        x: Math.max(65, Math.min(rect.width - 65, seg.defaultX * scale)),
        y: Math.max(25, Math.min(rect.height - 25, seg.defaultY * scale - 12)),
      });
    }
  };

  return (
    <section aria-label="Top Performing Branch" className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Top Performing Branch</h2>
        <p className={styles.subtitle}>Ranked by revenue this month</p>
      </div>

      {/* Donut Chart (Exact MUI Style & AMS Theme) */}
      <div className={styles.donutWrapper} ref={wrapperRef}>
        <svg className={styles.donutSvg} viewBox="0 0 230 230">
          {segments.map((s) => {
            const isHovered = hoveredBranchId === s.id;
            const isDimmed =
              hoveredBranchId !== null && hoveredBranchId !== s.id;

            return (
              <circle
                className={`${styles.donutSegment} ${isHovered ? styles.donutSegmentHovered : ""} ${isDimmed ? styles.donutSegmentDimmed : ""}`}
                cx="115"
                cy="115"
                fill="transparent"
                key={s.id}
                onMouseEnter={(e) => {
                  setHoveredBranchId(s.id);
                  handleSliceMouseMove(e);
                }}
                onMouseLeave={() => {
                  setHoveredBranchId(null);
                  setTooltipPos(null);
                }}
                onMouseMove={handleSliceMouseMove}
                r={RADIUS}
                stroke={s.color}
                strokeDasharray={s.strokeDasharray}
                strokeDashoffset={s.strokeDashoffset}
                strokeWidth={isHovered ? 29 : 24}
              />
            );
          })}
        </svg>

        {/* Donut Center Display (MUI Dynamic Swap) */}
        <div className={styles.donutCenter}>
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

        {/* Floating Pill Tooltip (Clamped inside card, tracks mouse) */}
        {activeSegment && tooltipPos && (
          <div
            className={styles.tooltip}
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

          return (
            <Link
              className={`${styles.legendItem} ${isActive ? styles.legendItemActive : ""}`}
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
