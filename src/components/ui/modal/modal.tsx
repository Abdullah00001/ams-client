/**
 * @fileoverview Universal Confirmation & Action Modal Component
 * @module components/ui/modal/modal
 *
 * Implements the Figma 595x424px modal theme with 15px radius, 150x150px Lottie icon,
 * 240px wide action buttons, and full adherence to AMS design tokens and Inter typography.
 */

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { LottieIcon, type LottieIconVariant } from "./lottie-icon";
import styles from "./modal.module.css";

export type ModalVariant = "delete" | "error" | "warning" | "success" | "info" | "primary";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ModalVariant;
  /** Explicit override for confirm button style */
  confirmVariant?: ModalVariant;
  /** Explicit override for icon/Lottie style */
  iconVariant?: LottieIconVariant;
  /** Optional URL to a custom Lottie JSON file */
  lottieUrl?: string;
  /** Optional Lottie animation JSON object */
  lottieData?: Record<string, unknown>;
  /** Optional custom icon override */
  icon?: ReactNode;
  /** Optional custom children to render in body */
  children?: ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "delete",
  confirmVariant,
  iconVariant,
  lottieUrl,
  lottieData,
  icon,
  children,
}: ModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => confirmBtnRef.current?.focus(), 60);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    const effective = confirmVariant ?? variant;
    switch (effective) {
      case "delete":
      case "error":
        return styles.confirmButtonDelete;
      case "warning":
        return styles.confirmButtonWarning;
      case "success":
        return styles.confirmButtonSuccess;
      case "primary":
      case "info":
      default:
        return styles.confirmButtonPrimary;
    }
  };

  const getLottieVariant = (): LottieIconVariant => {
    if (iconVariant) return iconVariant;
    if (variant === "delete") return "delete";
    if (variant === "error") return "error";
    if (variant === "warning") return "warning";
    if (variant === "success") return "success";
    return "info";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalCard}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close modal"
        >
          <X className={styles.closeIcon} />
        </button>

        {/* Top Centered Lottie Animation (150x150px) */}
        <div className={styles.iconSection}>
          {icon ? (
            icon
          ) : (
            <LottieIcon
              variant={getLottieVariant()}
              animationUrl={lottieUrl}
              animationData={lottieData}
              width={150}
              height={150}
            />
          )}
        </div>

        {/* Text Section (Title & Description) */}
        <div className={styles.textSection}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          {description && <div className={styles.description}>{description}</div>}
          {children}
        </div>

        {/* Bottom Actions: Cancel (240px) & Confirm (240px) */}
        <div className={styles.actionsContainer}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              ref={confirmBtnRef}
              type="button"
              onClick={onConfirm}
              className={`${styles.confirmButton} ${getConfirmButtonClass()}`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
