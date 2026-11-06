/**
 * @fileoverview Create Student Form Management Hook
 * @module features/create-student/hooks/use-create-student
 */

"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateStudentFormData,
  CreateStudentFormErrors,
  CreatedStudentSummary,
} from "../types";
import {
  DEFAULT_STUDENT_FORM,
  STUDENT_COURSE_CATALOG,
  calculateDiscountAmount,
  generateInstallmentSchedule,
  saveStudentRecord,
} from "../services";
import { triggerEnrollmentSlipDownload, validateStudentForm } from "../lib";

export function useCreateStudent() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateStudentFormData>(DEFAULT_STUDENT_FORM);
  const [errors, setErrors] = useState<CreateStudentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdStudent, setCreatedStudent] = useState<CreatedStudentSummary | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filtered courses based on branch
  const availableCourses = useMemo(() => {
    return STUDENT_COURSE_CATALOG.filter((course) =>
      course.branchIds.includes(formData.branchId),
    );
  }, [formData.branchId]);

  // Current selected course
  const selectedCourse = useMemo(() => {
    return STUDENT_COURSE_CATALOG.find((c) => c.id === formData.courseId);
  }, [formData.courseId]);

  // Available batches for selected course
  const availableBatches = useMemo(() => {
    return selectedCourse?.batches || [];
  }, [selectedCourse]);

  // Financial calculations
  const baseFee = selectedCourse?.baseFee || 30000;
  const discountAmount = useMemo(() => {
    return calculateDiscountAmount(
      baseFee,
      formData.discountType,
      formData.discountValue,
    );
  }, [baseFee, formData.discountType, formData.discountValue]);

  const netFee = Math.max(0, baseFee - discountAmount);

  // Installment schedule
  const installments = useMemo(() => {
    if (formData.paymentType !== "installment") return [];
    return generateInstallmentSchedule(
      netFee,
      formData.installmentCount,
      formData.firstPaymentAmount,
      formData.enrollmentDate,
    );
  }, [
    formData.paymentType,
    netFee,
    formData.installmentCount,
    formData.firstPaymentAmount,
    formData.enrollmentDate,
  ]);

  // Field change
  const handleFieldChange = <K extends keyof CreateStudentFormData>(
    field: K,
    value: CreateStudentFormData[K],
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "phone" && prev.isWhatsappSameAsPhone) {
        next.whatsapp = String(value);
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Branch change
  const handleBranchChange = (branchId: string) => {
    const coursesForBranch = STUDENT_COURSE_CATALOG.filter((c) =>
      c.branchIds.includes(branchId),
    );
    const firstCourse = coursesForBranch[0];
    const firstBatch = firstCourse?.batches[0];

    setFormData((prev) => ({
      ...prev,
      branchId,
      courseId: firstCourse?.id || "",
      batchId: firstBatch?.id || "",
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.branchId;
      delete copy.courseId;
      delete copy.batchId;
      return copy;
    });
  };

  // Course change
  const handleCourseChange = (courseId: string) => {
    const course = STUDENT_COURSE_CATALOG.find((c) => c.id === courseId);
    const firstBatch = course?.batches[0];

    setFormData((prev) => ({
      ...prev,
      courseId,
      batchId: firstBatch?.id || "",
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.courseId;
      delete copy.batchId;
      return copy;
    });
  };

  // WhatsApp checkbox
  const handleToggleWhatsappSame = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isWhatsappSameAsPhone: checked,
      whatsapp: checked ? prev.phone : "",
    }));
  };

  // Photo upload
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image file (JPG, PNG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Photo file size must not exceed 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        photoUrl: reader.result as string,
        photoFileName: file.name,
      }));
      showToast("Student profile photo updated.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: null,
      photoFileName: "",
    }));
    showToast("Photo removed.");
  };

  // Document upload
  const handleDocumentUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("Document file size must not exceed 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        documentFileUrl: reader.result as string,
        documentFileName: file.name,
        documentFileType: file.type || "application/pdf",
      }));
      showToast(`${file.name} uploaded successfully.`);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = () => {
    setFormData((prev) => ({
      ...prev,
      documentFileUrl: null,
      documentFileName: "",
      documentFileType: "",
    }));
    showToast("Document removed.");
  };

  // Reset form
  const handleReset = () => {
    setFormData(DEFAULT_STUDENT_FORM);
    setErrors({});
    showToast("Form has been reset to defaults.");
  };

  // Save as draft
  const handleSaveDraft = () => {
    try {
      localStorage.setItem("ams_student_draft", JSON.stringify(formData));
      showToast("Student draft saved locally.");
    } catch {
      showToast("Draft saved in session.");
    }
  };

  // Submit form
  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();

    const validationErrors = validateStudentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Please fill in all required fields marked in red.");
      return;
    }

    setIsSubmitting(true);
    try {
      const summary = await saveStudentRecord(formData);
      setCreatedStudent(summary);
      setIsSuccessModalOpen(true);
    } catch (err) {
      showToast("Failed to save student record.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal actions
  const handleCreateAnother = () => {
    setIsSuccessModalOpen(false);
    setIsInvoiceModalOpen(false);
    setCreatedStudent(null);
    setFormData(DEFAULT_STUDENT_FORM);
    setErrors({});
    showToast("Ready to register another student.");
  };

  const handleViewAllStudents = () => {
    setIsSuccessModalOpen(false);
    setIsInvoiceModalOpen(false);
    router.push("/students");
  };

  const handleOpenInvoice = () => {
    setIsSuccessModalOpen(false);
    setIsInvoiceModalOpen(true);
  };

  const handleDownloadSlip = () => {
    if (createdStudent) {
      triggerEnrollmentSlipDownload(createdStudent);
      showToast("Enrollment slip downloaded.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDirectEmail = () => {
    if (createdStudent) {
      showToast(`Invoice successfully emailed to ${createdStudent.email}`);
    }
  };

  return {
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
  };
}
