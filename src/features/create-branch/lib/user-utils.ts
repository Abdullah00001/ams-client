/**
 * @fileoverview User Domain Utilities for Branch Creation
 * @module features/create-branch/lib/user-utils
 */

export function getUserInitials(name: string): string {
  if (!name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export type QueryType = "email" | "phone" | "name";

export interface DetectedUserInfo {
  type: QueryType;
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
}

export function detectQueryType(query: string): DetectedUserInfo {
  const trimmed = query.trim();
  if (!trimmed) {
    return { type: "name", name: "", email: "", phone: "" };
  }

  // 1. Check if Email: contains @ or matches standard email pattern
  const isEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(trimmed) ||
    (trimmed.includes("@") && !/\s/.test(trimmed));

  if (isEmail) {
    return {
      type: "email",
      name: "",
      email: trimmed,
      phone: "",
    };
  }

  // 2. Check if Phone: starts with + or contains at least 7 digits without letters
  const hasLetters = /[a-zA-Z]/.test(trimmed);
  const digitsOnly = trimmed.replace(/\D/g, "");
  const isPhoneLikely =
    !hasLetters &&
    ((trimmed.startsWith("+") && digitsOnly.length >= 6) ||
      (digitsOnly.length >= 7 && /^[\d\s\-+().]{7,}$/.test(trimmed)));

  if (isPhoneLikely) {
    let countryCode = "+880";
    let cleanPhone = trimmed.replace(/[\s\-().]/g, "");

    // Check if starts with a known country code
    const knownCodes = ["+880", "+234", "+971", "+91", "+44", "+60", "+1"];
    for (const code of knownCodes) {
      if (cleanPhone.startsWith(code)) {
        countryCode = code;
        cleanPhone = cleanPhone.slice(code.length);
        break;
      }
    }

    return {
      type: "phone",
      name: "",
      email: "",
      phone: cleanPhone,
      countryCode,
    };
  }

  // 3. Otherwise: Name
  return {
    type: "name",
    name: trimmed,
    email: "",
    phone: "",
  };
}

export interface PasswordCriteria {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function checkPasswordCriteria(password: string): PasswordCriteria {
  return {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password),
  };
}

export function getPasswordErrorMessage(password: string): string | null {
  if (!password) {
    return "Password is required.";
  }
  const criteria = checkPasswordCriteria(password);
  const missing: string[] = [];
  if (!criteria.minLength) missing.push("at least 8 characters");
  if (!criteria.hasUpper) missing.push("1 uppercase letter");
  if (!criteria.hasLower) missing.push("1 lowercase letter");
  if (!criteria.hasNumber) missing.push("1 number");
  if (!criteria.hasSpecial) missing.push("1 special character (!@#$%...)");

  if (missing.length > 0) {
    return `Password must include ${missing.join(", ")}.`;
  }
  return null;
}

export const AVATAR_PALETTES = [
  { bg: "#e8f3ff", text: "#1b84ff", border: "rgba(27, 132, 255, 0.25)" },
  { bg: "#eef2ff", text: "#4f46e5", border: "rgba(79, 70, 229, 0.25)" },
  { bg: "#e8fff3", text: "#028c4a", border: "rgba(2, 140, 74, 0.25)" },
  { bg: "#fffbeb", text: "#d97706", border: "rgba(217, 119, 6, 0.25)" },
  { bg: "#fdf2f8", text: "#db2777", border: "rgba(219, 39, 119, 0.25)" },
  { bg: "#f3e8ff", text: "#7c3aed", border: "rgba(124, 58, 237, 0.25)" },
];

export function getAvatarPalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
}

