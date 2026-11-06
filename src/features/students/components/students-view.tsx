/**
 * @fileoverview Main Students View Component
 * @module features/students/components/students-view
 *
 * Slim coordinator component assembling the header, filter card,
 * search toolbar, paginated student table, action menus, and delete confirmation modal.
 */

"use client";

import { StudentsHeader } from "./students-header";
import { StudentsFilterCard } from "./students-filter-card";
import { StudentsFilterToolbar } from "./students-filter-toolbar";
import { StudentsTable } from "./students-table";
import { StudentsPagination } from "./students-pagination";
import { StudentDeleteModal } from "./student-delete-modal";
import { useStudents } from "../hooks";
import styles from "../styles/students-view.module.css";

export function StudentsView() {
  const {
    pageSize,
    currentPage,
    paginatedResult,
    filters,
    toastMessage,
    deleteModalState,
    setCurrentPage,
    handleSearchChange,
    handleBranchFilterChange,
    handleCourseFilterChange,
    handleBatchFilterChange,
    handleStatusFilterChange,
    handleResetFilters,
    handleAction,
    handleConfirmDelete,
    handleCancelDelete,
    handleExportData,
    handleAddNewStudent,
  } = useStudents();

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header with Title, Count badge, Export button, and + Add Student CTA */}
      <StudentsHeader
        totalCount={paginatedResult.total}
        onAddNewStudent={handleAddNewStudent}
        onExportData={handleExportData}
      />

      {/* Filter Card — Branch / Course / Batch / Status dropdowns + Reset */}
      <StudentsFilterCard
        filters={filters}
        onBranchChange={handleBranchFilterChange}
        onCourseChange={handleCourseFilterChange}
        onBatchChange={handleBatchFilterChange}
        onStatusChange={handleStatusFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Table Card */}
      <div className={styles.tableCard}>
        {/* Live Search Row */}
        <StudentsFilterToolbar
          filters={filters}
          onSearchChange={handleSearchChange}
        />

        {/* 9-Column Students Table */}
        <StudentsTable
          students={paginatedResult.data}
          pageSize={pageSize}
          currentPage={currentPage}
          onAction={handleAction}
        />

        {/* Bottom Pagination Bar */}
        <StudentsPagination
          currentPage={currentPage}
          totalPages={paginatedResult.totalPages}
          totalRecords={paginatedResult.total}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Confirmation Modal for Student Removal */}
      <StudentDeleteModal
        isOpen={deleteModalState.isOpen}
        student={deleteModalState.student}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Floating feedback notification toast */}
      {toastMessage && (
        <div role="status" className={styles.toastNotice}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
