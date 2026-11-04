/**
 * @fileoverview Hook managing User Info section state and operations
 * @module features/create-branch/hooks/use-user-info-section
 */

"use client";

import { useState, useRef, useEffect, type ChangeEvent } from "react";
import {
  MOCK_EXISTING_USERS,
  type ExistingUser,
} from "../types";
import {
  checkPasswordCriteria,
  detectQueryType,
  getAvatarPalette,
  getPasswordErrorMessage,
  getUserInitials,
} from "../lib";

export interface UseUserInfoSectionOptions {
  onAssignUser: (assignedName: string) => void;
  showToast: (msg: string) => void;
}

export function useUserInfoSection({ onAssignUser, showToast }: UseUserInfoSectionOptions) {
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

  return {
    userMode,
    isFormOpen,
    userSearchQuery,
    isSearching,
    isUserSearchOpen,
    loadedUsers,
    isQueryEmpty,
    userName,
    userEmail,
    userPhoneCountry,
    userPhone,
    userPassword,
    userConfirmPassword,
    showPassword,
    showConfirmPassword,
    isUserAssigned,
    userInfoErrors,
    assignedName,
    assignedEmail,
    assignedCountry,
    assignedPhone,
    assignedRole,
    avatarPalette,
    initials,
    passwordCriteria,
    hasPassword,
    hasConfirmPassword,
    isPasswordMatched,
    isPasswordMismatch,
    setUserName,
    setUserEmail,
    setUserPhoneCountry,
    setUserPhone,
    setUserPassword,
    setUserConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setUserInfoErrors,
    handleOpenSearch,
    handleCloseSearch,
    handleSearchChange,
    handleSearchFocus,
    handleInputClick,
    handleClearSearch,
    handleSelectUser,
    handleSwitchToCreate,
    handleSwitchToSearch,
    handleReassign,
    handleResetUserInfo,
    validateField,
    handleAddUserInfo,
  };
}

