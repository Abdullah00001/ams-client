/**
 * @fileoverview Students Pagination Component
 * @module features/students/components/students-pagination
 */

"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import styles from "../styles/students-pagination.module.css";

interface StudentsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function StudentsPagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: StudentsPaginationProps) {
  const handleRipple = (e: MouseEvent<HTMLButtonElement>, callback: () => void) => {
    createTouchRipple(e, "dark");
    callback();
  };

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

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
    <nav aria-label="Students pagination" className={styles.paginationContainer}>
      {/* Showing X-Y of Z entries */}
      <div className={styles.countInfo}>
        Showing <span className={styles.countBold}>{startRecord}</span> to{" "}
        <span className={styles.countBold}>{endRecord}</span> of{" "}
        <span className={styles.countBold}>{totalRecords}</span> students
      </div>

      <div className={styles.controlsGroup}>
        {/* Previous Button */}
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

        {/* Page Numbers */}
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

        {/* Next Button */}
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
      </div>
    </nav>
  );
}

