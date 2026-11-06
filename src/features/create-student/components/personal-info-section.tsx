/**
 * @fileoverview Personal Info Section Component
 * @module features/create-student/components/personal-info-section
 */

"use client";

import type { ChangeEvent } from "react";
import clsx from "clsx";
import { Camera, Trash2, User } from "lucide-react";
import type {
  CreateStudentFormData,
  CreateStudentFormErrors,
  Gender,
} from "../types";
import { IdentityVerificationCard } from "./identity-verification-card";
import { EmergencyContactCard } from "./emergency-contact-card";
import styles from "../styles/personal-info-section.module.css";

interface PersonalInfoSectionProps {
  formData: CreateStudentFormData;
  errors: CreateStudentFormErrors;
  onFieldChange: <K extends keyof CreateStudentFormData>(
    field: K,
    value: CreateStudentFormData[K],
  ) => void;
  onToggleWhatsappSame: (checked: boolean) => void;
  onPhotoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onDocumentUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: () => void;
}

const GENDER_OPTIONS: Gender[] = ["Male", "Female", "Other"];

export function PersonalInfoSection({
  formData,
  errors,
  onFieldChange,
  onToggleWhatsappSame,
  onPhotoUpload,
  onRemovePhoto,
  onDocumentUpload,
  onRemoveDocument,
}: PersonalInfoSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="section-personal-info">
      <div className={styles.sectionHeader}>
        <h2 id="section-personal-info" className={styles.sectionTitle}>
          Personal Information
        </h2>
        <p className={styles.sectionSubtitle}>
          Student basic identification, contact details, identity verification, and emergency contacts.
        </p>
      </div>

      {/* Profile Photo Uploader Row */}
      <div className={styles.photoUploadRow}>
        <div className={styles.avatarPreview}>
          {formData.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formData.photoUrl}
              alt={formData.fullName || "Student preview"}
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>
              <User size={32} />
            </div>
          )}
        </div>
        <div className={styles.photoMeta}>
          <div className={styles.photoActions}>
            <label className={styles.uploadBtn}>
              <Camera size={14} />
              <span>{formData.photoUrl ? "Change Photo" : "Upload Photo"}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={onPhotoUpload}
                className={styles.hiddenInput}
              />
            </label>
            {formData.photoUrl ? (
              <button
                type="button"
                onClick={onRemovePhoto}
                className={styles.removePhotoBtn}
              >
                <Trash2 size={13} />
                <span>Remove</span>
              </button>
            ) : null}
          </div>
          <span className={styles.photoHint}>
            JPG, PNG or WebP. Max 5MB. Clear face portrait recommended.
          </span>
        </div>
      </div>

      {/* Row 1: Full Name, Phone, WhatsApp */}
      <div className={styles.grid3Col}>
        <div className={styles.fieldGroup}>
          <label
            htmlFor="fullName"
            className={clsx(styles.fieldLabel, errors.fullName && styles.fieldLabelInvalid)}
          >
            Full Name <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => onFieldChange("fullName", e.target.value)}
            placeholder="e.g. Alif Emran"
            className={clsx(styles.inputField, errors.fullName && styles.inputInvalid)}
          />
          {errors.fullName ? <span className={styles.fieldError}>{errors.fullName}</span> : null}
        </div>

        <div className={styles.fieldGroup}>
          <label
            htmlFor="phone"
            className={clsx(styles.fieldLabel, errors.phone && styles.fieldLabelInvalid)}
          >
            Phone Number <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            placeholder="+880 1700-000000"
            className={clsx(styles.inputField, errors.phone && styles.inputInvalid)}
          />
          {errors.phone ? <span className={styles.fieldError}>{errors.phone}</span> : null}
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.labelWithAction}>
            <label htmlFor="whatsapp" className={styles.fieldLabel}>
              WhatsApp Number
            </label>
            <label className={styles.checkboxInline}>
              <input
                type="checkbox"
                checked={formData.isWhatsappSameAsPhone}
                onChange={(e) => onToggleWhatsappSame(e.target.checked)}
              />
              <span>Same as phone</span>
            </label>
          </div>
          <input
            id="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => onFieldChange("whatsapp", e.target.value)}
            placeholder="+880 1700-000000"
            disabled={formData.isWhatsappSameAsPhone}
            className={clsx(styles.inputField, formData.isWhatsappSameAsPhone && styles.inputDisabled)}
          />
        </div>
      </div>

      {/* Row 2: Email, Date of Birth, Gender */}
      <div className={styles.grid3Col}>
        <div className={styles.fieldGroup}>
          <label
            htmlFor="email"
            className={clsx(styles.fieldLabel, errors.email && styles.fieldLabelInvalid)}
          >
            Email Address <span className={styles.optionalTag}>(Optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            placeholder="student@example.com"
            className={clsx(styles.inputField, errors.email && styles.inputInvalid)}
          />
          {errors.email ? <span className={styles.fieldError}>{errors.email}</span> : null}
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="dateOfBirth" className={styles.fieldLabel}>
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
            className={styles.inputField}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="gender" className={styles.fieldLabel}>Gender</label>
          <select
            id="gender"
            value={formData.gender}
            onChange={(e) => onFieldChange("gender", e.target.value as Gender)}
            className={styles.selectField}
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Full Address */}
      <div className={styles.gridFull}>
        <div className={styles.fieldGroup}>
          <label htmlFor="address" className={styles.fieldLabel}>Full Address / Residence</label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => onFieldChange("address", e.target.value)}
            placeholder="House, Road, Area, City, Postcode"
            className={styles.inputField}
          />
        </div>
      </div>

      {/* Row 4: Identity & Document Verification Card */}
      <IdentityVerificationCard
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
        onDocumentUpload={onDocumentUpload}
        onRemoveDocument={onRemoveDocument}
      />

      {/* Row 5: Emergency Contact Subform */}
      <EmergencyContactCard
        formData={formData}
        errors={errors}
        onFieldChange={onFieldChange}
      />
    </section>
  );
}
