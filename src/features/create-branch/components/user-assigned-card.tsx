/**
 * @fileoverview Assigned User Card Atomic Component
 * @module features/create-branch/components/user-assigned-card
 */

"use client";

import { CheckCircle2 } from "lucide-react";
import styles from "../styles/user-info-section.module.css";

interface UserAssignedCardProps {
  assignedName: string;
  assignedEmail: string;
  assignedCountry: string;
  assignedPhone: string;
  assignedRole: string;
  avatarPalette: { bg: string; text: string; border: string };
  initials: string;
  onReassign: () => void;
}

export function UserAssignedCard({
  assignedName,
  assignedEmail,
  assignedCountry,
  assignedPhone,
  assignedRole,
  avatarPalette,
  initials,
  onReassign,
}: UserAssignedCardProps) {
  return (
    <div className={styles.assignedUserCard}>
      <div className={styles.assignedUserCardContent}>
        <div
          className={styles.assignedUserAvatar}
          style={{
            backgroundColor: avatarPalette.bg,
            color: avatarPalette.text,
            borderColor: avatarPalette.border,
          }}
        >
          {initials}
        </div>
        <div className={styles.assignedUserDetails}>
          <div className={styles.assignedUserNameRow}>
            <span className={styles.assignedUserName}>{assignedName}</span>
            <span className={styles.assignedUserBadge}>
              <CheckCircle2 size={13} /> Assigned Manager
            </span>
          </div>
          <span className={styles.assignedUserMeta}>
            <span className={styles.assignedUserRole}>{assignedRole}</span>
            <span>•</span>
            <span>{assignedEmail}</span>
            <span>•</span>
            <span>{assignedCountry} {assignedPhone}</span>
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onReassign}
        className={styles.reassignBtn}
      >
        Change User
      </button>
    </div>
  );
}

