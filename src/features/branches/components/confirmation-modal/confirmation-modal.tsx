/**
 * @fileoverview Confirmation Modal for Branch Critical Operations
 * @module features/branches/components/confirmation-modal
 *
 * Provides a clean, accessible confirmation dialog for activating,
 * deactivating, and permanently deleting branches.
 */

"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Power, Trash2, X } from "lucide-react";
import type { Branch } from "../../types";
import styles from "./confirmation-modal.module.css";

export type ConfirmationType = "activate" | "deactivate" | "delete";

export type ConfirmationModalProps = {
  isOpen: boolean;
  type: ConfirmationType;
  branch: Branch | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationModal({
  isOpen,
  type,
  branch,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button on open & trap Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => confirmBtnRef.current?.focus(), 60);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onCancel]);

  if (!isOpen || !branch) return null;

  const getConfig = () => {
    switch (type) {
      case "activate":
        return {
          icon: <Power className={styles.iconActivate} />,
          iconBg: styles.iconBgActivate,
          title: "Activate Branch?",
          description: (
            <>
              Are you sure you want to activate <strong>{branch.name}</strong>?
              This branch will become operational and visible to students and instructors.
            </>
          ),
          confirmLabel: "Activate Branch",
          confirmClass: styles.confirmButtonActivate,
        };
      case "deactivate":
        return {
          icon: <AlertTriangle className={styles.iconDeactivate} />,
          iconBg: styles.iconBgDeactivate,
          title: "Deactivate Branch?",
          description: (
            <>
              Are you sure you want to deactivate <strong>{branch.name}</strong>?
              Enrolled students and staff will temporarily lose access to this campus.
            </>
          ),
          confirmLabel: "Deactivate Branch",
          confirmClass: styles.confirmButtonDeactivate,
        };
      case "delete":
        return {
          icon: <Trash2 className={styles.iconDelete} />,
          iconBg: styles.iconBgDelete,
          title: "Delete Branch?",
          description: (
            <>
              Are you sure you want to permanently delete <strong>{branch.name}</strong>?
              This action <strong>cannot be undone</strong> and all branch associations will be removed.
            </>
          ),
          confirmLabel: "Delete Permanently",
          confirmClass: styles.confirmButtonDelete,
        };
    }
  };

  const config = getConfig();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={styles.modalCard}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className={styles.closeButton}
          aria-label="Close confirmation"
        >
          <X className={styles.closeIcon} />
        </button>

        {/* Modal Header & Icon */}
        <div className={styles.content}>
          <div className={`${styles.iconWrapper} ${config.iconBg}`}>
            {config.icon}
          </div>

          <div className={styles.textGroup}>
            <h3 id="modal-title" className={styles.title}>
              {config.title}
            </h3>
            <p className={styles.description}>{config.description}</p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={`${styles.confirmButton} ${config.confirmClass}`}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
