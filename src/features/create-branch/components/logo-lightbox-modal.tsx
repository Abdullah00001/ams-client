/**
 * @fileoverview Branch Logo Lightbox Modal
 * @module features/create-branch/components/logo-lightbox-modal
 */

"use client";

import { X } from "lucide-react";
import styles from "../styles/logo-lightbox-modal.module.css";

interface LogoLightboxModalProps {
  isOpen: boolean;
  logoUrl: string | null;
  logoFileName: string;
  onClose: () => void;
}

export function LogoLightboxModal({
  isOpen,
  logoUrl,
  logoFileName,
  onClose,
}: LogoLightboxModalProps) {
  if (!isOpen || !logoUrl) return null;

  return (
    <div
      className={styles.lightboxOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Branch Logo Preview"
    >
      <div
        className={styles.lightboxContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.lightboxHeader}>
          <div className={styles.lightboxTitleInfo}>
            <h3 className={styles.lightboxTitle}>Branch Logo Preview</h3>
            <span className={styles.lightboxSubtitle}>{logoFileName}</span>
          </div>
          <button
            type="button"
            className={styles.lightboxCloseBtn}
            onClick={onClose}
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>
        <div className={styles.lightboxImageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={logoFileName}
            className={styles.lightboxImage}
          />
        </div>
        <div className={styles.lightboxFooter}>
          <button
            type="button"
            className={styles.lightboxCloseFooterBtn}
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
