/**
 * @fileoverview Students Data Access & Management Service
 * @module features/students/services/students.service
 */

import { INITIAL_STUDENTS_DATA } from "./students-mock-data";
import type {
  PaginatedStudents,
  PaymentStatus,
  CertificateStatus,
  Student,
  StudentFilterParams,
  StudentStatus,
} from "../types";

export const StudentsService = {
  /**
   * Queries students with live search, multi-field filters, and pagination.
   */
  getStudents: (
    page: number = 1,
    pageSize: number = 10,
    filters?: Partial<StudentFilterParams>,
    customData: Student[] = INITIAL_STUDENTS_DATA,
  ): PaginatedStudents => {
    let filtered = [...customData];

    if (filters) {
      const {
        searchQuery,
        branch,
        course,
        batch,
        status,
        paymentStatus,
        certificateStatus,
      } = filters;

      // Search Query Filter
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.id.toLowerCase().includes(query) ||
            s.name.toLowerCase().includes(query) ||
            s.phone.toLowerCase().includes(query) ||
            s.email.toLowerCase().includes(query) ||
            s.course.toLowerCase().includes(query) ||
            s.batch.toLowerCase().includes(query) ||
            s.branch.toLowerCase().includes(query),
        );
      }

      // Branch Filter
      if (branch && branch !== "All" && branch !== "All Branches") {
        filtered = filtered.filter((s) => s.branch === branch);
      }

      // Course Filter
      if (course && course !== "All" && course !== "All Courses") {
        filtered = filtered.filter((s) => s.course === course);
      }

      // Batch Filter
      if (batch && batch !== "All" && batch !== "All Batches") {
        filtered = filtered.filter((s) => s.batch === batch);
      }

      // Status Filter
      if (status && status !== "All" && status !== "All Statuses") {
        filtered = filtered.filter((s) => s.status === status);
      }

      // Payment Status Filter
      if (paymentStatus && paymentStatus !== "All" && paymentStatus !== "All Payments") {
        filtered = filtered.filter((s) => s.paymentStatus === paymentStatus);
      }

      // Certificate Status Filter
      if (
        certificateStatus &&
        certificateStatus !== "All" &&
        certificateStatus !== "All Certificates"
      ) {
        filtered = filtered.filter((s) => s.certificateStatus === certificateStatus);
      }
    }

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);
    const startIndex = (validPage - 1) * pageSize;
    const data = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data,
      total,
      page: validPage,
      pageSize,
      totalPages,
    };
  },

  /**
   * Updates active progression status for a student.
   */
  updateStatus: (
    studentId: string,
    newStatus: StudentStatus,
    dataset: Student[],
  ): Student[] => {
    return dataset.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s));
  },

  /**
   * Updates financial fee payment status for a student.
   */
  updatePaymentStatus: (
    studentId: string,
    newPayment: PaymentStatus,
    dataset: Student[],
  ): Student[] => {
    return dataset.map((s) =>
      s.id === studentId
        ? {
            ...s,
            paymentStatus: newPayment,
            dueAmount: newPayment === "Complete" ? 0 : s.dueAmount || 10000,
          }
        : s,
    );
  },

  /**
   * Updates graduation certificate status for a student.
   */
  updateCertificateStatus: (
    studentId: string,
    newCert: CertificateStatus,
    dataset: Student[],
  ): Student[] => {
    return dataset.map((s) =>
      s.id === studentId ? { ...s, certificateStatus: newCert } : s,
    );
  },

  /**
   * Removes a student by ID.
   */
  deleteStudent: (studentId: string, dataset: Student[]): Student[] => {
    return dataset.filter((s) => s.id !== studentId);
  },

  /**
   * Generates and triggers CSV export for the given student dataset.
   */
  exportCsv: (students: Student[]): void => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Branch",
      "Course",
      "Batch",
      "Payment Status",
      "Certificate Status",
      "Active Status",
      "Enrolled Date",
    ];

    const rows = students.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.phone,
      `"${s.branch.replace(/"/g, '""')}"`,
      s.course,
      s.batch,
      s.paymentStatus,
      s.certificateStatus,
      s.status,
      s.enrolledDate,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ams_students_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
