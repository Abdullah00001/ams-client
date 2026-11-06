/**
 * @fileoverview Create Student Domain Service and Catalogs
 * @module features/create-student/services
 */

import type {
  AvailableCourse,
  BranchOption,
  CreateStudentFormData,
  CreatedStudentSummary,
  InstallmentPlanItem,
} from "../types";

export const STUDENT_BRANCH_OPTIONS: BranchOption[] = [
  { id: "gbta-main", name: "GBTA [main]", shortName: "GBTA" },
  { id: "dsca-dhanmondi", name: "DSCA — Dhanmondi", shortName: "DSCA" },
  { id: "dsca-banani", name: "DSCA — Banani", shortName: "DSCA" },
  { id: "dsca-uttara", name: "DSCA — Uttara", shortName: "DSCA" },
  { id: "gbta-chattogram", name: "GBTA — Chattogram", shortName: "GBTA" },
];

export const STUDENT_COURSE_CATALOG: AvailableCourse[] = [
  {
    id: "course-bap",
    code: "BAP",
    name: "Barista Advanced Professional",
    baseFee: 35000,
    duration: "8 Weeks",
    branchIds: ["gbta-main", "dsca-dhanmondi", "dsca-banani", "gbta-chattogram"],
    batches: [
      {
        id: "bap-b24",
        name: "Batch-24 (Morning: 9am - 12pm)",
        schedule: "Sun, Tue, Thu | 9:00 AM - 12:00 PM",
        totalSeats: 15,
        filledSeats: 14,
        startDate: "2026-11-15",
      },
      {
        id: "bap-b25",
        name: "Batch-25 (Evening: 3pm - 6pm)",
        schedule: "Sun, Tue, Thu | 3:00 PM - 6:00 PM",
        totalSeats: 15,
        filledSeats: 8,
        startDate: "2026-11-20",
      },
      {
        id: "bap-wk12",
        name: "Weekend Batch-12 (Sat-Sun 10am - 2pm)",
        schedule: "Fri & Sat | 10:00 AM - 2:00 PM",
        totalSeats: 12,
        filledSeats: 9,
        startDate: "2026-11-28",
      },
    ],
  },
  {
    id: "course-sca-brew",
    code: "SCA Brewing",
    name: "SCA Brewing Foundation & Intermediate",
    baseFee: 28000,
    duration: "4 Weeks",
    branchIds: ["gbta-main", "dsca-dhanmondi", "dsca-uttara"],
    batches: [
      {
        id: "brew-b14",
        name: "Weekend Batch-12 (Sat-Sun 3pm - 6pm)",
        schedule: "Fri & Sat | 3:00 PM - 6:00 PM",
        totalSeats: 12,
        filledSeats: 7,
        startDate: "2026-11-22",
      },
      {
        id: "brew-b15",
        name: "Batch-15 (Mon, Wed | 10am - 1pm)",
        schedule: "Mon, Wed | 10:00 AM - 1:00 PM",
        totalSeats: 12,
        filledSeats: 11,
        startDate: "2026-12-01",
      },
    ],
  },
  {
    id: "course-latte-art",
    code: "Latte Art Pro",
    name: "Latte Art Pro Masterclass",
    baseFee: 22000,
    duration: "3 Weeks",
    branchIds: ["gbta-main", "dsca-banani", "dsca-dhanmondi", "gbta-chattogram"],
    batches: [
      {
        id: "la-b19",
        name: "Batch-19 (Evening: 5pm - 8pm)",
        schedule: "Mon, Wed, Fri | 5:00 PM - 8:00 PM",
        totalSeats: 10,
        filledSeats: 6,
        startDate: "2026-11-18",
      },
      {
        id: "la-b20",
        name: "Batch-20 (Weekend: 2pm - 6pm)",
        schedule: "Fri & Sat | 2:00 PM - 6:00 PM",
        totalSeats: 10,
        filledSeats: 9,
        startDate: "2026-12-05",
      },
    ],
  },
  {
    id: "course-roasting",
    code: "Roasting & Cupping",
    name: "Coffee Roasting & Cupping Sensory",
    baseFee: 40000,
    duration: "6 Weeks",
    branchIds: ["gbta-main", "dsca-dhanmondi"],
    batches: [
      {
        id: "rc-b06",
        name: "Batch-06 (Morning: 10am - 1pm)",
        schedule: "Sun, Tue | 10:00 AM - 1:00 PM",
        totalSeats: 8,
        filledSeats: 5,
        startDate: "2026-11-25",
      },
    ],
  },
  {
    id: "course-bakery",
    code: "Bakery & Pastry",
    name: "European Bakery & Pastry Arts",
    baseFee: 45000,
    duration: "12 Weeks",
    branchIds: ["dsca-dhanmondi", "dsca-banani", "dsca-uttara"],
    batches: [
      {
        id: "bak-b11",
        name: "Batch-11 (Morning: 9am - 1pm)",
        schedule: "Sun to Wed | 9:00 AM - 1:00 PM",
        totalSeats: 12,
        filledSeats: 8,
        startDate: "2026-12-01",
      },
    ],
  },
  {
    id: "course-cafe-mgt",
    code: "Cafe Management",
    name: "Cafe Business & Operations Management",
    baseFee: 30000,
    duration: "5 Weeks",
    branchIds: ["gbta-main", "dsca-banani"],
    batches: [
      {
        id: "cafe-b08",
        name: "Batch-08 (Evening: 6pm - 9pm)",
        schedule: "Thu, Fri, Sat | 6:00 PM - 9:00 PM",
        totalSeats: 15,
        filledSeats: 10,
        startDate: "2026-11-29",
      },
    ],
  },
];

