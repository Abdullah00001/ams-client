/**
 * @fileoverview Social Media Section Component
 * @module features/create-branch/components/social-media-section
 */

"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  type SocialMediaLink,
  type SocialMediaPlatform,
  SOCIAL_PLATFORMS,
  PLATFORM_PLACEHOLDERS,
} from "../types";
import styles from "../styles/social-media-section.module.css";

interface SocialMediaSectionProps {
  socialLinks: SocialMediaLink[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onPlatformChange: (id: string, platform: SocialMediaPlatform) => void;
  onUrlChange: (id: string, url: string) => void;
  onSaveLinks: () => void;
}

export function SocialMediaSection({
  socialLinks,
  onAddRow,
  onRemoveRow,
  onPlatformChange,
  onUrlChange,
  onSaveLinks,
}: SocialMediaSectionProps) {
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
        {socialLinks.map((social) => (
          <div key={social.id} className={styles.socialRow}>
            {/* Platform selector */}
            <select
              value={social.platform}
              onChange={(e) =>
                onPlatformChange(
                  social.id,
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

            {/* URL input */}
            <input
              type="url"
              value={social.url}
              onChange={(e) => onUrlChange(social.id, e.target.value)}
              placeholder={PLATFORM_PLACEHOLDERS[social.platform]}
              className={styles.socialUrlInput}
              aria-label={`${social.platform} URL`}
            />

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
        ))}

        <div className={styles.socialActionsRow}>
          <button
            type="button"
            onClick={onAddRow}
            className={styles.addSocialBtn}
          >
            <Plus size={15} /> + Add more
          </button>
          <button
            type="button"
            onClick={onSaveLinks}
            className={styles.draftButton}
          >
            Save Links
          </button>
        </div>
      </div>
    </section>
  );
}
