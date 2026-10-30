/**
 * @fileoverview Dashboard Stat Cards (Row 1)
 * @module features/dashboard/components/stat-cards
 *
 * Displays the 4 primary key performance indicator (KPI) metric cards:
 *  1. Total Branches (Blue card)
 *  2. Active Students (Purple card)
 *  3. Revenue This Month (Sky blue card)
 *  4. Pending Dues (Green card)
 *
 * Each card features delta vs last month with ↑ / ↓ indicators, deep links
 * to administrative sections, and Material UI touch ripple feedback.
 */

"use client";

import Link from "next/link";
import {
  Building2,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  type LucideIcon,
} from "lucide-react";
import { createTouchRipple } from "@/lib/touch-ripple";
import styles from "./stat-cards.module.css";

/**
 * Data structure defining an individual KPI stat card.
 */
export type StatCardData = {
  /** Unique metric identifier */
  id: string;
  /** Primary card label / metric title */
  title: string;
  /** Primary numeric display value (e.g. "12+", "৳ 450K+") */
  value: string;
  /** Comparison text vs previous month */
  subtext: string;
  /** Formatted delta percentage badge (e.g. "28.4%") */
  badge: string;
  /** Trend direction indicator */
  badgeTrend: "up" | "down";
  /** Deep-link URL destination */
  href: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Color theme variant class from Figma */
  variant: "blueCard" | "purpleCard" | "skyCard" | "greenCard";
};

/** Default KPI dataset for AMS */
const defaultStats: StatCardData[] = [
  {
    id: "branches",
    title: "Total Branches",
    value: "12+",
    subtext: "↑ 2 new branches vs last month",
    badge: "28.4%",
    badgeTrend: "up",
    href: "/admin/branches",
    icon: Building2,
    variant: "blueCard",
  },
  {
    id: "students",
    title: "Active Students",
    value: "2,150+",
    subtext: "↑ 120 new students vs last month",
    badge: "28.4%",
    badgeTrend: "up",
    href: "/admin/students?status=active",
    icon: GraduationCap,
    variant: "purpleCard",
  },
  {
    id: "revenue",
    title: "Revenue This Month",
    value: "৳ 450K+",
    subtext: "↑ 14.5% revenue vs last month",
    badge: "14.5%",
    badgeTrend: "up",
    href: "/admin/finance/revenue",
    icon: TrendingUp,
    variant: "skyCard",
  },
  {
    id: "dues",
    title: "Pending Dues",
    value: "৳ 47.5K+",
    subtext: "↓ 4.2% overdue vs last month",
    badge: "4.2%",
    badgeTrend: "down",
    href: "/admin/finance/dues",
    icon: AlertCircle,
    variant: "greenCard",
  },
];

/**
 * Props for StatCards.
 */
type StatCardsProps = {
  /** Optional custom metric items (defaults to standard AMS metrics) */
  stats?: StatCardData[];
};

/**
 * Row 1 Stat Cards component rendering 4 key metric tiles.
 *
 * @component
 * @param {StatCardsProps} props - Component props
 * @returns {JSX.Element} 4-column metric cards grid
 */
export function StatCards({ stats = defaultStats }: StatCardsProps) {
  return (
    <section aria-label="Key Performance Statistics" className={styles.grid}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon = stat.badgeTrend === "up" ? ArrowUpRight : ArrowDownRight;

        return (
          <Link
            className={`${styles.card} ${styles[stat.variant]}`}
            href={stat.href}
            key={stat.id}
            onClick={(e) => createTouchRipple(e, "light")}
          >
            <div className={styles.iconWrapper}>
              <Icon aria-hidden="true" className={styles.icon} />
            </div>

            <div className={styles.valueRow}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.badge}>
                {stat.badge}
                <TrendIcon aria-hidden="true" className={styles.badgeIcon} />
              </span>
            </div>

            <div className={styles.textGroup}>
              <span className={styles.title}>{stat.title}</span>
              <span className={styles.subtext}>{stat.subtext}</span>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
