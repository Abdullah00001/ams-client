/**
 * @fileoverview User Search Autocomplete Atomic Component
 * @module features/create-branch/components/user-search-bar
 */

"use client";

import type { ChangeEvent } from "react";
import { Clock, Loader2, Search, UserPlus, X } from "lucide-react";
import { Autocomplete } from "@/components/ui/dropdown";
import { createTouchRipple } from "@/lib/touch-ripple";
import type { ExistingUser } from "../types";
import { detectQueryType, getAvatarPalette, getUserInitials } from "../lib";
import styles from "../styles/user-info-section.module.css";

interface UserSearchBarProps {
  isUserSearchOpen: boolean;
  onOpenChange: (open: boolean) => void;
  loadedUsers: ExistingUser[];
  userSearchQuery: string;
  isQueryEmpty: boolean;
  isSearching: boolean;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchFocus: () => void;
  onInputClick: () => void;
  onClearSearch: () => void;
  onSelectUser: (user: ExistingUser) => void;
  onSwitchToCreate: (query?: string) => void;
}

export function UserSearchBar({
  isUserSearchOpen,
  onOpenChange,
  loadedUsers,
  userSearchQuery,
  isQueryEmpty,
  isSearching,
  onSearchChange,
  onSearchFocus,
  onInputClick,
  onClearSearch,
  onSelectUser,
  onSwitchToCreate,
}: UserSearchBarProps) {
  return (
    <div className={styles.userSearchContainer}>
      <Autocomplete.Root<ExistingUser>
        open={isUserSearchOpen}
        onOpenChange={onOpenChange}
        items={loadedUsers}
        itemToStringValue={(u) => (u ? u.name : "")}
        filter={null}
        modal={false}
        openOnInputClick={true}
      >
        <Autocomplete.InputGroup className={styles.userSearchBar}>
          <Search size={16} className={styles.searchIcon} />
          <Autocomplete.Input
            value={userSearchQuery}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onClick={onInputClick}
            placeholder="Search user by name, email, or mobile..."
            className={styles.userSearchInput}
          />
          {isSearching ? (
            <span className={styles.searchLoader} aria-label="Loading search results">
              <Loader2 size={16} />
            </span>
          ) : userSearchQuery ? (
            <button
              type="button"
              onClick={onClearSearch}
              className={styles.clearSearchBtn}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : null}
        </Autocomplete.InputGroup>

        <Autocomplete.Portal>
          <Autocomplete.Positioner
            sideOffset={6}
            align="start"
            className={styles.userSearchPositioner}
          >
            <Autocomplete.Popup className={styles.userSearchDropdown}>
              {isSearching ? (
                <div className={styles.userSearchLoadingState}>
                  <Loader2 size={18} className={styles.searchLoaderInline} />
                  <span>
                    {isQueryEmpty
                      ? "Loading recently added users..."
                      : `Searching users matching "${userSearchQuery}"...`}
                  </span>
                </div>
              ) : loadedUsers.length > 0 ? (
                <>
                  <div className={styles.userSearchSectionHeader}>
                    <div className={styles.userSearchSectionTitleRow}>
                      {isQueryEmpty ? (
                        <>
                          <Clock size={12} />
                          <span>Recently Added Users</span>
                        </>
                      ) : (
                        <>
                          <Search size={12} />
                          <span>Matching Users</span>
                        </>
                      )}
                    </div>
                    <span className={styles.userSearchSectionBadge}>
                      {isQueryEmpty ? "5 Latest" : `${loadedUsers.length} found`}
                    </span>
                  </div>

                  <Autocomplete.List className={styles.userSearchList}>
                    {loadedUsers.map((u) => {
                      const uPalette = getAvatarPalette(u.name);
                      const uInitials = getUserInitials(u.name);
                      return (
                        <Autocomplete.Item
                          key={u.id}
                          value={u}
                          onClick={() => onSelectUser(u)}
                          onMouseDown={(e) => createTouchRipple(e, "primary")}
                          className={styles.userSearchItem}
                        >
                          <div className={styles.userSearchItemInfo}>
                            <div
                              className={styles.userSearchAvatar}
                              style={{
                                backgroundColor: uPalette.bg,
                                color: uPalette.text,
                                borderColor: uPalette.border,
                              }}
                            >
                              {uInitials}
                            </div>
                            <div className={styles.userSearchMeta}>
                              <span className={styles.userSearchName} title={u.name}>
                                {u.name}
                              </span>
                              <span className={styles.userSearchEmailPhone}>
                                <span className={styles.userSearchEmail} title={u.email}>
                                  {u.email}
                                </span>
                                <span className={styles.userSearchDot}>•</span>
                                <span className={styles.userSearchPhone}>
                                  {u.countryCode} {u.phone}
                                </span>
                              </span>
                            </div>
                          </div>
                          <span className={styles.userRoleBadge}>{u.role}</span>
                        </Autocomplete.Item>
                      );
                    })}
                  </Autocomplete.List>
                </>
              ) : (
                <div className={styles.userSearchEmpty}>
                  <span>No existing users found matching &ldquo;{userSearchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => onSwitchToCreate(userSearchQuery)}
                    className={styles.userSearchEmptyBtn}
                  >
                    {(() => {
                      const detected = detectQueryType(userSearchQuery);
                      if (detected.type === "email") {
                        return `+ Create new user with email "${userSearchQuery}"`;
                      }
                      if (detected.type === "phone") {
                        return `+ Create new user with mobile "${userSearchQuery}"`;
                      }
                      return `+ Create new user "${userSearchQuery}"`;
                    })()}
                  </button>
                </div>
              )}
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>

      {/* Create New User button and OR divider */}
      <span className={styles.orDivider}>or</span>
      <button
        type="button"
        onClick={() => onSwitchToCreate(userSearchQuery)}
        className={styles.switchModeBtn}
      >
        <UserPlus size={16} />
        Create a new user
      </button>
    </div>
  );
}

