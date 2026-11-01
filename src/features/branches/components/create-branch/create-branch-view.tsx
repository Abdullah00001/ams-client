/**
 * @fileoverview Create Branch View Component
 * @module features/branches/components/create-branch/create-branch-view
 *
 * Implements the Figma-matched Create Branch form with Branch Info, dynamic
 * Social Media inputs, and Feature Permissions toggle switches.
 */

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  BedDouble,
  BookOpen,
  CalendarCheck2,
  ContactRound,
  CreditCard,
  FileBadge2,
  Plus,
  ReceiptText,
  Trash2,
  UploadCloud,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import type {
  BranchFeaturePermissions,
  CreateBranchFormData,
  SocialMediaPlatform,
} from "../../types";
import styles from "./create-branch-view.module.css";

interface FormErrors {
  name?: string;
  adminName?: string;
  slug?: string;
  address?: string;
  email?: string;
  phone?: string;
}

const INITIAL_PERMISSIONS: BranchFeaturePermissions = {
  studentManagement: true,
  courseBatchManagement: true,
  attendanceTracking: true,
  feePaymentCollection: true,
  certificateIssuance: true,
  leadCrm: true,
  expenseManagement: true,
  hostelManagement: false, // Default false; GBTA can flip ON anytime
  staffManagement: true,
};

const SOCIAL_PLATFORMS: SocialMediaPlatform[] = [
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Instagram",
  "TikTok",
];

const PLATFORM_PLACEHOLDERS: Record<SocialMediaPlatform, string> = {
  Facebook: "https://facebook.com/academy.branch",
  LinkedIn: "https://linkedin.com/company/academy-branch",
  YouTube: "https://youtube.com/@academybranch",
  Instagram: "https://instagram.com/academy.branch",
  TikTok: "https://tiktok.com/@academybranch",
};

