"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { createTouchRipple } from "@/lib/touch-ripple";
import {
  RECENT_ACTIVITIES_DATA,
  type ActivityItem,
} from "./recent-activity-data";
import styles from "./recent-activity.module.css";

type RecentActivityFeedProps = {
  data?: ActivityItem[];
};

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
