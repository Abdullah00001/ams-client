/**
 * @fileoverview Branch Info Section Component
 * @module features/create-branch/components/branch-info-section
 */

"use client";

import type { ChangeEvent } from "react";
import clsx from "clsx";
import { Eye, UploadCloud, X } from "lucide-react";
import type { CreateBranchFormData, FormErrors } from "../types";
import styles from "../styles/branch-info-section.module.css";

interface BranchInfoSectionProps {
  formData: CreateBranchFormData;
  errors: FormErrors;
  countryCode: string;
  logoPreview: string | null;
  logoFileName: string;
  onFieldChange: (field: keyof CreateBranchFormData, value: string) => void;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStatusToggle: () => void;
  onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveLogo: () => void;
  onOpenLogoModal: () => void;
  clearFieldError: (field: keyof FormErrors) => void;
}

export function BranchInfoSection({
  formData,
  errors,
  countryCode,
  logoPreview,
  logoFileName,
  onFieldChange,
  onNameChange,
  onSlugChange,
  onStatusToggle,
  onLogoUpload,
  onRemoveLogo,
  onOpenLogoModal,
  clearFieldError,
}: BranchInfoSectionProps) {
  return (
    <section className={styles.section} aria-labelledby="section-branch-info">
      <div className={styles.sectionHeader}>
        <h2 id="section-branch-info" className={styles.sectionTitle}>
          Branch Info
        </h2>
        <p className={styles.sectionSubtitle}>
          Core campus identification, location, contact, and administrative details.
        </p>
      </div>

      <div className={styles.grid3Col}>
        {/* Branch Name */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="branchName"
            className={clsx(styles.fieldLabel, errors.name && styles.fieldLabelInvalid)}
          >
            Branch Name <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="branchName"
            type="text"
            value={formData.name}
            onChange={onNameChange}
            placeholder="e.g. DSCA — Dhanmondi Main Campus"
            className={clsx(styles.textInput, errors.name && styles.textInputInvalid)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "branchName-error" : undefined}
          />
          {errors.name ? (
            <p id="branchName-error" className={styles.fieldErrorText}>
              {errors.name}
            </p>
          ) : null}
        </div>

        {/* Branch Code / Slug */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="branchSlug"
            className={clsx(styles.fieldLabel, errors.slug && styles.fieldLabelInvalid)}
          >
            Branch Code / Slug <span className={styles.requiredAsterisk}>*</span>
            <span className={styles.fieldHint}>(Auto-generated, editable)</span>
          </label>
          <input
            id="branchSlug"
            type="text"
            value={formData.slug}
            onChange={onSlugChange}
            placeholder="e.g. dsca-dhanmondi-main"
            className={clsx(styles.textInput, errors.slug && styles.textInputInvalid)}
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={errors.slug ? "branchSlug-error" : undefined}
          />
          {errors.slug ? (
            <p id="branchSlug-error" className={styles.fieldErrorText}>
              {errors.slug}
            </p>
          ) : null}
        </div>

        {/* Campus Address */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="address"
            className={clsx(styles.fieldLabel, errors.address && styles.fieldLabelInvalid)}
          >
            Campus Address <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => {
              clearFieldError("address");
              onFieldChange("address", e.target.value);
            }}
            placeholder="e.g. House 42, Road 9/A, Dhanmondi, Dhaka"
            className={clsx(styles.textInput, errors.address && styles.textInputInvalid)}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? "address-error" : undefined}
          />
          {errors.address ? (
            <p id="address-error" className={styles.fieldErrorText}>
              {errors.address}
            </p>
          ) : null}
        </div>

        {/* Branch Email */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="branchEmail"
            className={clsx(styles.fieldLabel, errors.email && styles.fieldLabelInvalid)}
          >
            Branch Email <span className={styles.requiredAsterisk}>*</span>
          </label>
          <input
            id="branchEmail"
            type="email"
            value={formData.email}
            onChange={(e) => {
              clearFieldError("email");
              onFieldChange("email", e.target.value);
            }}
            placeholder="e.g. dhanmondi@dsca.edu.bd"
            className={clsx(styles.textInput, errors.email && styles.textInputInvalid)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <p id="email-error" className={styles.fieldErrorText}>
              {errors.email}
            </p>
          ) : null}
        </div>

        {/* Phone Number with Country Code */}
        <div className={styles.fieldGroup}>
          <label
            htmlFor="phone"
            className={clsx(styles.fieldLabel, errors.phone && styles.fieldLabelInvalid)}
          >
            Phone Number <span className={styles.requiredAsterisk}>*</span>
          </label>
          <div
            className={clsx(
              styles.phoneInputWrapper,
              errors.phone && styles.phoneInputWrapperInvalid,
            )}
          >
            <div className={styles.countryCodeSelector} title="Bangladesh (+880)">
              <span className={styles.flagIcon} aria-hidden="true">🇧🇩</span>
              <span>{countryCode}</span>
            </div>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                clearFieldError("phone");
                onFieldChange("phone", e.target.value);
              }}
              placeholder="01712-345678"
              className={clsx(styles.phoneInput, errors.phone && styles.phoneInputInvalid)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </div>
          {errors.phone ? (
            <p id="phone-error" className={styles.fieldErrorText}>
              {errors.phone}
            </p>
          ) : null}
        </div>

        {/* Branch Website */}
        <div className={styles.fieldGroup}>
          <label htmlFor="website" className={styles.fieldLabel}>
            Branch Website <span className={styles.fieldHint}>(Optional)</span>
          </label>
          <input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => onFieldChange("website", e.target.value)}
            placeholder="https://dsca.edu.bd"
            className={styles.textInput}
          />
        </div>

        {/* Google Maps Link */}
        <div className={styles.fieldGroup}>
          <label htmlFor="mapsLink" className={styles.fieldLabel}>
            Google Maps Link <span className={styles.fieldHint}>(Optional)</span>
          </label>
          <input
            id="mapsLink"
            type="url"
            value={formData.mapsLink}
            onChange={(e) => onFieldChange("mapsLink", e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            className={styles.textInput}
          />
        </div>

        {/* Operating Status Switch */}
        <div className={styles.fieldGroup}>
          <span id="status-label" className={styles.fieldLabel}>
            Operating Status
          </span>
          <div className={styles.statusToggleContainer}>
            <button
              type="button"
              role="switch"
              aria-checked={formData.status === "Active"}
              aria-labelledby="status-label"
              onClick={onStatusToggle}
              className={`${styles.toggleSwitch} ${
                formData.status === "Active" ? styles.toggleSwitchActive : ""
              }`}
            >
              <span className={styles.toggleThumb} aria-hidden="true" />
            </button>
            <span className={styles.statusText}>
              {formData.status} {formData.status === "Active" ? "(Default: Active)" : "(Inactive)"}
            </span>
          </div>
        </div>
      </div>

      {/* Branch Logo Upload */}
      <div className={clsx(styles.fieldGroup, styles.logoFieldGroup)}>
        <label className={styles.fieldLabel}>
          Branch Logo Upload <span className={styles.fieldHint}>(PNG, SVG, or JPG)</span>
        </label>
        {logoPreview ? (
          <div className={styles.logoPreviewArea}>
            <div
              className={styles.logoThumbnailWrapper}
              onClick={onOpenLogoModal}
              title="Click to view full image"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onOpenLogoModal();
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoPreview}
                alt="Branch logo preview"
                className={styles.logoThumbnail}
              />
              <div className={styles.logoThumbnailOverlay}>
                <Eye size={16} />
              </div>
            </div>
            <div className={styles.logoMetaActions}>
              <span className={styles.logoFileName}>{logoFileName}</span>
              <div className={styles.logoBtnGroup}>
                <button
                  type="button"
                  onClick={onOpenLogoModal}
                  className={styles.viewLogoBtn}
                  title="View full image"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  type="button"
                  onClick={onRemoveLogo}
                  className={styles.removeLogoBtn}
                >
                  <X size={14} /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label className={styles.logoDropzone}>
            <div className={styles.logoUploadIconWrapper}>
              <UploadCloud size={20} />
            </div>
            <div className={styles.logoUploadTexts}>
              <span className={styles.logoUploadPrimary}>
                Click to upload or drag and drop
              </span>
              <span className={styles.logoUploadSub}>
                SVG, PNG, or JPG (max. 2MB)
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onLogoUpload}
              style={{ display: "none" }}
            />
          </label>
        )}
      </div>
    </section>
  );
}
