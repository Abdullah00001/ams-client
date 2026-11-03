/**
 * @fileoverview Create Branch View Component
 * @module features/create-branch/components/create-branch-view
 *
 * Slim coordinator component orchestrating atomic sections:
 * - BranchInfoSection: Core details, status, and logo uploader.
 * - UserInfoSection: Search existing user or create/assign branch manager.
 * - SocialMediaSection: Dynamic social media links manager.
 * - FeaturePermissionsSection: Module feature toggles with min-3 rule.
 * - FormActionsRow: Reset, Save Draft, and Submit actions.
 * - LogoLightboxModal: Fullscreen logo preview modal.
 */

"use client";

import Link from "next/link";
import { useCreateBranchForm } from "../hooks";
import { BranchInfoSection } from "./branch-info-section";
import { UserInfoSection } from "./user-info-section";
import { SocialMediaSection } from "./social-media-section";
import { FeaturePermissionsSection } from "./feature-permissions-section";
import { FormActionsRow } from "./form-actions-row";
import { LogoLightboxModal } from "./logo-lightbox-modal";
import styles from "../styles/create-branch-view.module.css";

export function CreateBranchView() {
  const {
    formData,
    errors,
    countryCode,
    resetKey,
    logoPreview,
    logoFileName,
    isLogoModalOpen,
    toastMessage,
    showToast,
    clearFieldError,
    setIsLogoModalOpen,
    handleFieldChange,
    handleNameChange,
    handleSlugChange,
    handleStatusToggle,
    handleLogoUpload,
    handleRemoveLogo,
    handleAssignUser,
    handleAddSocialRow,
    handleRemoveSocialRow,
    handleSocialPlatformChange,
    handleSocialUrlChange,
    handleTogglePermission,
    handleSubmit,
    handleSaveDraft,
    handleReset,
  } = useCreateBranchForm();

  return (
    <div className={styles.pageWrapper}>
      {/* Header and Breadcrumb */}
      <header className={styles.header}>
        <h1 className={styles.title}>Create Branch</h1>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/branches" className={styles.breadcrumbLink}>
            Branches
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Create Branch</span>
        </nav>
      </header>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
        {/* Section 1: Branch Info */}
        <BranchInfoSection
          formData={formData}
          errors={errors}
          countryCode={countryCode}
          logoPreview={logoPreview}
          logoFileName={logoFileName}
          onFieldChange={handleFieldChange}
          onNameChange={handleNameChange}
          onSlugChange={handleSlugChange}
          onStatusToggle={handleStatusToggle}
          onLogoUpload={handleLogoUpload}
          onRemoveLogo={handleRemoveLogo}
          onOpenLogoModal={() => setIsLogoModalOpen(true)}
          clearFieldError={clearFieldError}
        />

        {/* Section 2: Social Media Links */}
        <SocialMediaSection
          socialLinks={formData.socialLinks}
          onAddRow={handleAddSocialRow}
          onRemoveRow={handleRemoveSocialRow}
          onPlatformChange={handleSocialPlatformChange}
          onUrlChange={handleSocialUrlChange}
        />

        {/* Section 3: User Info */}
        <UserInfoSection key={resetKey} onAssignUser={handleAssignUser} showToast={showToast} />

        {/* Section 4: Feature Permissions */}
        <FeaturePermissionsSection
          permissions={formData.permissions}
          errorMessage={errors.permissions}
          onTogglePermission={handleTogglePermission}
        />

        {/* Actions Row */}
        <FormActionsRow onSaveDraft={handleSaveDraft} onReset={handleReset} />
      </form>

      {/* Floating feedback toast */}
      {toastMessage && (
        <div role="status" className={styles.toastNotice}>
          {toastMessage}
        </div>
      )}

      {/* Logo Preview Lightbox Modal */}
      <LogoLightboxModal
        isOpen={isLogoModalOpen}
        logoUrl={logoPreview}
        logoFileName={logoFileName}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
}
