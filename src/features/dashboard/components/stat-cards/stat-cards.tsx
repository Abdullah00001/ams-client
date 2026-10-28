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

export type StatCardData = {
  id: string;
  title: string;
  value: string;
  subtext: string;
  badge: string;
  badgeTrend: "up" | "down";
  href: string;
  icon: LucideIcon;
  variant: "blueCard" | "purpleCard" | "skyCard" | "greenCard";
};

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

type StatCardsProps = {
  stats?: StatCardData[];
};

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
