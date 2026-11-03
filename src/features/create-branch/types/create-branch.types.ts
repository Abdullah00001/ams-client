/**
 * @fileoverview Create Branch Domain Types and Constants
 * @module features/create-branch/types/create-branch.types
 */

export type BranchStatus = "Active" | "Inactive";
export type BranchBrand = "DSCA" | "GBTA" | "OTHER";

export interface BranchFeaturePermissions {
  studentManagement: boolean;
  courseBatchManagement: boolean;
  attendanceTracking: boolean;
  feePaymentCollection: boolean;
  certificateIssuance: boolean;
  leadCrm: boolean;
  expenseManagement: boolean;
  hostelManagement: boolean;
  staffManagement: boolean;
}

export type SocialMediaPlatform =
  | "Facebook"
  | "LinkedIn"
  | "YouTube"
  | "Instagram"
  | "TikTok";

export interface SocialMediaLink {
  id: string;
  platform: SocialMediaPlatform;
  url: string;
}

export interface CreateBranchFormData {
  name: string;
  adminName: string;
  code: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  mapsLink: string;
  logoUrl?: string;
  status: BranchStatus;
  brand: BranchBrand;
  socialLinks: SocialMediaLink[];
  permissions: BranchFeaturePermissions;
}

export interface FormErrors {
  name?: string;
  adminName?: string;
  slug?: string;
  address?: string;
  email?: string;
  phone?: string;
  permissions?: string;
  socialLinks?: string;
}

export interface ExistingUser {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  role: string;
}

export interface CountryOption {
  code: string;
  country: string;
  flag: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
];

export const MOCK_EXISTING_USERS: ExistingUser[] = [
  {
    id: "usr-1",
    name: "Tanvir Hasan",
    email: "tanvir.hasan@dsca.edu.bd",
    countryCode: "+880",
    phone: "01711223344",
    role: "Senior Campus Manager",
  },
  {
    id: "usr-2",
    name: "Farhana Ahmed",
    email: "farhana.ahmed@gbta.edu.bd",
    countryCode: "+880",
    phone: "01812334455",
    role: "Academic Coordinator",
  },
  {
    id: "usr-3",
    name: "Emeka Okafor",
    email: "emeka.okafor@coffee.edu",
    countryCode: "+234",
    phone: "08031234567",
    role: "Operations Manager",
  },
  {
    id: "usr-4",
    name: "Sabbir Hossain",
    email: "sabbir.hossain@ams.edu.bd",
    countryCode: "+880",
    phone: "01913445566",
    role: "Branch Administrator",
  },
  {
    id: "usr-5",
    name: "Aisha Mohammed",
    email: "aisha.m@academy.org",
    countryCode: "+234",
    phone: "07019876543",
    role: "Lead Trainer",
  },
];

export const INITIAL_PERMISSIONS: BranchFeaturePermissions = {
  studentManagement: true,
  courseBatchManagement: true,
  attendanceTracking: true,
  feePaymentCollection: true,
  certificateIssuance: true,
  leadCrm: true,
  expenseManagement: true,
  hostelManagement: false,
  staffManagement: true,
};

export const SOCIAL_PLATFORMS: SocialMediaPlatform[] = [
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Instagram",
  "TikTok",
];

export const PLATFORM_PLACEHOLDERS: Record<SocialMediaPlatform, string> = {
  Facebook: "https://facebook.com/your-campus",
  LinkedIn: "https://linkedin.com/company/your-campus",
  YouTube: "https://youtube.com/@your-campus",
  Instagram: "https://instagram.com/your-campus",
  TikTok: "https://tiktok.com/@your-campus",
};
