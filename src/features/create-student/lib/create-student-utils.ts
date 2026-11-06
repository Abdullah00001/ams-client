/**
 * @fileoverview Create Student Validation and Utility Functions
 * @module features/create-student/lib
 */

import type { CreateStudentFormData, CreateStudentFormErrors, CreatedStudentSummary } from "../types";

/**
 * Validates the student creation form
 */
export function validateStudentForm(data: CreateStudentFormData): CreateStudentFormErrors {
  const errors: CreateStudentFormErrors = {};

  // Personal Info validation
  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required";
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = "Name must be at least 3 characters";
  }

  if (!data.phone.trim()) {
    errors.phone = "Primary contact number is required";
  } else if (!/^[0-9+-\s]{8,18}$/.test(data.phone.trim())) {
    errors.phone = "Please enter a valid phone number";
  }

  if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.identityNumber.trim()) {
    errors.identityNumber = `${data.identityType} number is required`;
  }

  // Emergency contact validation
  if (!data.emergencyContactName.trim()) {
    errors.emergencyContactName = "Emergency contact person is required";
  }

  if (!data.emergencyContactPhone.trim()) {
    errors.emergencyContactPhone = "Emergency contact phone is required";
  } else if (!/^[0-9+-\s]{8,18}$/.test(data.emergencyContactPhone.trim())) {
    errors.emergencyContactPhone = "Enter a valid emergency contact phone";
  }

  // Enrollment info validation
  if (!data.branchId) {
    errors.branchId = "Please select an academy branch";
  }

  if (!data.courseId) {
    errors.courseId = "Please select an enrollment course";
  }

  if (!data.batchId) {
    errors.batchId = "Please select an active course batch";
  }

  if (!data.enrollmentDate) {
    errors.enrollmentDate = "Enrollment date is required";
  }

  return errors;
}

/**
 * Formats amount into Bangladeshi Taka currency display
 */
export function formatBDT(amount: number): string {
  return `৳ ${amount.toLocaleString("en-BD")}`;
}

/**
 * Formats YYYY-MM-DD into readable date e.g. "Nov 15, 2026"
 */
export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generates an enrollment slip / invoice printable HTML text or triggers download
 */
export function triggerEnrollmentSlipDownload(student: CreatedStudentSummary) {
  const content = `
======================================================
      ACADEMY MANAGEMENT SYSTEM (AMS) - ENROLLMENT SLIP
======================================================
Student ID:     #${student.studentId}
Student Name:   ${student.fullName}
Contact:        ${student.phone}
Email:          ${student.email}

---------------- ENROLLMENT DETAILS ------------------
Branch:         ${student.branchName}
Course:         ${student.courseName}
Batch:          ${student.batchName}
Enrollment Date:${formatDateDisplay(student.enrollmentDate)}
Status:         ${student.status}

---------------- PAYMENT PLAN & DUES -----------------
Total Course Fee:  ${formatBDT(student.baseFee)}
Discount Applied:  ${student.discountAmount > 0 ? `-${formatBDT(student.discountAmount)}` : "None"}
Net Payable Fee:   ${formatBDT(student.netFee)}
Paid at Admission: ${formatBDT(student.paidAmount)}
Remaining Due:     ${formatBDT(student.dueAmount)}
Payment Type:      ${student.paymentType.toUpperCase()}

${
  student.installments.length > 0
    ? `INSTALLMENT SCHEDULE:
${student.installments
  .map(
    (ins) =>
      `  • ${ins.label.padEnd(30)} ${formatBDT(ins.amount).padEnd(14)} Due: ${formatDateDisplay(ins.dueDate)} [${ins.status.toUpperCase()}]`,
  )
  .join("\n")}`
    : "Paid in Full."
}

======================================================
Generated on ${new Date().toLocaleString()} | Brew Desk AMS
======================================================
`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Enrollment-Slip-${student.studentId}-${student.fullName.replace(/\s+/g, "_")}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
