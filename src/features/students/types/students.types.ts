/**
 * @fileoverview Students Domain Types & Models
 * @module features/students/types
 */

export type StudentStatus = "ACTIVE" | "ON-GOING" | "COMPLETED" | "IN-ACTIVE";
export type PaymentStatus = "Complete" | "Due";
export type CertificateStatus = "Issued" | "Pending";

export interface Student {
  /** Sequential display ID e.g. "007", "001" */
  id: string;
  /** Full student name */
  name: string;
  /** Contact email */
  email: string;
  /** Primary contact phone number */
  phone: string;
  /** Avatar photo URL or undefined for initials */
  avatarUrl?: string;
  /** Avatar initials fallback */
  initials: string;
  /** Academy branch e.g. "GBTA [main]", "DSCA [Dhanmondi]" */
  branch: string;
  /** Course code or name e.g. "BAP", "SCA Brewing" */
  course: string;
  /** Course full description */
  courseFullName?: string;
  /** Assigned batch e.g. "Batch-24", "Morning Shift" */
  batch: string;
  /** Financial fee payment status */
  paymentStatus: PaymentStatus;
  /** Optional outstanding dues amount in BDT */
  dueAmount?: number;
  /** Academic graduation certification status */
  certificateStatus: CertificateStatus;
  /** Active enrollment progression status */
  status: StudentStatus;
  /** Date of registration/enrollment */
  enrolledDate: string;
}

export interface StudentFilterParams {
  searchQuery: string;
  branch: string;
  course: string;
  batch: string;
  status: string;
  paymentStatus: string;
  certificateStatus: string;
}

export type StudentQuickAction =
  | "view"
  | "edit"
  | "delete"
  | "change-status"
  | "change-payment"
  | "change-certificate";

export interface PaginatedStudents {
  data: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
