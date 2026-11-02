/**
 * @fileoverview Confirmation Modal for Branch Critical Operations
 * @module features/branches/components/confirmation-modal
 *
 * Implements confirmation dialogs using the universal Modal component
 * with Figma-spec dimensions, Lottie animations, and AMS tokens.
 */

"use client";

import { Modal } from "@/components/ui/modal";
import type { Branch } from "../types";

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
  if (!branch) return null;

  const getConfig = () => {
    switch (type) {
      case "activate":
        return {
          variant: "success" as const,
          confirmVariant: "primary" as const,
          title: "Activate Branch?",
          description: (
            <>
              Are you sure you want to activate <strong>{branch.name}</strong>?
              This branch will become operational and visible to students and instructors.
            </>
          ),
          confirmLabel: "Activate Branch",
        };
      case "deactivate":
        return {
          variant: "error" as const,
          confirmVariant: "error" as const,
          title: "Deactivate Branch?",
          description: (
            <>
              Are you sure you want to deactivate <strong>{branch.name}</strong>?
              Enrolled students and staff will temporarily lose access to this campus.
            </>
          ),
          confirmLabel: "Deactivate Branch",
        };
      case "delete":
        return {
          variant: "delete" as const,
          confirmVariant: "delete" as const,
          title: "Delete Branch?",
          description: (
            <>
              Are you sure you want to delete <strong>{branch.name}</strong>?
              This action cannot be undone, and all related items may be affected.
            </>
          ),
          confirmLabel: "Delete",
        };
    }
  };

  const config = getConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={config.title}
      description={config.description}
      confirmLabel={config.confirmLabel}
      cancelLabel="Cancel"
      variant={config.variant}
      confirmVariant={config.confirmVariant}
    />
  );
}