export function CreateBranchView() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<CreateBranchFormData>({
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
    socialLinks: [
      {
        id: "social-1",
        platform: "Facebook",
        url: "",
      },
    ],
    permissions: INITIAL_PERMISSIONS,
  });

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const countryCode = "+880";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "This is an error... (Branch name is required)";
    }
    if (!formData.adminName.trim()) {
      newErrors.adminName = "This is an error... (Admin/Manager name is required)";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "This is an error... (Branch code / slug is required)";
    }
    if (!formData.address.trim()) {
      newErrors.address = "This is an error... (Campus address is required)";
    }
    if (!formData.email.trim()) {
      newErrors.email = "This is an error... (Branch email is required)";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "This is an error... (Please enter a valid email address)";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "This is an error... (Phone number is required)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auto-generate slug and code from Branch Name if not manually overridden
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearFieldError("name");
    const newName = e.target.value;
    const autoSlug = newName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const autoCode = newName
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 4);

    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: slugManuallyEdited ? prev.slug : autoSlug,
      code: prev.code ? prev.code : autoCode ? `${prev.brand}-${autoCode}-01` : "",
    }));
  };

  // Toggle module permissions
  const handleTogglePermission = (key: keyof BranchFeaturePermissions) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key],
      },
    }));
  };

  // Social media dynamic rows
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
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s) =>
        s.id === id ? { ...s, platform } : s,
      ),
    }));
  };

  const handleSocialUrlChange = (id: string, url: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s) =>
        s.id === id ? { ...s, url } : s,
      ),
    }));
  };

  // Logo upload simulation
  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
      showToast(`Uploaded ${file.name}`);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  // Form Submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast("Please fill in the required fields marked in red.");
      return;
    }

    showToast(`Branch "${formData.name}" created successfully! Redirecting...`);
    setTimeout(() => {
      router.push("/branches");
    }, 1200);
  };

  const handleSaveDraft = () => {
    showToast(`Branch "${formData.name || "Untitled"}" saved as Draft.`);
  };

  const handleReset = () => {
    setFormData({
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
    });
    setErrors({});
    setLogoPreview(null);
    setSlugManuallyEdited(false);
    showToast("Form fields reset to defaults.");
  };

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

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} noValidate className={styles.formCard}>
        {/* =========================================
            SECTION 1: Branch Info*
            ========================================= */}
        <section className={styles.section} aria-labelledby="section-branch-info">
          <div className={styles.sectionHeader}>
            <h2 id="section-branch-info" className={styles.sectionTitle}>
              Branch Info<span className={styles.requiredAsterisk}>*</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Essential campus identification, manager contacts, and address.
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
                onChange={handleNameChange}
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

            {/* Admin / Manager Name */}
            <div className={styles.fieldGroup}>
              <label
                htmlFor="adminName"
                className={clsx(styles.fieldLabel, errors.adminName && styles.fieldLabelInvalid)}
              >
                Admin / Manager Name <span className={styles.requiredAsterisk}>*</span>
              </label>
              <input
                id="adminName"
                type="text"
                value={formData.adminName}
                onChange={(e) => {
                  clearFieldError("adminName");
                  setFormData((prev) => ({ ...prev, adminName: e.target.value }));
                }}
                placeholder="e.g. Tanvir Ahmed"
                className={clsx(styles.textInput, errors.adminName && styles.textInputInvalid)}
                aria-invalid={Boolean(errors.adminName)}
                aria-describedby={errors.adminName ? "adminName-error" : undefined}
              />
              {errors.adminName ? (
                <p id="adminName-error" className={styles.fieldErrorText}>
                  {errors.adminName}
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
                onChange={(e) => {
                  clearFieldError("slug");
                  setSlugManuallyEdited(true);
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                }}
                placeholder="e.g. dsca-dhm-01"
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

            {/* Address */}
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
                  setFormData((prev) => ({ ...prev, address: e.target.value }));
                }}
                placeholder="e.g. House 27, Road 16 (New), Dhanmondi, Dhaka"
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
                htmlFor="email"
                className={clsx(styles.fieldLabel, errors.email && styles.fieldLabelInvalid)}
              >
                Branch Email <span className={styles.requiredAsterisk}>*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  clearFieldError("email");
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
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
                    setFormData((prev) => ({ ...prev, phone: e.target.value }));
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mapsLink: e.target.value }))
                }
                placeholder="https://maps.google.com/?q=..."
                className={styles.textInput}
              />
            </div>

            {/* Status Toggle */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Operating Status</label>
              <div className={styles.statusFieldWrapper}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.status === "Active"}
                  aria-label="Toggle branch status"
                  className={`${styles.toggleSwitch} ${
                    formData.status === "Active" ? styles.toggleSwitchActive : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      status: prev.status === "Active" ? "Inactive" : "Active",
                    }))
                  }
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
                <span
                  className={`${styles.statusLabel} ${
                    formData.status !== "Active" ? styles.statusLabelInactive : ""
                  }`}
                >
                  {formData.status} (Default: Active)
                </span>
              </div>
            </div>
          </div>

          {/* Row: Brand Affiliation & Logo Upload */}
          <div className={styles.grid2Col}>
            {/* Brand Affiliation */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Academy Brand Affiliation</label>
              <div className={styles.brandChips} role="radiogroup" aria-label="Brand affiliation">
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.brand === "DSCA"}
                  className={`${styles.brandChip} ${
                    formData.brand === "DSCA" ? styles.brandChipActiveDsca : ""
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, brand: "DSCA" }))}
                >
                  <span>☕ DSCA (Dhaka Specialty)</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.brand === "GBTA"}
                  className={`${styles.brandChip} ${
                    formData.brand === "GBTA" ? styles.brandChipActiveGbta : ""
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, brand: "GBTA" }))}
                >
                  <span>🎓 GBTA (Global Barista)</span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={formData.brand === "OTHER"}
                  className={`${styles.brandChip} ${
                    formData.brand === "OTHER" ? styles.brandChipActiveOther : ""
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, brand: "OTHER" }))}
                >
                  <span>🏢 Other Academy</span>
                </button>
              </div>
            </div>

            {/* Branch Logo Upload */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Branch Logo Upload <span className={styles.fieldHint}>(PNG, SVG, or JPG)</span>
              </label>
              {logoPreview ? (
                <div className={styles.logoPreviewArea}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreview}
                    alt="Branch logo preview"
                    className={styles.logoThumbnail}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className={styles.removeLogoBtn}
                  >
                    <X size={14} /> Remove Logo
                  </button>
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
                    onChange={handleLogoUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 2: Social Media Links (Dynamic)
            ========================================= */}
        <section className={styles.section} aria-labelledby="section-social-links">
          <div className={styles.sectionHeader}>
            <h2 id="section-social-links" className={styles.sectionTitle}>
              Social Media Links
            </h2>
            <p className={styles.sectionSubtitle}>
              Connect branch social profiles (Facebook, LinkedIn, YouTube, Instagram, TikTok).
            </p>
          </div>

          <div className={styles.socialList}>
            {formData.socialLinks.map((social) => (
              <div key={social.id} className={styles.socialRow}>
                {/* Platform selector */}
                <select
                  value={social.platform}
                  onChange={(e) =>
                    handleSocialPlatformChange(
                      social.id,
                      e.target.value as SocialMediaPlatform,
                    )
                  }
                  className={styles.socialPlatformSelect}
                  aria-label="Social media platform"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>

                {/* URL Input */}
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => handleSocialUrlChange(social.id, e.target.value)}
                  placeholder={PLATFORM_PLACEHOLDERS[social.platform]}
                  className={styles.socialUrlInput}
                  aria-label={`${social.platform} profile URL`}
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveSocialRow(social.id)}
                  className={styles.removeSocialBtn}
                  title="Remove this link"
                  aria-label="Remove social media link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {/* Actions for Social Links: + Add more */}
            <div className={styles.socialActionsRow}>
              <button
                type="button"
                onClick={handleAddSocialRow}
                className={styles.addSocialBtn}
              >
                <Plus size={15} /> + Add more
              </button>
              <button
                type="button"
                onClick={() => showToast("Social media links saved.")}
                className={styles.draftButton}
                style={{ height: "36px", padding: "0 14px", fontSize: "13px" }}
              >
                Save Links
              </button>
            </div>
          </div>
        </section>

        {/* =========================================
            SECTION 3: Feature Permissions (9 Toggles)
            ========================================= */}
        <section className={styles.section} aria-labelledby="section-permissions">
          <div className={styles.sectionHeader}>
            <h2 id="section-permissions" className={styles.sectionTitle}>
              Feature Permissions<span className={styles.requiredAsterisk}>*</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Assigned at creation, editable anytime. Turn campus modules ON or OFF.
            </p>
          </div>

          <div className={styles.permissionsGrid}>
            {/* 1. Student Management */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.studentManagement ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.studentManagement
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <Users size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Student Management</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.studentManagement}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.studentManagement ? styles.toggleSwitchActive : ""
                  }`}
                  onClick={() => handleTogglePermission("studentManagement")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Student profiles, enrollments, documents, and admission status.
              </p>
            </div>

            {/* 2. Course & Batch Management */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.courseBatchManagement ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.courseBatchManagement
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <BookOpen size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Course & Batch</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.courseBatchManagement}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.courseBatchManagement
                      ? styles.toggleSwitchActive
                      : ""
                  }`}
                  onClick={() => handleTogglePermission("courseBatchManagement")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Batch scheduling, class shifts, curricula, and timing calendar.
              </p>
            </div>

            {/* 3. Attendance Tracking */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.attendanceTracking ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.attendanceTracking
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <CalendarCheck2 size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Attendance Tracking</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.attendanceTracking}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.attendanceTracking ? styles.toggleSwitchActive : ""
                  }`}
                  onClick={() => handleTogglePermission("attendanceTracking")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Daily QR & manual check-in for students and academic instructors.
              </p>
            </div>

            {/* 4. Fee & Payment Collection */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.feePaymentCollection ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.feePaymentCollection
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <CreditCard size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Fee & Payment</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.feePaymentCollection}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.feePaymentCollection
                      ? styles.toggleSwitchActive
                      : ""
                  }`}
                  onClick={() => handleTogglePermission("feePaymentCollection")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Installment invoices, cash / bank receipts, and dues recovery.
              </p>
            </div>

            {/* 5. Certificate Issuance */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.certificateIssuance ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.certificateIssuance
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <FileBadge2 size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Certificate Issuance</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.certificateIssuance}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.certificateIssuance
                      ? styles.toggleSwitchActive
                      : ""
                  }`}
                  onClick={() => handleTogglePermission("certificateIssuance")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Generates verified certificates with QR verification and branch codes.
              </p>
            </div>

            {/* 6. Lead CRM */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.leadCrm ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.leadCrm
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <ContactRound size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Lead CRM</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.leadCrm}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.leadCrm ? styles.toggleSwitchActive : ""
                  }`}
                  onClick={() => handleTogglePermission("leadCrm")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Inquiry pipeline, follow-ups, counseling logs, and conversions.
              </p>
            </div>

            {/* 7. Expense Management */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.expenseManagement ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.expenseManagement
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <ReceiptText size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Expense Management</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.expenseManagement}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.expenseManagement
                      ? styles.toggleSwitchActive
                      : ""
                  }`}
                  onClick={() => handleTogglePermission("expenseManagement")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Tracks utility bills, equipment purchases, and daily petty cash.
              </p>
            </div>

            {/* 8. Hostel Management (Feature toggle for any branch) */}
            <div
              className={`${styles.permissionCard} ${styles.permissionCardHostelSpecial} ${
                formData.permissions.hostelManagement ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.hostelManagement
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <BedDouble size={16} />
                  </div>
                  <div>
                    <span className={styles.permissionTitle}>Hostel Management</span>
                    <span className={styles.hostelBadge}>GBTA / Any</span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.hostelManagement}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.hostelManagement
                      ? styles.toggleSwitchActive
                      : ""
                  }`}
                  onClick={() => handleTogglePermission("hostelManagement")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Dorm room allocations, bed assignments, and meal counting tracker.
              </p>
            </div>

            {/* 9. Staff Management */}
            <div
              className={`${styles.permissionCard} ${
                formData.permissions.staffManagement ? styles.permissionCardActive : ""
              }`}
            >
              <div className={styles.permissionHeader}>
                <div className={styles.permissionIconTitle}>
                  <div
                    className={`${styles.permissionIconWrapper} ${
                      formData.permissions.staffManagement
                        ? styles.permissionIconWrapperActive
                        : ""
                    }`}
                  >
                    <UsersRound size={16} />
                  </div>
                  <span className={styles.permissionTitle}>Staff Management</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formData.permissions.staffManagement}
                  className={`${styles.toggleSwitch} ${
                    formData.permissions.staffManagement ? styles.toggleSwitchActive : ""
                  }`}
                  onClick={() => handleTogglePermission("staffManagement")}
                >
                  <span className={styles.toggleThumb} aria-hidden="true" />
                </button>
              </div>
              <p className={styles.permissionDesc}>
                Campus staff directory, trainer scheduling, and salary payroll records.
              </p>
            </div>
          </div>

          {/* Callout Notice regarding Hostel & Meal Counting */}
          <div className={styles.hostelCallout}>
            📌 <strong>Feature Toggle Flexibility:</strong> Hostel Management and Meal Counting
            are dynamic feature toggles, not hardcoded to any specific branch. If DSCA or any other
            campus opens a hostel tomorrow, Super Admin can flip it ON here anytime without code change.
          </div>
        </section>

        {/* =========================================
            SECTION 4: Actions Row (Reset, Save Draft, Save Branch)
            ========================================= */}
        <div className={styles.formActionsRow}>
          <button
            type="button"
            onClick={handleSaveDraft}
            className={styles.draftButton}
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset
          </button>
          <button type="submit" className={styles.submitButton}>
            <Plus size={16} /> Save Branch
          </button>
        </div>
      </form>

      {/* Floating feedback toast */}
      {toastMessage && (
        <div role="status" className={styles.toastNotice}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
