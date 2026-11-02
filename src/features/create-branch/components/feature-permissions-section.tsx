/**
 * @fileoverview Feature Permissions Section Component
 * @module features/branches/components/create-branch/feature-permissions-section
 */

"use client";

import type { ComponentType } from "react";
import clsx from "clsx";
import {
  BedDouble,
  BookOpen,
  CalendarCheck2,
  ContactRound,
  CreditCard,
  FileBadge2,
  ReceiptText,
  Users,
  UsersRound,
} from "lucide-react";
import type { BranchFeaturePermissions } from "../types";
import styles from "../styles/feature-permissions-section.module.css";

interface PermissionConfig {
  key: keyof BranchFeaturePermissions;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
}

const PERMISSION_CONFIGS: PermissionConfig[] = [
  {
    key: "studentManagement",
    title: "Student Management",
    description: "Student profiles, enrollments, documents, and admission status.",
    icon: Users,
  },
  {
    key: "courseBatchManagement",
    title: "Course & Batch",
    description: "Batch scheduling, class shifts, curricula, and timing calendar.",
    icon: BookOpen,
  },
  {
    key: "attendanceTracking",
    title: "Attendance Tracking",
    description: "Daily QR & manual check-in for students and academic instructors.",
    icon: CalendarCheck2,
  },
  {
    key: "feePaymentCollection",
    title: "Fee & Payment",
    description: "Installment invoices, cash / bank receipts, and dues recovery.",
    icon: CreditCard,
  },
  {
    key: "certificateIssuance",
    title: "Certificate Issuance",
    description: "Generates verified certificates with QR verification and branch codes.",
    icon: FileBadge2,
  },
  {
    key: "leadCrm",
    title: "Lead CRM",
    description: "Inquiry pipeline, follow-ups, counseling logs, and conversions.",
    icon: ContactRound,
  },
  {
    key: "expenseManagement",
    title: "Expense Management",
    description: "Tracks utility bills, equipment purchases, and daily petty cash.",
    icon: ReceiptText,
  },
  {
    key: "hostelManagement",
    title: "Hostel Management",
    description: "Dorm room allocations, bed assignments, and meal counting tracker.",
    icon: BedDouble,
  },
  {
    key: "staffManagement",
    title: "Staff Management",
    description: "Campus staff directory, trainer scheduling, and salary payroll records.",
    icon: UsersRound,
  },
];

interface FeaturePermissionsSectionProps {
  permissions: BranchFeaturePermissions;
  errorMessage?: string;
  onTogglePermission: (key: keyof BranchFeaturePermissions) => void;
}

export function FeaturePermissionsSection({
  permissions,
  errorMessage,
  onTogglePermission,
}: FeaturePermissionsSectionProps) {
  const selectedCount = Object.values(permissions).filter(Boolean).length;
  const isInvalid = Boolean(errorMessage);

  return (
    <section className={styles.section} aria-labelledby="section-permissions">
      <div className={styles.sectionHeader}>
        <div className={styles.permissionsHeaderRow}>
          <div>
            <h2
              id="section-permissions"
              className={clsx(
                styles.sectionTitle,
                isInvalid && styles.sectionTitleInvalid,
              )}
            >
              Feature Permissions<span className={styles.requiredAsterisk}>*</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Assigned at creation, editable anytime. Turn campus modules ON or OFF.
            </p>
          </div>
          <span
            className={clsx(
              styles.permissionsCountBadge,
              selectedCount < 3
                ? styles.permissionsCountBadgeError
                : styles.permissionsCountBadgeValid,
            )}
          >
            {selectedCount} of 9 selected (Min. 3)
          </span>
        </div>
        {errorMessage ? (
          <p
            id="permissions-error"
            className={styles.fieldErrorText}
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </div>

      <div className={styles.permissionsGrid}>
        {PERMISSION_CONFIGS.map(({ key, title, description, icon: Icon }) => {
          const isActive = permissions[key];

          return (
            <div
              key={key}
              className={clsx(
                styles.permissionCard,
                isActive && styles.permissionCardActive,
              )}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={clsx(
                      styles.permissionIconWrapper,
                      isActive && styles.permissionIconWrapperActive,
                    )}
                  >
                    <Icon size={16} />
                  </div>
                  <span className={styles.permissionTitle}>{title}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isActive}
                  className={clsx(
                    styles.toggleSwitch,
                    isActive && styles.toggleSwitchActive,
                  )}
                  onClick={() => onTogglePermission(key)}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>{description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
