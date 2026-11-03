/**
 * @fileoverview Social Media Section Component
 * @module features/create-branch/components/social-media-section
 */

"use client";

import { useState } from "react";
import { AlertCircle, Check, Plus, Trash2 } from "lucide-react";
import {
  type SocialMediaLink,
  type SocialMediaPlatform,
  SOCIAL_PLATFORMS,
  PLATFORM_PLACEHOLDERS,
} from "../types";
import {
  detectPlatformFromUrl,
  extractSocialHandle,
  formatPlatformUrl,
  normalizeSocialUrl,
  validateSocialUrl,
} from "../lib";
import styles from "../styles/social-media-section.module.css";

interface SocialMediaSectionProps {
  socialLinks: SocialMediaLink[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onPlatformChange: (id: string, platform: SocialMediaPlatform) => void;
  onUrlChange: (id: string, url: string) => void;
  errorMessage?: string;
}

export function SocialMediaSection({
  socialLinks,
  onAddRow,
  onRemoveRow,
  onPlatformChange,
  onUrlChange,
  errorMessage,
}: SocialMediaSectionProps) {
  // Track touched state per row ID so validation isn't intrusive before user interacts
  const [touchedRows, setTouchedRows] = useState<Record<string, boolean>>({});

  const handleUrlInputChange = (id: string, platform: SocialMediaPlatform, val: string) => {
    // Intelligent auto-detection of platform when pasting links
    const detectedPlatform = detectPlatformFromUrl(val);
    if (detectedPlatform && detectedPlatform !== platform) {
      onPlatformChange(id, detectedPlatform);
    }

    onUrlChange(id, val);
  };

  const handleUrlInputBlur = (id: string, platform: SocialMediaPlatform, val: string) => {
    setTouchedRows((prev) => ({ ...prev, [id]: true }));

    // Intelligently normalize handle / protocol
    const normalized = normalizeSocialUrl(platform, val);
    if (normalized !== val) {
      onUrlChange(id, normalized);
    }
  };

  const handlePlatformSelectChange = (
    id: string,
    currentUrl: string,
    newPlatform: SocialMediaPlatform,
  ) => {
    // Intelligently adapt handle to new platform if an existing URL is present
    if (currentUrl.trim()) {
      const handle = extractSocialHandle(currentUrl);
      if (handle) {
        const adaptedUrl = formatPlatformUrl(newPlatform, handle);
        onUrlChange(id, adaptedUrl);
      }
    }
    onPlatformChange(id, newPlatform);
  };

  return (
    <section className={styles.section} aria-labelledby="section-social-links">
      <div className={styles.sectionHeader}>
        <h2 id="section-social-links" className={styles.sectionTitle}>
          Social Media Links
        </h2>
        <p className={styles.sectionSubtitle}>
          Connect branch social profiles (Facebook, LinkedIn, YouTube, Instagram, TikTok).
        </p>
      </div>

      <div className={styles.socialList}>
        {socialLinks.map((social) => {
          const isTouched = Boolean(touchedRows[social.id]) || Boolean(errorMessage);
          const validationError =
            isTouched && social.url.trim()
              ? validateSocialUrl(social.platform, social.url)
              : null;
          const isValid = social.url.trim().length > 0 && !validationError;

          return (
            <div key={social.id} className={styles.socialRowContainer}>
              <div className={styles.socialRow}>
                {/* Platform selector */}
                <select
                  value={social.platform}
                  onChange={(e) =>
                    handlePlatformSelectChange(
                      social.id,
                      social.url,
                      e.target.value as SocialMediaPlatform,
                    )
                  }
                  className={styles.socialPlatformSelect}
                  aria-label="Social media platform"
                >
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>

                {/* URL input with validation and status icons */}
                <div className={styles.socialInputWrapper}>
                  <input
                    type="url"
                    value={social.url}
                    onChange={(e) =>
                      handleUrlInputChange(social.id, social.platform, e.target.value)
                    }
                    onBlur={(e) =>
                      handleUrlInputBlur(social.id, social.platform, e.target.value)
                    }
                    placeholder={PLATFORM_PLACEHOLDERS[social.platform]}
                    className={`${styles.socialUrlInput} ${
                      validationError ? styles.socialUrlInputInvalid : ""
                    }`}
                    aria-label={`${social.platform} URL`}
                    aria-invalid={Boolean(validationError)}
                  />

                  {isValid && (
                    <Check
                      size={15}
                      className={styles.validIcon}
                      aria-label="Valid link"
                    />
                  )}

                  {validationError && (
                    <AlertCircle
                      size={15}
                      className={styles.invalidIcon}
                      aria-label="Invalid link"
                    />
                  )}
                </div>

                {/* Remove row button */}
                <button
                  type="button"
                  onClick={() => onRemoveRow(social.id)}
                  className={styles.removeSocialBtn}
                  title="Remove link"
                  aria-label="Remove link"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Inline error message */}
              {validationError && (
                <p className={styles.rowErrorText} role="alert">
                  {validationError}
                </p>
              )}
            </div>
          );
        })}

        <div className={styles.socialActionsRow}>
          <button
            type="button"
            onClick={onAddRow}
            className={styles.addSocialBtn}
          >
            <Plus size={15} /> Add more
          </button>
        </div>
      </div>
    </section>
  );
}
