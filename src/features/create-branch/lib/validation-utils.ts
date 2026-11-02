/**
 * @fileoverview Create Branch Form Validation Utilities
 * @module features/create-branch/lib/validation-utils
 */

import type { CreateBranchFormData, FormErrors } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates the Create Branch form data.
 * Checks required fields, valid email format, and the minimum 3 features rule.
 */
export function validateCreateBranchForm(formData: CreateBranchFormData): FormErrors {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = "This is an error... (Branch name is required)";
  }

  if (!formData.adminName.trim()) {
    errors.adminName = "This is an error... (Admin/Manager name is required in User Info)";
  }

  if (!formData.slug.trim()) {
    errors.slug = "This is an error... (Branch code / slug is required)";
  }

  if (!formData.address.trim()) {
    errors.address = "This is an error... (Campus address is required)";
  }

  if (!formData.email.trim()) {
    errors.email = "This is an error... (Branch email is required)";
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = "This is an error... (Please enter a valid email address)";
  }

  if (!formData.phone.trim()) {
    errors.phone = "This is an error... (Phone number is required)";
  }

  const activePermissionsCount = Object.values(formData.permissions).filter(Boolean).length;
  if (activePermissionsCount < 3) {
    errors.permissions = "This is an error... (At least 3 feature permissions must be selected)";
  }

  return errors;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
