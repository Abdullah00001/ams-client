/**
 * @fileoverview Create Student Form Domain Types
 * @module features/create-student/types
 */

export type Gender = "Male" | "Female" | "Other";

export type IdentityDocType = "NID" | "Passport" | "Birth Certificate";

export type StudentStatus = "ACTIVE" | "ON-GOING" | "COMPLETED" | "IN-ACTIVE";

export type PaymentType = "full" | "installment";

export type DiscountType = "none" | "percentage" | "fixed";

export interface InstallmentPlanItem {
  installmentNumber: number;
  label: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending";
}

export interface AvailableBatch {
  id: string;
  name: string;
  schedule: string;
  totalSeats: number;
  filledSeats: number;
  startDate: string;
}

export interface AvailableCourse {
  id: string;
  code: string;
  name: string;
  baseFee: number;
  duration: string;
  branchIds: string[];
  batches: AvailableBatch[];
}

export interface BranchOption {
  id: string;
  name: string;
  shortName: string;
}

export interface CreateStudentFormData {
  // Personal Info
  fullName: string;
  photoUrl: string | null;
  photoFileName: string;
  phone: string;
  whatsapp: string;
  isWhatsappSameAsPhone: boolean;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  identityType: IdentityDocType;
  identityNumber: string;
  documentFileUrl: string | null;
  documentFileName: string;
  documentFileType: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  emergencyContactNid: string;

  // Enrollment Info
  branchId: string;
  courseId: string;
  batchId: string;
  enrollmentDate: string;
  status: StudentStatus;

  // Payment Plan
  paymentType: PaymentType;
  discountType: DiscountType;
  discountValue: number;
  installmentCount: number;
  firstPaymentAmount: number;
  notes: string;
}

export type CreateStudentFormErrors = Partial<Record<keyof CreateStudentFormData | "general", string>>;

export interface CreatedStudentSummary {
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  branchName: string;
  courseName: string;
  batchName: string;
  enrollmentDate: string;
  status: StudentStatus;
  baseFee: number;
  discountAmount: number;
  netFee: number;
  paidAmount: number;
  dueAmount: number;
  paymentType: PaymentType;
  installments: InstallmentPlanItem[];
}
