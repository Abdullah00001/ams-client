/**
 * @fileoverview Create Student View Component
 * @module features/create-student/components/create-student-view
 */

"use client";

import Link from "next/link";
import { useCreateStudent } from "../hooks";
import { PersonalInfoSection } from "./personal-info-section";
import { EnrollmentInfoSection } from "./enrollment-info-section";
import { PaymentPlanSection } from "./payment-plan-section";
import { StudentFormActions } from "./student-form-actions";
import { StudentSuccessModal } from "./student-success-modal";
import { StudentInvoiceModal } from "./student-invoice-modal";
import styles from "../styles/create-student-view.module.css";

export function CreateStudentView() {
  const {
    formData,
    errors,
    isSubmitting,
    createdStudent,
    isSuccessModalOpen,
    isInvoiceModalOpen,
    toastMessage,
    availableCourses,
    selectedCourse,
    availableBatches,
    baseFee,
    discountAmount,
    netFee,
    installments,
    handleFieldChange,
    handleBranchChange,
    handleCourseChange,
    handleToggleWhatsappSame,
    handlePhotoUpload,
    handleRemovePhoto,
    handleDocumentUpload,
    handleRemoveDocument,
    handleReset,
    handleSaveDraft,
    handleSubmit,
    handleCreateAnother,
    handleViewAllStudents,
    handleOpenInvoice,
    setIsInvoiceModalOpen,
    handleDownloadSlip,
    handlePrint,
    handleDirectEmail,
  } = useCreateStudent();

  return (
    <div className={styles.pageWrapper}>
      {/* Toast Notification */}
      {toastMessage ? (
        <div className={styles.toast} role="status" aria-live="polite">
          {toastMessage}
        </div>
      ) : null}

      {/* Header and Breadcrumb */}
      <header className={styles.header}>
        <h1 className={styles.title}>Add Student</h1>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/" scroll={false} className={styles.breadcrumbLink}>
            Dashboard
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/students" scroll={false} className={styles.breadcrumbLink}>
            Students
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Add Student</span>
        </nav>
      </header>

      {/* Main Registration Form Card */}
      <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
        {/* Section 1: Personal Info */}
        <PersonalInfoSection
          formData={formData}
          errors={errors}
          onFieldChange={handleFieldChange}
          onToggleWhatsappSame={handleToggleWhatsappSame}
          onPhotoUpload={handlePhotoUpload}
          onRemovePhoto={handleRemovePhoto}
          onDocumentUpload={handleDocumentUpload}
          onRemoveDocument={handleRemoveDocument}
        />

        {/* Section 2: Enrollment Info */}
        <EnrollmentInfoSection
          formData={formData}
          errors={errors}
          availableCourses={availableCourses}
          selectedCourse={selectedCourse}
          availableBatches={availableBatches}
          onFieldChange={handleFieldChange}
          onBranchChange={handleBranchChange}
          onCourseChange={handleCourseChange}
        />

        {/* Section 3: Payment Plan */}
        <PaymentPlanSection
          formData={formData}
          baseFee={baseFee}
          discountAmount={discountAmount}
          netFee={netFee}
          installments={installments}
          onFieldChange={handleFieldChange}
        />

        {/* Action Row */}
        <StudentFormActions
          isSubmitting={isSubmitting}
          onSaveDraft={handleSaveDraft}
          onReset={handleReset}
        />
      </form>

      {/* Success Modal */}
      <StudentSuccessModal
        isOpen={isSuccessModalOpen}
        student={createdStudent}
        onOpenInvoice={handleOpenInvoice}
        onCreateAnother={handleCreateAnother}
        onViewAllStudents={handleViewAllStudents}
      />

      {/* Invoice & Receipt Modal */}
      <StudentInvoiceModal
        isOpen={isInvoiceModalOpen}
        student={createdStudent}
        onClose={() => setIsInvoiceModalOpen(false)}
        onDownloadSlip={handleDownloadSlip}
        onPrint={handlePrint}
        onDirectEmail={handleDirectEmail}
      />
    </div>
  );
}
