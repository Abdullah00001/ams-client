/**
 * @fileoverview User Info Section Component
 * @module features/create-branch/components/user-info-section
 */

"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import clsx from "clsx";
import {
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Search,
  UserPlus,
  X,
} from "lucide-react";
import { Dropdown, Autocomplete } from "@/components/ui/dropdown";
import { createTouchRipple } from "@/lib/touch-ripple";
import {
  COUNTRY_OPTIONS,
  MOCK_EXISTING_USERS,
  type ExistingUser,
} from "../types";
import styles from "../styles/user-info-section.module.css";

function getUserInitials(name: string): string {
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

const AVATAR_PALETTES = [
  { bg: "#e8f3ff", text: "#1b84ff", border: "rgba(27, 132, 255, 0.25)" },
  { bg: "#eef2ff", text: "#4f46e5", border: "rgba(79, 70, 229, 0.25)" },
  { bg: "#e8fff3", text: "#028c4a", border: "rgba(2, 140, 74, 0.25)" },
  { bg: "#fffbeb", text: "#d97706", border: "rgba(217, 119, 6, 0.25)" },
  { bg: "#fdf2f8", text: "#db2777", border: "rgba(219, 39, 119, 0.25)" },
  { bg: "#f3e8ff", text: "#7c3aed", border: "rgba(124, 58, 237, 0.25)" },
];

function getAvatarPalette(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[idx];
}

interface UserInfoSectionProps {
  onAssignUser: (assignedName: string) => void;
  showToast: (msg: string) => void;
  errorMessage?: string;
}

export function UserInfoSection({
  onAssignUser,
  showToast,
  errorMessage,
}: UserInfoSectionProps) {
  const [userMode, setUserMode] = useState<"search" | "create">("search");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
  const [loadedUsers, setLoadedUsers] = useState<ExistingUser[]>([]);
  const [selectedExistingUser, setSelectedExistingUser] = useState<ExistingUser | null>(null);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoneCountry, setUserPhoneCountry] = useState("+234");
  const [userPhone, setUserPhone] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUserAssigned, setIsUserAssigned] = useState(false);
  const [userInfoErrors, setUserInfoErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const isQueryEmpty = !userSearchQuery.trim();

  const handleOpenSearch = (queryOverride?: string) => {
    const q = typeof queryOverride === "string" ? queryOverride : userSearchQuery;
    setIsUserSearchOpen(true);
    setIsSearching(true);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      const trimmed = q.toLowerCase().trim();
      if (!trimmed) {
        setLoadedUsers(MOCK_EXISTING_USERS.slice(0, 5));
      } else {
        const matched = MOCK_EXISTING_USERS.filter(
          (u) =>
            u.name.toLowerCase().includes(trimmed) ||
            u.email.toLowerCase().includes(trimmed) ||
            u.phone.includes(trimmed) ||
            u.role.toLowerCase().includes(trimmed),
        );
        setLoadedUsers(matched);
      }
      setIsSearching(false);
    }, 450);
  };

  const handleCloseSearch = () => {
    setIsUserSearchOpen(false);
    setIsSearching(false);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserSearchQuery(val);
    handleOpenSearch(val);
  };

  const handleSearchFocus = () => {
    if (!isUserSearchOpen) {
      handleOpenSearch();
    }
  };

  const handleInputClick = () => {
    if (!isUserSearchOpen) {
      handleOpenSearch();
    }
  };

  const handleClearSearch = () => {
    setUserSearchQuery("");
    handleOpenSearch("");
  };

  const handleSelectUser = (user: ExistingUser) => {
    setSelectedExistingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhoneCountry(user.countryCode);
    setUserPhone(user.phone);
    setIsUserSearchOpen(false);
    setIsSearching(false);
    setIsFormOpen(false);
    setIsUserAssigned(true);
    onAssignUser(user.name);
    showToast(`Assigned "${user.name}" as branch manager.`);
  };

  const handleSwitchToCreate = (query?: string) => {
    const rawQuery = (typeof query === "string" ? query : userSearchQuery).trim();
    const detected = detectQueryType(rawQuery);

    setUserMode("create");
    setSelectedExistingUser(null);
    setIsUserSearchOpen(false);
    setIsSearching(false);
    setIsFormOpen(true);
    setIsUserAssigned(false);
    setUserInfoErrors({});
    setUserPassword("");
    setUserConfirmPassword("");

    if (detected.type === "email") {
      setUserEmail(detected.email);
      setUserName("");
      setUserPhone("");
    } else if (detected.type === "phone") {
      setUserPhone(detected.phone);
      if (detected.countryCode) {
        setUserPhoneCountry(detected.countryCode);
      }
      setUserName("");
      setUserEmail("");
    } else if (detected.type === "name") {
      setUserName(detected.name);
      setUserEmail("");
      setUserPhone("");
    }
  };

  const handleSwitchToSearch = () => {
    setUserMode("search");
    setSelectedExistingUser(null);
    setUserSearchQuery("");
    setIsUserSearchOpen(false);
    setIsSearching(false);
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setUserPassword("");
    setUserConfirmPassword("");
    setIsFormOpen(false);
    setIsUserAssigned(false);
    setUserInfoErrors({});
  };

  const handleReassign = () => {
    setIsUserAssigned(false);
    setIsFormOpen(false);
    setUserMode("search");
    setUserSearchQuery("");
    setSelectedExistingUser(null);
  };

  const handleResetUserInfo = () => {
    setUserMode("search");
    setUserSearchQuery("");
    setIsUserSearchOpen(false);
    setIsSearching(false);
    setSelectedExistingUser(null);
    setUserName("");
    setUserEmail("");
    setUserPhoneCountry("+234");
    setUserPhone("");
    setUserPassword("");
    setUserConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsFormOpen(false);
    setIsUserAssigned(false);
    setUserInfoErrors({});
    showToast("User Info fields reset.");
  };

  const validateField = (field: "name" | "email" | "phone" | "password" | "confirmPassword") => {
    switch (field) {
      case "name": {
        if (!userName.trim()) {
          setUserInfoErrors((prev) => ({ ...prev, name: "Full Name is required." }));
        } else if (userName.trim().length < 2) {
          setUserInfoErrors((prev) => ({ ...prev, name: "Full Name must be at least 2 characters." }));
        } else {
          setUserInfoErrors((prev) => ({ ...prev, name: undefined }));
        }
        break;
      }
      case "email": {
        if (!userEmail.trim()) {
          setUserInfoErrors((prev) => ({ ...prev, email: "User Email is required." }));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
          setUserInfoErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
        } else {
          setUserInfoErrors((prev) => ({ ...prev, email: undefined }));
        }
        break;
      }
      case "phone": {
        const digits = userPhone.replace(/\D/g, "");
        if (!userPhone.trim()) {
          setUserInfoErrors((prev) => ({ ...prev, phone: "User Mobile number is required." }));
        } else if (digits.length < 6 || digits.length > 15) {
          setUserInfoErrors((prev) => ({ ...prev, phone: "Please enter a valid mobile number (6 to 15 digits)." }));
        } else {
          setUserInfoErrors((prev) => ({ ...prev, phone: undefined }));
        }
        break;
      }
      case "password": {
        const passwordErr = getPasswordErrorMessage(userPassword);
        if (passwordErr) {
          setUserInfoErrors((prev) => ({ ...prev, password: passwordErr }));
        } else {
          setUserInfoErrors((prev) => ({ ...prev, password: undefined }));
        }
        if (userConfirmPassword && userPassword && userPassword !== userConfirmPassword) {
          setUserInfoErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
        } else if (userConfirmPassword && userPassword && userPassword === userConfirmPassword) {
          setUserInfoErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
        break;
      }
      case "confirmPassword": {
        if (!userConfirmPassword) {
          setUserInfoErrors((prev) => ({ ...prev, confirmPassword: "Confirm password is required." }));
        } else if (userConfirmPassword !== userPassword) {
          setUserInfoErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
        } else {
          setUserInfoErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
        break;
      }
    }
  };

  const handleAddUserInfo = () => {
    const errs: typeof userInfoErrors = {};

    if (!userName.trim()) {
      errs.name = "Full Name is required.";
    } else if (userName.trim().length < 2) {
      errs.name = "Full Name must be at least 2 characters.";
    }

    if (!userEmail.trim()) {
      errs.email = "User Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    const cleanDigits = userPhone.replace(/\D/g, "");
    if (!userPhone.trim()) {
      errs.phone = "User Mobile number is required.";
    } else if (cleanDigits.length < 6 || cleanDigits.length > 15) {
      errs.phone = "Please enter a valid mobile number (6 to 15 digits).";
    }

    const passwordErr = getPasswordErrorMessage(userPassword);
    if (passwordErr) {
      errs.password = passwordErr;
    }

    if (!userConfirmPassword) {
      errs.confirmPassword = "Confirm password is required.";
    } else if (userPassword !== userConfirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setUserInfoErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast("Please fill in all required fields marked in red.");
      return;
    }

    setIsUserAssigned(true);
    onAssignUser(userName.trim());
    showToast(`Created & assigned "${userName.trim()}" as branch manager.`);
  };

  const assignedName = userMode === "create" ? userName : selectedExistingUser?.name || userName;
  const assignedEmail = userMode === "create" ? userEmail : selectedExistingUser?.email || userEmail;
  const assignedCountry = userMode === "create" ? userPhoneCountry : selectedExistingUser?.countryCode || userPhoneCountry;
  const assignedPhone = userMode === "create" ? userPhone : selectedExistingUser?.phone || userPhone;
  const assignedRole = selectedExistingUser?.role || "Branch Manager";
  const avatarPalette = getAvatarPalette(assignedName);
  const initials = getUserInitials(assignedName);
  const passwordCriteria = checkPasswordCriteria(userPassword);
  const hasPassword = userPassword.length > 0;
  const hasConfirmPassword = userConfirmPassword.length > 0;
  const isPasswordMatched = hasConfirmPassword && hasPassword && userConfirmPassword === userPassword;
  const isPasswordMismatch = hasConfirmPassword && (!hasPassword || userConfirmPassword !== userPassword);

  return (
    <section className={styles.section} aria-labelledby="section-user-info">
      <div className={styles.sectionHeader}>
        <h2
          id="section-user-info"
          className={clsx(styles.sectionTitle, errorMessage && styles.sectionTitleInvalid)}
        >
          User Info<span className={styles.requiredAsterisk}>*</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Search an existing user or create a new user account to assign as branch admin / manager.
        </p>
        {errorMessage && !isUserAssigned ? (
          <p className={styles.fieldErrorText} role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {/* If already assigned, show rich Assigned Card with Circle Avatar and Change button */}
      {isUserAssigned ? (
        <div className={styles.assignedUserCard}>
          <div className={styles.assignedUserCardContent}>
            <div
              className={styles.assignedUserAvatar}
              style={{
                backgroundColor: avatarPalette.bg,
                color: avatarPalette.text,
                borderColor: avatarPalette.border,
              }}
            >
              {initials}
            </div>
            <div className={styles.assignedUserDetails}>
              <div className={styles.assignedUserNameRow}>
                <span className={styles.assignedUserName}>{assignedName}</span>
                <span className={styles.assignedUserBadge}>
                  <CheckCircle2 size={13} /> Assigned Manager
                </span>
              </div>
              <span className={styles.assignedUserMeta}>
                <span className={styles.assignedUserRole}>{assignedRole}</span>
                <span>•</span>
                <span>{assignedEmail}</span>
                <span>•</span>
                <span>{assignedCountry} {assignedPhone}</span>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReassign}
            className={styles.reassignBtn}
          >
            Change User
          </button>
        </div>
      ) : (
        <>
          {/* Search Bar & Switch Mode */}
          {userMode === "search" ? (
            <div className={styles.userSearchContainer}>
              <Autocomplete.Root<ExistingUser>
                open={isUserSearchOpen}
                onOpenChange={(nextOpen) => {
                  if (nextOpen) {
                    handleOpenSearch();
                  } else {
                    handleCloseSearch();
                  }
                }}
                items={loadedUsers}
                itemToStringValue={(u) => (u ? u.name : "")}
                filter={null}
                modal={false}
                openOnInputClick={true}
              >
                <Autocomplete.InputGroup className={styles.userSearchBar}>
                  <Search size={16} className={styles.searchIcon} />
                  <Autocomplete.Input
                    value={userSearchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    onClick={handleInputClick}
                    placeholder="Search user by name, email, or mobile..."
                    className={styles.userSearchInput}
                  />
                  {isSearching ? (
                    <span className={styles.searchLoader} aria-label="Loading search results">
                      <Loader2 size={16} />
                    </span>
                  ) : userSearchQuery ? (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className={styles.clearSearchBtn}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  ) : null}
                </Autocomplete.InputGroup>

                <Autocomplete.Portal>
                  <Autocomplete.Positioner
                    sideOffset={6}
                    align="start"
                    className={styles.userSearchPositioner}
                  >
                    <Autocomplete.Popup className={styles.userSearchDropdown}>
                      {isSearching ? (
                        <div className={styles.userSearchLoadingState}>
                          <Loader2 size={18} className={styles.searchLoaderInline} />
                          <span>
                            {isQueryEmpty
                              ? "Loading recently added users..."
                              : `Searching users matching "${userSearchQuery}"...`}
                          </span>
                        </div>
                      ) : loadedUsers.length > 0 ? (
                        <>
                          <div className={styles.userSearchSectionHeader}>
                            <div className={styles.userSearchSectionTitleRow}>
                              {isQueryEmpty ? (
                                <>
                                  <Clock size={12} />
                                  <span>Recently Added Users</span>
                                </>
                              ) : (
                                <>
                                  <Search size={12} />
                                  <span>Matching Users</span>
                                </>
                              )}
                            </div>
                            <span className={styles.userSearchSectionBadge}>
                              {isQueryEmpty ? "5 Latest" : `${loadedUsers.length} found`}
                            </span>
                          </div>

                          <Autocomplete.List className={styles.userSearchList}>
                            {loadedUsers.map((u) => {
                              const uPalette = getAvatarPalette(u.name);
                              const uInitials = getUserInitials(u.name);
                              return (
                                <Autocomplete.Item
                                  key={u.id}
                                  value={u}
                                  onClick={() => handleSelectUser(u)}
                                  onMouseDown={(e) => createTouchRipple(e, "primary")}
                                  className={styles.userSearchItem}
                                >
                                  <div className={styles.userSearchItemInfo}>
                                    <div
                                      className={styles.userSearchAvatar}
                                      style={{
                                        backgroundColor: uPalette.bg,
                                        color: uPalette.text,
                                        borderColor: uPalette.border,
                                      }}
                                    >
                                      {uInitials}
                                    </div>
                                    <div className={styles.userSearchMeta}>
                                      <span className={styles.userSearchName} title={u.name}>
                                        {u.name}
                                      </span>
                                      <span className={styles.userSearchEmailPhone}>
                                        <span className={styles.userSearchEmail} title={u.email}>
                                          {u.email}
                                        </span>
                                        <span className={styles.userSearchDot}>•</span>
                                        <span className={styles.userSearchPhone}>
                                          {u.countryCode} {u.phone}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                  <span className={styles.userRoleBadge}>{u.role}</span>
                                </Autocomplete.Item>
                              );
                            })}
                          </Autocomplete.List>
                        </>
                      ) : (
                        <div className={styles.userSearchEmpty}>
                          <span>No existing users found matching &ldquo;{userSearchQuery}&rdquo;</span>
                          <button
                            type="button"
                            onClick={() => handleSwitchToCreate(userSearchQuery)}
                            className={styles.userSearchEmptyBtn}
                          >
                            {(() => {
                              const detected = detectQueryType(userSearchQuery);
                              if (detected.type === "email") {
                                return `+ Create new user with email "${userSearchQuery}"`;
                              }
                              if (detected.type === "phone") {
                                return `+ Create new user with mobile "${userSearchQuery}"`;
                              }
                              return `+ Create new user "${userSearchQuery}"`;
                            })()}
                          </button>
                        </div>
                      )}
                    </Autocomplete.Popup>
                  </Autocomplete.Positioner>
                </Autocomplete.Portal>
              </Autocomplete.Root>

              {/* Create New User button and OR divider */}
              <span className={styles.orDivider}>or</span>
              <button
                type="button"
                onClick={() => handleSwitchToCreate(userSearchQuery)}
                className={styles.switchModeBtn}
              >
                <UserPlus size={16} />
                Create a new user
              </button>
            </div>
          ) : (
            <div className={clsx(styles.userBanner, styles.createModeBanner)}>
              <span>
                <strong>Create New User Mode:</strong> Enter user details to create and assign as branch manager.
              </span>
              <button
                type="button"
                onClick={handleSwitchToSearch}
                className={styles.bannerActionBtn}
              >
                ← Search existing user instead
              </button>
            </div>
          )}

          {userInfoErrors.general ? (
            <p className={styles.fieldErrorText} style={{ marginBottom: "12px" }}>
              {userInfoErrors.general}
            </p>
          ) : null}

          {/* Form Grid: Opens only in create mode (NO avatar in Add User mode) */}
          {isFormOpen && userMode === "create" ? (
            <>
              <div className={styles.grid3Col}>
                {/* Full Name */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userName"
                    className={clsx(
                      styles.fieldLabel,
                      userInfoErrors.name && styles.fieldLabelInvalid,
                    )}
                  >
                    Full Name <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (userInfoErrors.name) {
                        setUserInfoErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    onBlur={() => validateField("name")}
                    placeholder="e.g. Tanvir Ahmed"
                    className={clsx(
                      styles.textInput,
                      userInfoErrors.name && styles.textInputInvalid,
                    )}
                    aria-invalid={Boolean(userInfoErrors.name)}
                  />
                  {userInfoErrors.name ? (
                    <p className={styles.fieldErrorText} role="alert">{userInfoErrors.name}</p>
                  ) : null}
                </div>

                {/* User Email */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userEmail"
                    className={clsx(
                      styles.fieldLabel,
                      userInfoErrors.email && styles.fieldLabelInvalid,
                    )}
                  >
                    User Email <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      if (userInfoErrors.email) {
                        setUserInfoErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    onBlur={() => validateField("email")}
                    placeholder="ex: mail@mail.com"
                    className={clsx(
                      styles.textInput,
                      userInfoErrors.email && styles.textInputInvalid,
                    )}
                    aria-invalid={Boolean(userInfoErrors.email)}
                  />
                  {userInfoErrors.email ? (
                    <p className={styles.fieldErrorText} role="alert">{userInfoErrors.email}</p>
                  ) : null}
                </div>

                {/* User Mobile* */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userMobile"
                    className={clsx(
                      styles.fieldLabel,
                      userInfoErrors.phone && styles.fieldLabelInvalid,
                    )}
                  >
                    User Mobile <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div
                    className={clsx(
                      styles.phoneInputWrapper,
                      userInfoErrors.phone && styles.phoneInputWrapperInvalid,
                    )}
                  >
                    <div className={styles.countrySelectWrapper}>
                      <Dropdown
                        value={userPhoneCountry}
                        onChange={(val) => setUserPhoneCountry(val)}
                        options={COUNTRY_OPTIONS.map((c) => ({
                          value: c.code,
                          label: `${c.flag} ${c.code}`,
                        }))}
                        size="sm"
                        variant="ghost"
                        fullWidth={false}
                        className={styles.countryDropdown}
                        triggerClassName={styles.countryDropdownTrigger}
                      />
                    </div>
                    <input
                      id="userMobile"
                      type="tel"
                      value={userPhone}
                      onChange={(e) => {
                        setUserPhone(e.target.value);
                        if (userInfoErrors.phone) {
                          setUserInfoErrors((prev) => ({ ...prev, phone: undefined }));
                        }
                      }}
                      onBlur={() => validateField("phone")}
                      placeholder="ex: 01234567"
                      className={clsx(
                        styles.phoneInput,
                        userInfoErrors.phone && styles.phoneInputInvalid,
                      )}
                      aria-invalid={Boolean(userInfoErrors.phone)}
                    />
                  </div>
                  {userInfoErrors.phone ? (
                    <p className={styles.fieldErrorText} role="alert">{userInfoErrors.phone}</p>
                  ) : null}
                </div>
              </div>

              {/* Password Row */}
              <div className={styles.grid2Col} style={{ marginTop: "16px" }}>
                {/* Password */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userPassword"
                    className={clsx(
                      styles.fieldLabel,
                      userInfoErrors.password && styles.fieldLabelInvalid,
                    )}
                  >
                    Password <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="userPassword"
                      type={showPassword ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserPassword(val);
                        if (userInfoErrors.password) {
                          setUserInfoErrors((prev) => ({ ...prev, password: undefined }));
                        }
                        if (userInfoErrors.confirmPassword && val === userConfirmPassword) {
                          setUserInfoErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }
                      }}
                      onBlur={() => validateField("password")}
                      placeholder="********"
                      className={clsx(
                        styles.textInput,
                        userInfoErrors.password && styles.textInputInvalid,
                      )}
                      style={{ paddingRight: "42px" }}
                      aria-invalid={Boolean(userInfoErrors.password)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {userInfoErrors.password ? (
                    <p className={styles.fieldErrorText} role="alert">{userInfoErrors.password}</p>
                  ) : null}

                  {/* Strong password criteria checklist */}
                  <div className={styles.passwordCriteriaList} aria-label="Password strength requirements">
                    <div
                      className={clsx(
                        styles.passwordCriteriaItem,
                        passwordCriteria.minLength && styles.passwordCriteriaMet,
                      )}
                    >
                      <span className={styles.criteriaIcon}>
                        {passwordCriteria.minLength ? <Check size={12} /> : <span className={styles.criteriaDot} />}
                      </span>
                      <span>At least 8 characters</span>
                    </div>

                    <div
                      className={clsx(
                        styles.passwordCriteriaItem,
                        passwordCriteria.hasUpper && styles.passwordCriteriaMet,
                      )}
                    >
                      <span className={styles.criteriaIcon}>
                        {passwordCriteria.hasUpper ? <Check size={12} /> : <span className={styles.criteriaDot} />}
                      </span>
                      <span>At least 1 uppercase letter (A-Z)</span>
                    </div>

                    <div
                      className={clsx(
                        styles.passwordCriteriaItem,
                        passwordCriteria.hasLower && styles.passwordCriteriaMet,
                      )}
                    >
                      <span className={styles.criteriaIcon}>
                        {passwordCriteria.hasLower ? <Check size={12} /> : <span className={styles.criteriaDot} />}
                      </span>
                      <span>At least 1 lowercase letter (a-z)</span>
                    </div>

                    <div
                      className={clsx(
                        styles.passwordCriteriaItem,
                        passwordCriteria.hasNumber && styles.passwordCriteriaMet,
                      )}
                    >
                      <span className={styles.criteriaIcon}>
                        {passwordCriteria.hasNumber ? <Check size={12} /> : <span className={styles.criteriaDot} />}
                      </span>
                      <span>At least 1 number (0-9)</span>
                    </div>

                    <div
                      className={clsx(
                        styles.passwordCriteriaItem,
                        passwordCriteria.hasSpecial && styles.passwordCriteriaMet,
                      )}
                    >
                      <span className={styles.criteriaIcon}>
                        {passwordCriteria.hasSpecial ? <Check size={12} /> : <span className={styles.criteriaDot} />}
                      </span>
                      <span>At least 1 special character (!@#$%...)</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userConfirmPassword"
                    className={clsx(
                      styles.fieldLabel,
                      (userInfoErrors.confirmPassword || isPasswordMismatch) && styles.fieldLabelInvalid,
                    )}
                  >
                    Confirm Password <span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="userConfirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={userConfirmPassword}
                      onChange={(e) => {
                        setUserConfirmPassword(e.target.value);
                        if (userInfoErrors.confirmPassword) {
                          setUserInfoErrors((prev) => ({
                            ...prev,
                            confirmPassword: undefined,
                          }));
                        }
                      }}
                      onBlur={() => validateField("confirmPassword")}
                      placeholder="********"
                      className={clsx(
                        styles.textInput,
                        (userInfoErrors.confirmPassword || isPasswordMismatch) && styles.textInputInvalid,
                        isPasswordMatched && styles.textInputSuccess,
                      )}
                      style={{ paddingRight: hasConfirmPassword ? "64px" : "42px" }}
                      aria-invalid={Boolean(userInfoErrors.confirmPassword || isPasswordMismatch)}
                    />
                    {hasConfirmPassword ? (
                      <span
                        className={clsx(
                          styles.matchInlineBadge,
                          isPasswordMatched ? styles.matchInlineSuccess : styles.matchInlineMismatch,
                        )}
                        title={isPasswordMatched ? "Passwords match" : "Passwords do not match"}
                        aria-hidden="true"
                      >
                        {isPasswordMatched ? (
                          <Check size={12} strokeWidth={2.5} />
                        ) : (
                          <X size={12} strokeWidth={2.5} />
                        )}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {hasConfirmPassword ? (
                    <div
                      className={clsx(
                        styles.passwordMatchBox,
                        isPasswordMatched ? styles.passwordMatchBoxSuccess : styles.passwordMatchBoxMismatch,
                      )}
                      role="status"
                      aria-live="polite"
                    >
                      <span className={styles.criteriaIcon}>
                        {isPasswordMatched ? (
                          <Check size={12} strokeWidth={2.5} />
                        ) : (
                          <X size={12} strokeWidth={2.5} />
                        )}
                      </span>
                      <span>
                        {isPasswordMatched ? "Passwords match" : "Passwords do not match"}
                      </span>
                    </div>
                  ) : userInfoErrors.confirmPassword ? (
                    <p className={styles.fieldErrorText} role="alert">
                      {userInfoErrors.confirmPassword}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Bottom Action Buttons (Reset & Add) */}
              <div className={styles.userInfoActionsRow}>
                <button
                  type="button"
                  onClick={handleResetUserInfo}
                  className={styles.userInfoResetBtn}
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleAddUserInfo}
                  className={styles.userInfoAddBtn}
                >
                  Add
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
