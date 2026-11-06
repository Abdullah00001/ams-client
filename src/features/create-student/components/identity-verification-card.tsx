/**
 * @fileoverview Identity Verification & Document Upload Component
 * @module features/create-student/components/identity-verification-card
 */

"use client";

import type { ChangeEvent } from "react";
import clsx from "clsx";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import type {
  CreateStudentFormData,
  CreateStudentFormErrors,
  IdentityDocType,
} from "../types";
import styles from "../styles/identity-verification-card.module.css";

interface IdentityVerificationCardProps {
  formData: CreateStudentFormData;
  errors: CreateStudentFormErrors;
  onFieldChange: <K extends keyof CreateStudentFormData>(
    field: K,
    value: CreateStudentFormData[K],
  ) => void;
  onDocumentUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: () => void;
}

const IDENTITY_TYPES: IdentityDocType[] = ["NID", "Passport", "Birth Certificate"];

export function IdentityVerificationCard({
  formData,
  errors,
  onFieldChange,
  onDocumentUpload,
  onRemoveDocument,
}: IdentityVerificationCardProps) {
  return (
    <div className={styles.grid3Col}>
      <div className={styles.fieldGroup}>
        <label htmlFor="identityType" className={styles.fieldLabel}>
          Identity Document Type
        </label>
        <select
          id="identityType"
          value={formData.identityType}
          onChange={(e) =>
            onFieldChange("identityType", e.target.value as IdentityDocType)
          }
          className={styles.selectField}
        >
          {IDENTITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label
          htmlFor="identityNumber"
          className={clsx(
            styles.fieldLabel,
            errors.identityNumber && styles.fieldLabelInvalid,
          )}
        >
          {formData.identityType} Number <span className={styles.requiredAsterisk}>*</span>
        </label>
        <input
          id="identityNumber"
          type="text"
          value={formData.identityNumber}
          onChange={(e) => onFieldChange("identityNumber", e.target.value)}
          placeholder={`Enter ${formData.identityType} number`}
          className={clsx(
            styles.inputField,
            errors.identityNumber && styles.inputInvalid,
          )}
        />
        {errors.identityNumber ? (
          <span className={styles.fieldError}>{errors.identityNumber}</span>
        ) : null}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>Upload Document Scan (PDF / Image)</label>
        {formData.documentFileName ? (
          <div className={styles.uploadedDocBadge}>
            <FileText size={16} className={styles.docIcon} />
            <span className={styles.docName} title={formData.documentFileName}>
              {formData.documentFileName}
            </span>
            <button
              type="button"
              onClick={onRemoveDocument}
              className={styles.docRemoveBtn}
              title="Remove file"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ) : (
          <label className={styles.docUploadDropzone}>
            <UploadCloud size={16} />
            <span>Choose Scan (PDF, JPG, PNG)</span>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg"
              onChange={onDocumentUpload}
              className={styles.hiddenInput}
            />
          </label>
        )}
      </div>
    </div>
  );
}

