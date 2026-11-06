/**
 * @fileoverview Students Feature Domain Utilities
 * @module features/students/lib/students-utils
 */

import type { CertificateStatus, PaymentStatus, StudentStatus } from "../types";

/**
 * Returns two-letter initials from a person's full name.
 */
export function getStudentInitials(name: string): string {
  if (!name.trim()) return "ST";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const AVATAR_PALETTES = [
  { bg: "#EBF3FF", text: "#1B84FF", border: "#D4E5FF" }, // Blue
  { bg: "#E8FFF3", text: "#17C653", border: "#C7F8DA" }, // Green
  { bg: "#FFF8E5", text: "#F6A800", border: "#FFE7B3" }, // Amber/Orange
  { bg: "#F8EEFF", text: "#7239EA", border: "#E2CCFF" }, // Purple
  { bg: "#FFEEF3", text: "#F8285A", border: "#FFCCD6" }, // Crimson
  { bg: "#E5F9FF", text: "#009EF7", border: "#B5EDFF" }, // Cyan
] as const;

/**
 * Returns a stable color palette for a student's avatar based on their name or id.
 */
export function getStudentAvatarPalette(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
}

/**
 * Formats a numerical BDT amount to standard Bengali currency string.
 */
export function formatCurrencyBdt(amount: number): string {
  return `৳ ${amount.toLocaleString("en-US")}`;
}

/**
 * Visual styling configuration for Student Status badge (matching Figma Badge Status - Order).
 */
export function getStudentStatusBadge(status: StudentStatus) {
  switch (status) {
    case "ACTIVE":
      return {
        label: "Active",
        bg: "rgba(27, 132, 255, 0.15)",
        color: "#1b84ff",
      };
    case "ON-GOING":
      return {
        label: "In Process",
        bg: "rgba(255, 122, 0, 0.15)",
        color: "#FF7A00",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        bg: "rgba(76, 175, 80, 0.2)",
        color: "#4CAF50",
      };
    case "IN-ACTIVE":
    default:
      return {
        label: "Cancelled",
        bg: "rgba(244, 67, 54, 0.15)",
        color: "#F44336",
      };
  }
}

/**
 * Visual styling configuration for Payment Status badge (matching Figma Badge Status - Order).
 */
export function getPaymentStatusBadge(status: PaymentStatus) {
  switch (status) {
    case "Complete":
      return {
        label: "Completed",
        bg: "rgba(76, 175, 80, 0.2)",
        color: "#4CAF50",
      };
    case "Due":
    default:
      return {
        label: "Due",
        bg: "rgba(244, 67, 54, 0.15)",
        color: "#F44336",
      };
  }
}

/**
 * Visual styling configuration for Certification Status badge (matching Figma Badge Status - Order).
 */
export function getCertificateStatusBadge(status: CertificateStatus) {
  switch (status) {
    case "Issued":
      return {
        label: "Issued",
        bg: "rgba(76, 175, 80, 0.2)",
        color: "#4CAF50",
      };
    case "Pending":
    default:
      return {
        label: "Pending",
        bg: "rgba(255, 122, 0, 0.15)",
        color: "#FF7A00",
      };
  }
}
