/**
 * @fileoverview Recent Activity Feed Component (Row 4 Right)
 * @module features/dashboard/components/recent-activity
 *
 * Displays the live chronological feed of the last 15 actions platform-wise:
 *  - Origin tag badge (GBTA, DSCA, ADMIN).
 *  - Formatted multi-token activity sentence.
 *  - Relative timestamp.
 *  - "View All Activity" action button in the top right.
 *  - Each row is interactive and deep-links to the associated record.
 */

"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { createTouchRipple } from "@/lib/touch-ripple";
import {
  RECENT_ACTIVITIES_DATA,
  type ActivityItem,
} from "./recent-activity-data";
import styles from "./recent-activity.module.css";

/**
 * Props for RecentActivityFeed.
 */
type RecentActivityFeedProps = {
  /** Optional custom activity items list */
  data?: ActivityItem[];
};

/**
 * Recent Activity Feed component.
 *
 * @component
 * @param {RecentActivityFeedProps} props - Component props
 * @returns {JSX.Element} Activity feed card
 */
export function RecentActivityFeed({
  data = RECENT_ACTIVITIES_DATA,
}: RecentActivityFeedProps) {
  return (
    <section aria-label="Recent Activities" className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Recent Activities</h2>
          <p className={styles.subtitle}>
            Platform-wide real-time activity stream
          </p>
        </div>

        {/* View All Link */}
        <Link
          className={styles.viewAllLink}
          href="/admin/activity"
          onClick={(e) => createTouchRipple(e, "light")}
        >
          <span>View All</span>
          <ArrowRight aria-hidden="true" className={styles.viewAllIcon} />
        </Link>
      </div>

      {/* Activity Feed List */}
      <ul className={styles.feedList}>
        {data.map((item) => {
          const isGbta = item.tag === "GBTA";
          const isDsca = item.tag === "DSCA";

          return (
            <li key={item.id}>
              <Link
                className={styles.feedItem}
                href={item.targetUrl}
                onClick={(e) => createTouchRipple(e, "light")}
              >
                {/* Left: Avatar Badge */}
                <div
                  aria-hidden="true"
                  className={`${styles.avatarBadge} ${
                    isGbta
                      ? styles.avatarGbta
                      : isDsca
                        ? styles.avatarDsca
                        : styles.avatarAdmin
                  }`}
                >
                  {isGbta ? (
                    "G"
                  ) : isDsca ? (
                    "D"
                  ) : (
                    <ShieldCheck className={styles.adminIcon} size={18} />
                  )}
                </div>

                {/* Content: Description + Tag & Timestamp grouped naturally together */}
                <div className={styles.itemContent}>
                  <p className={styles.description}>
                    {item.parts ? (
                      item.parts.map((part, idx) =>
                        part.bold ? (
                          <strong className={styles.boldText} key={idx}>
                            {part.text}
                          </strong>
                        ) : (
                          <span key={idx}>{part.text}</span>
                        ),
                      )
                    ) : (
                      <span>{item.description}</span>
                    )}
                  </p>

                  <div className={styles.metaRow}>
                    <span
                      className={`${styles.branchTag} ${
                        isGbta
                          ? styles.tagGbta
                          : isDsca
                            ? styles.tagDsca
                            : styles.tagAdmin
                      }`}
                    >
                      {item.tag}
                    </span>
                    <span aria-hidden="true" className={styles.dot}>
                      •
                    </span>
                    <span className={styles.timestamp}>{item.timestamp}</span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
