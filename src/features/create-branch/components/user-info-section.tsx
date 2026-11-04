/**
 * @fileoverview User Info Section Coordinator Component
 * @module features/create-branch/components/user-info-section
 */

"use client";

import clsx from "clsx";
import { useUserInfoSection } from "../hooks";
import { UserAssignedCard } from "./user-assigned-card";
import { UserSearchBar } from "./user-search-bar";
import { UserCreateForm } from "./user-create-form";
import styles from "../styles/user-info-section.module.css";

export interface UserInfoSectionProps {
  onAssignUser: (assignedName: string) => void;
  showToast: (msg: string) => void;
  errorMessage?: string;
}

export function UserInfoSection({
  onAssignUser,
  showToast,
  errorMessage,
}: UserInfoSectionProps) {
  const {
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
  } = useUserInfoSection({ onAssignUser, showToast });

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

      {isUserAssigned ? (
        <UserAssignedCard
          assignedName={assignedName}
          assignedEmail={assignedEmail}
          assignedCountry={assignedCountry}
          assignedPhone={assignedPhone}
          assignedRole={assignedRole}
          avatarPalette={avatarPalette}
          initials={initials}
          onReassign={handleReassign}
        />
      ) : userMode === "search" ? (
        <UserSearchBar
          isUserSearchOpen={isUserSearchOpen}
          onOpenChange={(nextOpen) => {
            if (nextOpen) {
              handleOpenSearch();
            } else {
              handleCloseSearch();
            }
          }}
          loadedUsers={loadedUsers}
          userSearchQuery={userSearchQuery}
          isQueryEmpty={isQueryEmpty}
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          onInputClick={handleInputClick}
          onClearSearch={handleClearSearch}
          onSelectUser={handleSelectUser}
          onSwitchToCreate={handleSwitchToCreate}
        />
      ) : isFormOpen ? (
        <UserCreateForm
          userName={userName}
          userEmail={userEmail}
          userPhoneCountry={userPhoneCountry}
          userPhone={userPhone}
          userPassword={userPassword}
          userConfirmPassword={userConfirmPassword}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          userInfoErrors={userInfoErrors}
          passwordCriteria={passwordCriteria}
          hasConfirmPassword={hasConfirmPassword}
          isPasswordMatched={isPasswordMatched}
          isPasswordMismatch={isPasswordMismatch}
          onNameChange={(val) => {
            setUserName(val);
            if (userInfoErrors.name) {
              setUserInfoErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          onEmailChange={(val) => {
            setUserEmail(val);
            if (userInfoErrors.email) {
              setUserInfoErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          onPhoneCountryChange={setUserPhoneCountry}
          onPhoneChange={(val) => {
            setUserPhone(val);
            if (userInfoErrors.phone) {
              setUserInfoErrors((prev) => ({ ...prev, phone: undefined }));
            }
          }}
          onPasswordChange={(val) => {
            setUserPassword(val);
            if (userInfoErrors.password) {
              setUserInfoErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          onConfirmPasswordChange={(val) => {
            setUserConfirmPassword(val);
            if (userInfoErrors.confirmPassword) {
              setUserInfoErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          onToggleShowPassword={() => setShowPassword((prev) => !prev)}
          onToggleShowConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
          onValidateField={validateField}
          onSwitchToSearch={handleSwitchToSearch}
          onResetUserInfo={handleResetUserInfo}
          onAddUserInfo={handleAddUserInfo}
        />
      ) : null}
    </section>
  );
}