export const DEFAULT_STUDENT_FORM: CreateStudentFormData = {
  fullName: "",
  photoUrl: null,
  photoFileName: "",
  phone: "",
  whatsapp: "",
  isWhatsappSameAsPhone: true,
  email: "",
  dateOfBirth: "",
  gender: "Male",
  address: "",
  identityType: "NID",
  identityNumber: "",
  documentFileUrl: null,
  documentFileName: "",
  documentFileType: "",
  emergencyContactName: "",
  emergencyContactRelation: "Parent",
  emergencyContactPhone: "",
  emergencyContactNid: "",
  branchId: "gbta-main",
  courseId: "course-bap",
  batchId: "bap-b24",
  enrollmentDate: new Date().toISOString().split("T")[0],
  status: "ACTIVE",
  paymentType: "full",
  discountType: "none",
  discountValue: 0,
  installmentCount: 2,
  firstPaymentAmount: 0,
  notes: "",
};

/**
 * Calculates discount amount based on base fee, type, and value
 */
export function calculateDiscountAmount(
  baseFee: number,
  discountType: CreateStudentFormData["discountType"],
  discountValue: number,
): number {
  if (discountType === "none" || !discountValue || discountValue <= 0) {
    return 0;
  }
  if (discountType === "percentage") {
    const safePercent = Math.min(100, Math.max(0, discountValue));
    return Math.round((baseFee * safePercent) / 100);
  }
  return Math.min(baseFee, Math.max(0, discountValue));
}

/**
 * Generates an installment payment schedule
 */
export function generateInstallmentSchedule(
  netFee: number,
  count: number,
  firstAmountCustom: number,
  startDateStr: string,
): InstallmentPlanItem[] {
  const safeCount = Math.max(2, Math.min(6, count));
  const plan: InstallmentPlanItem[] = [];

  const defaultFirstAmount =
    firstAmountCustom > 0 && firstAmountCustom < netFee
      ? firstAmountCustom
      : Math.round(netFee / safeCount);

  const remaining = Math.max(0, netFee - defaultFirstAmount);
  const subsequentAmount =
    safeCount > 1 ? Math.round(remaining / (safeCount - 1)) : 0;

  const baseDate = startDateStr ? new Date(startDateStr) : new Date();

  for (let i = 1; i <= safeCount; i++) {
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + (i - 1) * 30);

    let amount = subsequentAmount;
    if (i === 1) {
      amount = defaultFirstAmount;
    } else if (i === safeCount) {
      // Adjust last installment to prevent rounding errors
      amount = Math.max(0, remaining - subsequentAmount * (safeCount - 2));
    }

    plan.push({
      installmentNumber: i,
      label: i === 1 ? "1st Installment (Admission)" : `${i}${getOrdinal(i)} Installment`,
      amount,
      dueDate: dueDate.toISOString().split("T")[0],
      status: i === 1 ? "paid" : "pending",
    });
  }

  return plan;
}

function getOrdinal(n: number): string {
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

let studentCounter = 21;

/**
 * Generates sequential formatted 3-digit student ID
 */
export function generateStudentId(): string {
  const idStr = String(studentCounter).padStart(3, "0");
  studentCounter += 1;
  return idStr;
}

/**
 * Saves student record into local mock system
 */
export async function saveStudentRecord(
  data: CreateStudentFormData,
): Promise<CreatedStudentSummary> {
  const course = STUDENT_COURSE_CATALOG.find((c) => c.id === data.courseId);
  const branch = STUDENT_BRANCH_OPTIONS.find((b) => b.id === data.branchId);
  const batch = course?.batches.find((b) => b.id === data.batchId);

  const baseFee = course?.baseFee || 30000;
  const discountAmount = calculateDiscountAmount(
    baseFee,
    data.discountType,
    data.discountValue,
  );
  const netFee = Math.max(0, baseFee - discountAmount);

  let paidAmount = netFee;
  let dueAmount = 0;
  let installments: InstallmentPlanItem[] = [];

  if (data.paymentType === "installment") {
    installments = generateInstallmentSchedule(
      netFee,
      data.installmentCount,
      data.firstPaymentAmount,
      data.enrollmentDate,
    );
    paidAmount = installments[0]?.amount || Math.round(netFee / data.installmentCount);
    dueAmount = Math.max(0, netFee - paidAmount);
  }

  const studentId = generateStudentId();

  return {
    studentId,
    fullName: data.fullName,
    email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    phone: data.phone,
    branchName: branch?.name || "GBTA [main]",
    courseName: course?.name || "Barista Advanced Professional",
    batchName: batch?.name || "Batch-24",
    enrollmentDate: data.enrollmentDate,
    status: data.status,
    baseFee,
    discountAmount,
    netFee,
    paidAmount,
    dueAmount,
    paymentType: data.paymentType,
    installments,
  };
}
