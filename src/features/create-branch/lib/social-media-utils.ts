/**
 * @fileoverview Social Media Link Utilities and Validation
 * @module features/create-branch/lib/social-media-utils
 */

import {
  type SocialMediaPlatform,
  PLATFORM_PLACEHOLDERS,
} from "../types";

/**
 * Detects which social media platform a URL belongs to based on known domains.
 * Returns null if no known platform is detected.
 */
export function detectPlatformFromUrl(url: string): SocialMediaPlatform | null {
  const trimmed = url.trim().toLowerCase();
  if (!trimmed) return null;

  if (/(?:^|\/\/|\.)(facebook\.com|fb\.com|fb\.watch)(?:\/|$)/i.test(trimmed)) {
    return "Facebook";
  }
  if (/(?:^|\/\/|\.)linkedin\.com(?:\/|$)/i.test(trimmed)) {
    return "LinkedIn";
  }
  if (/(?:^|\/\/|\.)(youtube\.com|youtu\.be)(?:\/|$)/i.test(trimmed)) {
    return "YouTube";
  }
  if (/(?:^|\/\/|\.)(instagram\.com|instagr\.am)(?:\/|$)/i.test(trimmed)) {
    return "Instagram";
  }
  if (/(?:^|\/\/|\.)tiktok\.com(?:\/|$)/i.test(trimmed)) {
    return "TikTok";
  }

  return null;
}

/**
 * Extracts the user/handle/page slug from a URL or raw handle string.
 */
export function extractSocialHandle(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Simple handle (e.g., @mybranch or mybranch)
  if (/^@?[a-zA-Z0-9._-]+$/.test(trimmed) && !trimmed.includes("/")) {
    return trimmed.replace(/^@/, "");
  }

  try {
    const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      // In LinkedIn company/school links or YouTube channel links:
      // /company/foo -> foo, /@bar -> bar
      const last = segments[segments.length - 1];
      return last.replace(/^@/, "");
    }
  } catch {
    // Malformed URL, ignore
  }

  return null;
}

/**
 * Formats a clean platform profile URL from a handle or cleans an existing URL.
 */
export function formatPlatformUrl(platform: SocialMediaPlatform, handleOrUrl: string): string {
  const trimmed = handleOrUrl.trim();
  if (!trimmed) return "";

  // If handle only
  if (/^@?[a-zA-Z0-9._-]+$/.test(trimmed) && !trimmed.includes(".") && !trimmed.includes("/")) {
    const handle = trimmed.replace(/^@/, "");
    switch (platform) {
      case "Facebook":
        return `https://facebook.com/${handle}`;
      case "LinkedIn":
        return `https://linkedin.com/company/${handle}`;
      case "YouTube":
        return `https://youtube.com/@${handle}`;
      case "Instagram":
        return `https://instagram.com/${handle}`;
      case "TikTok":
        return `https://tiktok.com/@${handle}`;
    }
  }

  // Prepend https:// if protocol is missing
  let result = trimmed;
  if (!/^https?:\/\//i.test(result)) {
    if (result.includes(".") || result.includes("/")) {
      result = `https://${result}`;
    }
  } else if (result.startsWith("http://")) {
    result = `https://${result.slice(7)}`;
  }

  return result;
}

/**
 * Intelligently normalizes and formats a social media URL for a chosen platform.
 * Supports handles (e.g. '@campus' -> 'https://instagram.com/campus')
 * and prepends https:// if protocol is omitted.
 */
export function normalizeSocialUrl(platform: SocialMediaPlatform, input: string): string {
  let trimmed = input.trim();
  if (!trimmed) return "";

  // If user only typed a username or handle (e.g. @campus or campus)
  if (/^@?[a-zA-Z0-9._-]+$/.test(trimmed) && !trimmed.includes(".") && !trimmed.includes("/")) {
    return formatPlatformUrl(platform, trimmed);
  }

  // Prepend https:// if protocol is missing
  if (!/^https?:\/\//i.test(trimmed)) {
    if (trimmed.includes(".") || trimmed.includes("/")) {
      trimmed = `https://${trimmed}`;
    }
  } else if (trimmed.startsWith("http://")) {
    trimmed = `https://${trimmed.slice(7)}`;
  }

  return trimmed;
}

/**
 * Validates whether a social media URL is well-formed, unbroken, and matches the platform.
 * Returns an error message if invalid, or null if valid.
 */
export function validateSocialUrl(
  platform: SocialMediaPlatform,
  rawUrl: string,
  required = false,
): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return required ? "URL is required." : null;
  }

  // Check for broken characters like internal whitespace
  if (/\s/.test(trimmed)) {
    return "Broken link: URL cannot contain whitespace.";
  }

  const testUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(testUrl);
  } catch {
    return "Invalid link. Please enter a valid URL (e.g. https://...).";
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return "URL must use https:// protocol.";
  }

  const hostname = parsed.hostname.toLowerCase();
  // Must have a valid domain dot and not end with dot
  if (!hostname.includes(".") || hostname.endsWith(".")) {
    return "Broken link: Missing a valid domain name.";
  }

  // Platform mismatch check
  const detected = detectPlatformFromUrl(trimmed);
  if (detected && detected !== platform) {
    return `This is a ${detected} link. Please switch the platform or enter a ${platform} URL.`;
  }

  // Verify hostname belongs to the chosen platform
  let isPlatformHost = false;
  switch (platform) {
    case "Facebook":
      isPlatformHost = /(?:^|\.)(facebook\.com|fb\.com|fb\.watch)$/i.test(hostname);
      break;
    case "LinkedIn":
      isPlatformHost = /(?:^|\.)linkedin\.com$/i.test(hostname);
      break;
    case "YouTube":
      isPlatformHost = /(?:^|\.)(youtube\.com|youtu\.be)$/i.test(hostname);
      break;
    case "Instagram":
      isPlatformHost = /(?:^|\.)(instagram\.com|instagr\.am)$/i.test(hostname);
      break;
    case "TikTok":
      isPlatformHost = /(?:^|\.)tiktok\.com$/i.test(hostname);
      break;
  }

  if (!isPlatformHost) {
    return `URL must be a valid ${platform} link (e.g. ${PLATFORM_PLACEHOLDERS[platform]}).`;
  }

  // Ensure path is not just root domain
  const cleanPath = parsed.pathname.replace(/\/+$/, "");
  if (!cleanPath || cleanPath === "") {
    return `Incomplete link. Please include your page or profile (e.g. ${PLATFORM_PLACEHOLDERS[platform]}).`;
  }

  return null;
}

