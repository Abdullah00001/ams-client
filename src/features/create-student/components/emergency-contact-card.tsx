/**
 * @fileoverview Emergency Contact Card Component
 * @module features/create-student/components/emergency-contact-card
 */

"use client";

import clsx from "clsx";
import type { CreateStudentFormData, CreateStudentFormErrors } from "../types";
import styles from "../styles/emergency-contact-card.module.css";

interface EmergencyContactCardProps {
  formData: CreateStudentFormData;
  errors: CreateStudentFormErrors;
  onFieldChange: <K extends keyof CreateStudentFormData>(
    field: K,
    value: CreateStudentFormData[K],
  ) => void;
}

export function EmergencyContactCard({
  formData,
  errors,
  onFieldChange,
}: EmergencyContactCardProps) {
  return (
    <div className={styles.emergencySubCard}>
      <h3 className={styles.subCardTitle}>Emergency Contact</h3>
      <div className={styles.grid3Col}>
        <div className={styles.fieldGroup}>
          <label
            htmlFor="emergencyContactName"
            className={clsx(
              styles.fieldLabel,
              errors.emergencyContactName && styles.fieldLabelInvalid,
            )}
          >
            Contact Person Name <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="emergencyContactName"
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) => onFieldChange("emergencyContactName", e.target.value)}
            placeholder="e.g. Dr. Rafiqul Islam"
            className={clsx(
              styles.inputField,
              errors.emergencyContactName && styles.inputInvalid,
            )}
          />
          {errors.emergencyContactName ? (
            <span className={styles.fieldError}>{errors.emergencyContactName}</span>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label
            htmlFor="emergencyContactPhone"
            className={clsx(
              styles.fieldLabel,
              errors.emergencyContactPhone && styles.fieldLabelInvalid,
            )}
          >
            Contact Phone <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="emergencyContactPhone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => onFieldChange("emergencyContactPhone", e.target.value)}
            placeholder="+880 1800-000000"
            className={clsx(
              styles.inputField,
              errors.emergencyContactPhone && styles.inputInvalid,
            )}
          />
          {errors.emergencyContactPhone ? (
            <span className={styles.fieldError}>{errors.emergencyContactPhone}</span>
          ) : null}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="emergencyContactRelation" className={styles.fieldLabel}>
            Relationship
          </label>
          <input
            id="emergencyContactRelation"
            type="text"
            value={formData.emergencyContactRelation}
            onChange={(e) => onFieldChange("emergencyContactRelation", e.target.value)}
            placeholder="e.g. Father / Mother / Guardian"
            className={styles.inputField}
          />
        </div>
      </div>
    </div>
  );
}

