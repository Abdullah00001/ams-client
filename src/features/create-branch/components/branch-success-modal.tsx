/**
 * @fileoverview Branch Success Modal Component
 * @module features/create-branch/components/branch-success-modal
 *
 * Popup displayed after successfully creating a branch with dual CTAs to
 * either create another branch (resetting form) or navigate to all branches list.
 */

"use client";

import { Modal } from "@/components/ui/modal";
import styles from "../styles/branch-success-modal.module.css";

export interface BranchSuccessModalProps {
  isOpen: boolean;
  branchName: string;
  onCreateAnother: () => void;
  onViewAllBranches: () => void;
}

export function BranchSuccessModal({
  isOpen,
  branchName,
  onCreateAnother,
  onViewAllBranches,
}: BranchSuccessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCreateAnother}
      onConfirm={onViewAllBranches}
      title="Branch Created Successfully!"
      description={
        <p className={styles.descriptionText}>
          {branchName ? (
            <>
              Branch <strong className={styles.branchHighlight}>&ldquo;{branchName}&rdquo;</strong> has been created and registered successfully.
            </>
          ) : (
            "The new branch has been created and registered successfully."
          )}
        </p>
      }
      cancelLabel="Create Another Branch"
      confirmLabel="All Branches"
      variant="success"
      confirmVariant="primary"
    />
  );
}

