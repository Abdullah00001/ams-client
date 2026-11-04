/**
 * @fileoverview Create Branch Form Hook
 * @module features/create-branch/hooks/use-create-branch-form
 */

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  INITIAL_PERMISSIONS,
  type BranchFeaturePermissions,
  type CreateBranchFormData,
  type FormErrors,
  type SocialMediaPlatform,
} from "../types";
import {
  generateBranchCode,
  generateSlug,
  normalizeGoogleMapsUrl,
  normalizeWebsiteUrl,
  validateCreateBranchForm,
  validateGoogleMapsUrl,
  validateWebsiteUrl,
} from "../lib";
import { submitCreateBranch } from "../services";

const INITIAL_FORM_DATA: CreateBranchFormData = {
  name: "",
  adminName: "",
  code: "",
  slug: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  mapsLink: "",
  logoUrl: "",
  status: "Active",
  brand: "DSCA",
  socialLinks: [{ id: "social-1", platform: "Facebook", url: "" }],
  permissions: INITIAL_PERMISSIONS,
};

export function useCreateBranchForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateBranchFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [countryCode] = useState("+880");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Logo state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFileName, setLogoFileName] = useState("");
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Toast notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Success popup state
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdBranchName, setCreatedBranchName] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Branch Info Field Handlers
  const handleFieldChange = (field: keyof CreateBranchFormData, value: string) => {
    clearFieldError(field as keyof FormErrors);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWebsiteBlur = () => {
    if (!formData.website.trim()) {
      clearFieldError("website");
      return;
    }
    const normalized = normalizeWebsiteUrl(formData.website);
    if (normalized !== formData.website) {
      setFormData((prev) => ({ ...prev, website: normalized }));
    }
    const err = validateWebsiteUrl(normalized);
    if (err) {
      setErrors((prev) => ({ ...prev, website: err }));
    } else {
      clearFieldError("website");
    }
  };

  const handleMapsLinkBlur = () => {
    if (!formData.mapsLink.trim()) {
      clearFieldError("mapsLink");
      return;
    }
    const normalized = normalizeGoogleMapsUrl(formData.mapsLink);
    if (normalized !== formData.mapsLink) {
      setFormData((prev) => ({ ...prev, mapsLink: normalized }));
    }
    const err = validateGoogleMapsUrl(normalized);
    if (err) {
      setErrors((prev) => ({ ...prev, mapsLink: err }));
    } else {
      clearFieldError("mapsLink");
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearFieldError("name");
    const newName = e.target.value;
    const autoSlug = generateSlug(newName);
    const autoCode = generateBranchCode(newName);

    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: slugManuallyEdited ? prev.slug : autoSlug,
      code: prev.code ? prev.code : autoCode,
    }));
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearFieldError("slug");
    setSlugManuallyEdited(true);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status === "Active" ? "Inactive" : "Active",
    }));
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setLogoFileName(file.name);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
      showToast(`Uploaded ${file.name}`);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setIsLogoModalOpen(false);
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  // User Assignment Handler
  const handleAssignUser = (assignedName: string) => {
    setFormData((prev) => ({ ...prev, adminName: assignedName }));
    clearFieldError("adminName");
  };

  // Social Media Link Rows Handlers
  const handleAddSocialRow = () => {
    const newId = `social-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: newId, platform: "LinkedIn", url: "" },
      ],
    }));
  };

  const handleRemoveSocialRow = (id: string) => {
    if (formData.socialLinks.length <= 1) {
      showToast("At least one social media link entry must be kept.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((s) => s.id !== id),
    }));
  };

  const handleSocialPlatformChange = (id: string, platform: SocialMediaPlatform) => {
    clearFieldError("socialLinks");
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s) =>
        s.id === id ? { ...s, platform } : s,
      ),
    }));
  };

  const handleSocialUrlChange = (id: string, url: string) => {
    clearFieldError("socialLinks");
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s) =>
        s.id === id ? { ...s, url } : s,
      ),
    }));
  };

  // Feature Permissions Toggle Handler
  const handleTogglePermission = (key: keyof BranchFeaturePermissions) => {
    setFormData((prev) => {
      const nextPermissions = {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      };
      const activeCount = Object.values(nextPermissions).filter(Boolean).length;
      if (activeCount < 3) {
        setErrors((prevErr) => ({
          ...prevErr,
          permissions: "At least 3 feature permissions must be selected",
        }));
      } else {
        setErrors((prevErr) => {
          if (!prevErr.permissions) return prevErr;
          const rest = { ...prevErr };
          delete rest.permissions;
          return rest;
        });
      }
      return {
        ...prev,
        permissions: nextPermissions,
      };
    });
  };

  // Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateCreateBranchForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.socialLinks) {
        showToast(validationErrors.socialLinks);
      } else if (validationErrors.website || validationErrors.mapsLink) {
        showToast("Please correct invalid or broken links marked in red.");
      } else {
        showToast("Please fill in the required fields marked in red.");
      }
      return;
    }

    try {
      await submitCreateBranch(formData);
      setCreatedBranchName(formData.name);
      setIsSuccessModalOpen(true);
    } catch {
      showToast("Failed to create branch. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    showToast(`Branch "${formData.name || "Untitled"}" saved as Draft.`);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setLogoPreview(null);
    setIsLogoModalOpen(false);
    setSlugManuallyEdited(false);
    setResetKey((prev) => prev + 1);
    showToast("Form fields reset to defaults.");
  };

  const handleCreateAnother = () => {
    setIsSuccessModalOpen(false);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setLogoPreview(null);
    setIsLogoModalOpen(false);
    setSlugManuallyEdited(false);
    setResetKey((prev) => prev + 1);
    showToast("Form reset. Ready to create another branch.");
  };

  const handleViewAllBranches = () => {
    setIsSuccessModalOpen(false);
    router.push("/branches", { scroll: false });
  };

  return {
    formData,
    errors,
    countryCode,
    resetKey,
    logoPreview,
    logoFileName,
    isLogoModalOpen,
    isSuccessModalOpen,
    createdBranchName,
    toastMessage,
    showToast,
    clearFieldError,
    setIsLogoModalOpen,
    handleFieldChange,
    handleWebsiteBlur,
    handleMapsLinkBlur,
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
    handleCreateAnother,
    handleViewAllBranches,
  };
}
