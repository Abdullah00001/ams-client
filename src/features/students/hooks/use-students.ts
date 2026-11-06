/**
 * @fileoverview Main Students Management Hook
 * @module features/students/hooks/use-students
 */

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  INITIAL_STUDENTS_DATA,
  StudentsService,
} from "../services";
import type {
  CertificateStatus,
  PaymentStatus,
  Student,
  StudentFilterParams,
  StudentQuickAction,
  StudentStatus,
} from "../types";

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: StudentFilterParams = {
  searchQuery: "",
  branch: "All Branches",
  course: "All Courses",
  batch: "All Batches",
  status: "All Statuses",
  paymentStatus: "All Payments",
  certificateStatus: "All Certificates",
};

export function useStudents() {
  const router = useRouter();
  const [studentsList, setStudentsList] = useState<Student[]>(INITIAL_STUDENTS_DATA);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<StudentFilterParams>(DEFAULT_FILTERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deletion modal state
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    student: Student | null;
  }>({
    isOpen: false,
    student: null,
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter & paginate records
  const paginatedResult = useMemo(() => {
    return StudentsService.getStudents(currentPage, PAGE_SIZE, filters, studentsList);
  }, [currentPage, filters, studentsList]);

  // Search input handler
  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    setCurrentPage(1);
  };

  // Branch filter handler
  const handleBranchFilterChange = (branch: string) => {
    setFilters((prev) => ({ ...prev, branch }));
    setCurrentPage(1);
  };

  // Course filter handler
  const handleCourseFilterChange = (course: string) => {
    setFilters((prev) => ({ ...prev, course }));
    setCurrentPage(1);
  };

  // Batch filter handler
  const handleBatchFilterChange = (batch: string) => {
    setFilters((prev) => ({ ...prev, batch }));
    setCurrentPage(1);
  };

  // Status filter handler
  const handleStatusFilterChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    showToast("Filters reset to default.");
  };

  // Quick Action Handler
  const handleAction = (action: StudentQuickAction, student: Student, extraPayload?: unknown) => {
    switch (action) {
      case "view":
        router.push(`/students/${student.id}`, { scroll: false });
        break;

      case "edit":
        showToast(`Editing student ${student.name} (#${student.id})`);
        break;

      case "delete":
        setDeleteModalState({
          isOpen: true,
          student,
        });
        break;

      case "change-status": {
        const nextStatus = extraPayload as StudentStatus;
        if (nextStatus && nextStatus !== student.status) {
          const updated = StudentsService.updateStatus(student.id, nextStatus, studentsList);
          setStudentsList(updated);
          showToast(`Student #${student.id} status updated to ${nextStatus}.`);
        }
        break;
      }

      case "change-payment": {
        const nextPayment = extraPayload as PaymentStatus;
        if (nextPayment && nextPayment !== student.paymentStatus) {
          const updated = StudentsService.updatePaymentStatus(
            student.id,
            nextPayment,
            studentsList,
          );
          setStudentsList(updated);
          showToast(`Student #${student.id} payment marked as ${nextPayment}.`);
        }
        break;
      }

      case "change-certificate": {
        const nextCert = extraPayload as CertificateStatus;
        if (nextCert && nextCert !== student.certificateStatus) {
          const updated = StudentsService.updateCertificateStatus(
            student.id,
            nextCert,
            studentsList,
          );
          setStudentsList(updated);
          showToast(`Student #${student.id} certification marked as ${nextCert}.`);
        }
        break;
      }
    }
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!deleteModalState.student) return;
    const { id, name } = deleteModalState.student;
    const updated = StudentsService.deleteStudent(id, studentsList);
    setStudentsList(updated);
    setDeleteModalState({ isOpen: false, student: null });
    showToast(`Student "${name}" (#${id}) has been removed.`);
  };

  const handleCancelDelete = () => {
    setDeleteModalState({ isOpen: false, student: null });
  };

  // Export CSV
  const handleExportData = () => {
    StudentsService.exportCsv(studentsList);
    showToast("Exported students data as CSV.");
  };

  // Add new student
  const handleAddNewStudent = () => {
    showToast("Opening Add New Student Profile...");
  };

  return {
    pageSize: PAGE_SIZE,
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
  };
}
