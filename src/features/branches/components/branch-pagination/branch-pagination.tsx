/**
 * @fileoverview Branch Pagination Component
 * @module features/branches/components/branch-pagination
 *
 * Implements the Figma pagination bar with Previous, Next, and dynamic page buttons.
 */

"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import styles from "./branch-pagination.module.css";

type BranchPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function BranchPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BranchPaginationProps) {
  const handleRipple = (e: MouseEvent<HTMLButtonElement>, callback: () => void) => {
    createTouchRipple(e, "dark");
    callback();
  };

  /**
   * Generates page numbers array with ellipsis for clean display
   */
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Branch pagination" className={styles.paginationContainer}>
      <button
        type="button"
        disabled={currentPage <= 1}
        className={styles.navButton}
        onClick={(e) => handleRipple(e, () => onPageChange(currentPage - 1))}
        aria-label="Previous page"
      >
        <ArrowLeft className={styles.navIcon} />
        <span>Previous</span>
      </button>

      <ul className={styles.pageNumbersList}>
        {pages.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <li key={`ellipsis-${index}`}>
                <span className={styles.ellipsis}>...</span>
              </li>
            );
          }

          const isCurrent = item === currentPage;

          return (
            <li key={item}>
              <button
                type="button"
                className={`${styles.pageNumberButton} ${
                  isCurrent ? styles.activePage : ""
                }`}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Page ${item}`}
                onClick={(e) => handleRipple(e, () => onPageChange(item))}
              >
                {item}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        className={styles.navButton}
        onClick={(e) => handleRipple(e, () => onPageChange(currentPage + 1))}
        aria-label="Next page"
      >
        <span>Next</span>
        <ArrowRight className={styles.navIcon} />
      </button>
    </nav>
  );
}
