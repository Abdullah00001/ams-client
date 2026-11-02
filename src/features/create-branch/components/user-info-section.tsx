/**
 * @fileoverview User Info Section Component
 * @module features/create-branch/components/user-info-section
 */

"use client";

import { useState, useRef, type ChangeEvent } from "react";
import clsx from "clsx";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Search,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import {
  COUNTRY_OPTIONS,
  MOCK_EXISTING_USERS,
  type ExistingUser,
} from "../types";
import styles from "../styles/user-info-section.module.css";

interface UserInfoSectionProps {
  onAssignUser: (assignedName: string) => void;
  showToast: (msg: string) => void;
}

export function UserInfoSection({
  onAssignUser,
  showToast,
}: UserInfoSectionProps) {
  const [userMode, setUserMode] = useState<"search" | "create">("search");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);
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

  const isPasswordEnabled = userMode === "create" || Boolean(selectedExistingUser);
  const isFieldsEnabled = userMode === "create";

  const filteredUsers = MOCK_EXISTING_USERS.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserSearchQuery(val);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!val.trim()) {
      setIsUserSearchOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsUserSearchOpen(true);

    searchTimerRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 280);
  };

  const handleSearchFocus = () => {
    if (userSearchQuery.trim()) {
      setIsUserSearchOpen(true);
    }
  };

  const handleSelectUser = (user: ExistingUser) => {
    setSelectedExistingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserPhoneCountry(user.countryCode);
    setUserPhone(user.phone);
    setUserSearchQuery(user.name);
    setIsUserSearchOpen(false);
    setIsSearching(false);
    setIsFormOpen(true);
    setUserInfoErrors({});
    setUserPassword("");
    setUserConfirmPassword("");
    showToast(`Selected "${user.name}". Please enter password.`);
  };

  const handleSwitchToCreate = () => {
    setUserMode("create");
    setSelectedExistingUser(null);
    setUserSearchQuery("");
    setIsUserSearchOpen(false);
    setIsSearching(false);
    setUserName("");
    setUserEmail("");
    setUserPhone("");
    setUserPassword("");
    setUserConfirmPassword("");
    setIsFormOpen(true);
    setIsUserAssigned(false);
    setUserInfoErrors({});
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

  const handleAddUserInfo = () => {
    const errs: typeof userInfoErrors = {};

    if (userMode === "search" && !selectedExistingUser) {
      errs.general = "Please search and select a user first, or click 'Create a new user'.";
      setUserInfoErrors(errs);
      showToast("Please select a user from the search bar.");
      return;
    }

    if (userMode === "create") {
      if (!userName.trim()) {
        errs.name = "User Name is required.";
      }
      if (!userEmail.trim()) {
        errs.email = "User Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
        errs.email = "Please enter a valid email address.";
      }
      if (!userPhone.trim()) {
        errs.phone = "User Mobile number is required.";
      }
    }

    if (!userPassword) {
      errs.password = "Password is required.";
    } else if (userPassword.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    if (!userConfirmPassword) {
      errs.confirmPassword = "Confirm password is required.";
    } else if (userPassword !== userConfirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setUserInfoErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast("Please resolve errors in User Info.");
      return;
    }

    const assignedName = userMode === "create" ? userName : selectedExistingUser?.name || userName;
    setIsUserAssigned(true);
    onAssignUser(assignedName);
    showToast(`User "${assignedName}" assigned as branch manager.`);
  };

  return (
    <section className={styles.section} aria-labelledby="section-user-info">
      <div className={styles.sectionHeader}>
        <h2 id="section-user-info" className={styles.sectionTitle}>
          User Info<span className={styles.requiredAsterisk}>*</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Search an existing user or create a new user account to assign as branch admin / manager.
        </p>
      </div>

      {/* If already assigned, show rich Assigned Card with Change button */}
      {isUserAssigned ? (
        <div className={styles.userAssignedCard}>
          <div className={styles.userAssignedInfo}>
            <div className={styles.userAvatar}>
              <UserCheck size={18} />
            </div>
            <div className={styles.userMeta}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={styles.userName}>
                  {userMode === "create" ? userName : selectedExistingUser?.name}
                </span>
                <span className={styles.userAssignedBadge}>
                  <CheckCircle2 size={12} /> Assigned Manager
                </span>
              </div>
              <span className={styles.userEmailPhone}>
                {userMode === "create" ? userEmail : selectedExistingUser?.email} •{" "}
                {userPhoneCountry} {userMode === "create" ? userPhone : selectedExistingUser?.phone}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsUserAssigned(false);
              setIsFormOpen(true);
            }}
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
              <div className={styles.userSearchBar}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
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
                    onClick={handleSwitchToSearch}
                    className={styles.clearSearchBtn}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                ) : null}

                {/* Autocomplete Dropdown - only when user has typed */}
                {isUserSearchOpen && userSearchQuery.trim() ? (
                  <div className={styles.userSearchDropdown}>
                    {isSearching ? (
                      <div className={styles.userSearchEmpty}>
                        <Loader2 size={18} className={styles.searchLoaderInline} />
                        <span>Searching users...</span>
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className={styles.userSearchItem}
                          onClick={() => handleSelectUser(u)}
                        >
                          <div className={styles.userSearchItemInfo}>
                            <div className={styles.userAvatar}>
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className={styles.userMeta}>
                              <span className={styles.userName}>{u.name}</span>
                              <span className={styles.userEmailPhone}>
                                {u.email} • {u.countryCode} {u.phone}
                              </span>
                            </div>
                          </div>
                          <span className={styles.userRoleBadge}>{u.role}</span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.userSearchEmpty}>
                        <span>No existing users found matching &ldquo;{userSearchQuery}&rdquo;</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleSwitchToCreate();
                            setUserName(userSearchQuery);
                          }}
                          className={styles.userSearchEmptyBtn}
                        >
                          + Create new user &ldquo;{userSearchQuery}&rdquo;
                        </button>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Create New User button and OR divider only visible if no user selected yet */}
              {!selectedExistingUser ? (
                <>
                  <span className={styles.orDivider}>or</span>
                  <button
                    type="button"
                    onClick={handleSwitchToCreate}
                    className={styles.switchModeBtn}
                  >
                    <UserPlus size={16} />
                    Create a new user
                  </button>
                </>
              ) : null}
            </div>
          ) : (
            <div className={clsx(styles.userBanner, styles.createModeBanner)}>
              <span>
                <strong>Create New User Mode:</strong> Enter the user&apos;s details to create and assign them to this branch.
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

          {/* Form Grid: Opens only when a user is selected or in create mode */}
          {isFormOpen ? (
            <>
              <div className={styles.grid3Col}>
                {/* User Name */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userName"
                    className={clsx(
                      styles.fieldLabel,
                      userInfoErrors.name && styles.fieldLabelInvalid,
                    )}
                  >
                    User Name
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
                    disabled={!isFieldsEnabled && !selectedExistingUser}
                    placeholder={isFieldsEnabled ? "Inp|" : "Select user from search above"}
                    className={clsx(
                      styles.textInput,
                      !isFieldsEnabled && !selectedExistingUser && styles.inputDisabled,
                      userInfoErrors.name && styles.textInputInvalid,
                    )}
                  />
                  {userInfoErrors.name ? (
                    <p className={styles.fieldErrorText}>{userInfoErrors.name}</p>
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
                    User Email
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
                    disabled={!isFieldsEnabled && !selectedExistingUser}
                    placeholder="ex: mail@mail.com"
                    className={clsx(
                      styles.textInput,
                      !isFieldsEnabled && !selectedExistingUser && styles.inputDisabled,
                      userInfoErrors.email && styles.textInputInvalid,
                    )}
                  />
                  {userInfoErrors.email ? (
                    <p className={styles.fieldErrorText}>{userInfoErrors.email}</p>
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
                    User Mobile<span className={styles.requiredAsterisk}>*</span>
                  </label>
                  <div
                    className={clsx(
                      styles.phoneInputWrapper,
                      !isFieldsEnabled && !selectedExistingUser && styles.inputDisabled,
                      userInfoErrors.phone && styles.phoneInputWrapperInvalid,
                    )}
                  >
                    <div className={styles.countrySelectWrapper}>
                      <select
                        value={userPhoneCountry}
                        onChange={(e) => setUserPhoneCountry(e.target.value)}
                        disabled={!isFieldsEnabled && !selectedExistingUser}
                        className={styles.countryCodeSelect}
                        aria-label="Country Code"
                      >
                        {COUNTRY_OPTIONS.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
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
                      disabled={!isFieldsEnabled && !selectedExistingUser}
                      placeholder="ex: 01234567"
                      className={clsx(
                        styles.phoneInput,
                        !isFieldsEnabled && !selectedExistingUser && styles.inputDisabled,
                        userInfoErrors.phone && styles.phoneInputInvalid,
                      )}
                    />
                  </div>
                  {userInfoErrors.phone ? (
                    <p className={styles.fieldErrorText}>{userInfoErrors.phone}</p>
                  ) : null}
                </div>
              </div>

              {/* Password Row (2 Columns matching user screenshot) */}
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
                    Password
                  </label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      id="userPassword"
                      type={showPassword ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => {
                        setUserPassword(e.target.value);
                        if (userInfoErrors.password) {
                          setUserInfoErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                      disabled={!isPasswordEnabled}
                      placeholder="********"
                      className={clsx(
                        styles.textInput,
                        !isPasswordEnabled && styles.inputDisabled,
                        userInfoErrors.password && styles.textInputInvalid,
                      )}
                      style={{ paddingRight: "42px" }}
                    />
                    <button
                      type="button"
                      disabled={!isPasswordEnabled}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {userInfoErrors.password ? (
                    <p className={styles.fieldErrorText}>{userInfoErrors.password}</p>
                  ) : (
                    <span className={styles.fieldHint}>
                      {!isPasswordEnabled
                        ? "Select a user above to enable password"
                        : "Enter password to authorize user assignment (min. 6 characters)"}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className={styles.fieldGroup}>
                  <label
                    htmlFor="userConfirmPassword"
                    className={clsx(
                      styles.fieldLabel,
                      userInfoErrors.confirmPassword && styles.fieldLabelInvalid,
                    )}
                  >
                    Confirm Password
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
                      disabled={!isPasswordEnabled}
                      placeholder="********"
                      className={clsx(
                        styles.textInput,
                        !isPasswordEnabled && styles.inputDisabled,
                        userInfoErrors.confirmPassword && styles.textInputInvalid,
                      )}
                      style={{ paddingRight: "42px" }}
                    />
                    <button
                      type="button"
                      disabled={!isPasswordEnabled}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className={styles.passwordToggleBtn}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {userInfoErrors.confirmPassword ? (
                    <p className={styles.fieldErrorText}>
                      {userInfoErrors.confirmPassword}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Bottom Action Buttons (Reset & Add) with Add button in Primary Color */}
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
