/**
 * @fileoverview Create Branch Form Validation Utilities
 * @module features/create-branch/lib/validation-utils
 */

import type { CreateBranchFormData, FormErrors } from "../types";
import { validateSocialUrl } from "./social-media-utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeWebsiteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateWebsiteUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null; // Optional

  if (/\s/.test(trimmed)) {
    return "This is an error... (Website URL cannot contain spaces)";
  }

  const normalized = normalizeWebsiteUrl(trimmed);

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "This is an error... (Please enter a valid website URL with http or https)";
    }
    const host = parsed.hostname;
    if (!host || !host.includes(".") || host.startsWith(".") || host.endsWith(".")) {
      return "This is an error... (Please enter a valid website URL, e.g. https://dsca.edu.bd)";
    }
    const parts = host.split(".");
    const tld = parts[parts.length - 1];
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
      return "This is an error... (Please enter a valid website URL with a valid domain extension)";
    }
    return null;
  } catch {
    return "This is an error... (Please enter a valid website URL, e.g. https://dsca.edu.bd)";
  }
}

export function normalizeGoogleMapsUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateGoogleMapsUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null; // Optional

  if (/\s/.test(trimmed)) {
    return "This is an error... (Google Maps link cannot contain spaces)";
  }

  const normalized = normalizeGoogleMapsUrl(trimmed);

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "This is an error... (Please enter a valid Google Maps link with http or https)";
    }
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    // Check Google Maps domain patterns:
    // 1. maps.google.* (e.g. maps.google.com, maps.google.com.bd)
    // 2. google.* with /maps path (e.g. google.com/maps, www.google.com/maps)
    // 3. goo.gl with /maps path (e.g. goo.gl/maps)
    // 4. maps.app.goo.gl (mobile shared links)
    // 5. g.co/maps
    const isMapsSubdomain = host.startsWith("maps.google.") || host === "maps.google.com";
    const isGoogleDomainWithMapsPath =
      (host.includes("google.") || host === "google.com") && path.startsWith("/maps");
    const isGooGlMaps = host === "goo.gl" && path.startsWith("/maps");
    const isMapsAppGooGl = host === "maps.app.goo.gl";
    const isGCoMaps = host === "g.co" && path.startsWith("/maps");

    if (
      !isMapsSubdomain &&
      !isGoogleDomainWithMapsPath &&
      !isGooGlMaps &&
      !isMapsAppGooGl &&
      !isGCoMaps
    ) {
      return "This is an error... (Please enter a valid Google Maps link, e.g. https://maps.google.com/?q=...)";
    }

    return null;
  } catch {
    return "This is an error... (Please enter a valid Google Maps link, e.g. https://maps.google.com/?q=...)";
  }
}

/**
 * Validates the Create Branch form data.
 * Checks required fields, valid email format, minimum 3 features rule,
 * and validates that any entered social media links, website, and map link are unbroken.
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

  if (formData.website.trim()) {
    const websiteErr = validateWebsiteUrl(formData.website);
    if (websiteErr) {
      errors.website = websiteErr;
    }
  }

  if (formData.mapsLink.trim()) {
    const mapsErr = validateGoogleMapsUrl(formData.mapsLink);
    if (mapsErr) {
      errors.mapsLink = mapsErr;
    }
  }

  const activePermissionsCount = Object.values(formData.permissions).filter(Boolean).length;
  if (activePermissionsCount < 3) {
    errors.permissions = "This is an error... (At least 3 feature permissions must be selected)";
  }

  // Validate non-empty social links
  for (const social of formData.socialLinks) {
    if (social.url.trim()) {
      const socialErr = validateSocialUrl(social.platform, social.url);
      if (socialErr) {
        errors.socialLinks = "Please correct invalid or broken social media links before submitting.";
        break;
      }
    }
  }

  return errors;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}
