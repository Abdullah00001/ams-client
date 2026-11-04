/**
 * @fileoverview User Creation Form Atomic Component
 * @module features/create-branch/components/user-create-form
 */

"use client";

import clsx from "clsx";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { Dropdown } from "@/components/ui/dropdown";
import { COUNTRY_OPTIONS } from "../types";
import type { PasswordCriteria } from "../lib";
import styles from "../styles/user-info-section.module.css";

interface UserCreateFormProps {
  userName: string;
  userEmail: string;
  userPhoneCountry: string;
  userPhone: string;
  userPassword: string;
  userConfirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  userInfoErrors: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  };
  passwordCriteria: PasswordCriteria;
  hasConfirmPassword: boolean;
  isPasswordMatched: boolean;
  isPasswordMismatch: boolean;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPhoneCountryChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  onValidateField: (field: "name" | "email" | "phone" | "password" | "confirmPassword") => void;
  onSwitchToSearch: () => void;
  onResetUserInfo: () => void;
  onAddUserInfo: () => void;
}

export function UserCreateForm({
  userName,
  userEmail,
  userPhoneCountry,
  userPhone,
  userPassword,
  userConfirmPassword,
  showPassword,
  showConfirmPassword,
  userInfoErrors,
  passwordCriteria,
  hasConfirmPassword,
  isPasswordMatched,
  isPasswordMismatch,
  onNameChange,
  onEmailChange,
  onPhoneCountryChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  onValidateField,
  onSwitchToSearch,
  onResetUserInfo,
  onAddUserInfo,
}: UserCreateFormProps) {
  return (
    <>
      <div className={clsx(styles.userBanner, styles.createModeBanner)}>
        <span>
          <strong>Create New User Mode:</strong> Enter user details to create and assign as branch manager.
        </span>
        <button
          type="button"
          onClick={onSwitchToSearch}
          className={styles.bannerActionBtn}
        >
          ← Search existing user instead
        </button>
      </div>

      {userInfoErrors.general ? (
        <p className={styles.fieldErrorText} style={{ marginBottom: "12px" }}>
          {userInfoErrors.general}
        </p>
      ) : null}

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
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => onValidateField("name")}
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
            onChange={(e) => onEmailChange(e.target.value)}
            onBlur={() => onValidateField("email")}
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

        {/* User Mobile */}
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
                onChange={onPhoneCountryChange}
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
              onChange={(e) => onPhoneChange(e.target.value)}
              onBlur={() => onValidateField("phone")}
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
              onChange={(e) => onPasswordChange(e.target.value)}
              onBlur={() => onValidateField("password")}
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
              onClick={onToggleShowPassword}
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
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              onBlur={() => onValidateField("confirmPassword")}
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
              onClick={onToggleShowConfirmPassword}
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
          onClick={onResetUserInfo}
          className={styles.userInfoResetBtn}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onAddUserInfo}
          className={styles.userInfoAddBtn}
        >
          Add
        </button>
      </div>
    </>
  );
}

