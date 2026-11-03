/**
 * @fileoverview Universal Dropdown & Select Component (Base UI + MUI Theme)
 * @module components/ui/dropdown/dropdown
 *
 * Implements a headless, accessible select and dropdown menu using @base-ui/react,
 * styled to Material UI specifications with AMS design tokens, elevation, smooth
 * chevron rotation, and Material touch ripple feedback.
 */

"use client";

import { useId, useMemo, type MouseEvent } from "react";
import { Select, Menu } from "@base-ui/react";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { createTouchRipple } from "@/lib/touch-ripple";
import type { DropdownProps, DropdownMenuProps } from "./dropdown.types";
import styles from "./dropdown.module.css";

/**
 * Universal Dropdown (Select) Component
 *
 * @example
 * ```tsx
 * <Dropdown
 *   label="Campus Brand"
 *   options={[
 *     { value: "DSCA", label: "Dhaka Specialty Coffee Academy" },
 *     { value: "GBTA", label: "Global Barista Training Academy" },
 *   ]}
 *   value={selectedBrand}
 *   onChange={setSelectedBrand}
 * />
 * ```
 */
export function Dropdown<T = string>({
  alignItemWithTrigger = false,
  children,
  className,
  defaultValue,
  disabled = false,
  enableRipple = true,
  endIcon,
  errorMessage,
  fullWidth = true,
  helperText,
  hideLabel = false,
  id,
  invalid = false,
  label,
  name,
  onChange,
  onValueChange,
  options,
  placeholder = "Select an option...",
  popupClassName,
  readOnly = false,
  required = false,
  sideOffset = 4,
  size = "md",
  startIcon,
  triggerClassName,
  value,
  variant = "outlined",
}: DropdownProps<T>) {
  const generatedId = useId();
  const dropdownId = id ?? `dropdown-${generatedId}`;
  const helperId = helperText ? `${dropdownId}-helper` : undefined;
  const errorId = invalid && errorMessage ? `${dropdownId}-error` : undefined;

  const handleTriggerMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (enableRipple && !disabled) {
      createTouchRipple(e, "dark");
    }
  };

  const handleItemMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (enableRipple) {
      createTouchRipple(e, "primary");
    }
  };

  // Convert options to Base UI items shape for automatic trigger text resolution
  const baseItems = useMemo(() => {
    if (!options) return undefined;
    return options.map((opt) => ({
      value: opt.value,
      label: opt.label,
    }));
  }, [options]);

  const handleInternalChange = (val: unknown) => {
    if (onChange) onChange(val as T);
    if (onValueChange) onValueChange(val as T);
  };

  return (
    <div
      className={clsx(
        styles.field,
        fullWidth && styles.fullWidth,
        className,
      )}
    >
      {label ? (
        <label
          className={clsx(
            styles.label,
            invalid && styles.labelInvalid,
            hideLabel && styles.visuallyHidden,
          )}
          htmlFor={dropdownId}
        >
          {label}
          {required ? (
            <span className={styles.requiredAsterisk} aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <Select.Root
        id={dropdownId}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleInternalChange}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        items={baseItems}
      >
        <Select.Trigger
          onMouseDown={handleTriggerMouseDown}
          className={clsx(
            styles.trigger,
            styles[variant],
            styles[size],
            invalid && styles.invalid,
            triggerClassName,
          )}
          aria-invalid={invalid}
          aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
        >
          <div className={styles.triggerContent}>
            {startIcon ? (
              <span className={styles.startIcon} aria-hidden="true">
                {startIcon}
              </span>
            ) : null}
            <Select.Value
              className={styles.valueText}
              placeholder={<span className={styles.placeholder}>{placeholder}</span>}
            />
          </div>

          <div className={styles.triggerContent} style={{ flex: 0, minWidth: "auto" }}>
            {endIcon ? (
              <span className={styles.endIcon} aria-hidden="true">
                {endIcon}
              </span>
            ) : null}
            <Select.Icon className={styles.icon}>
              <ChevronDown size={size === "sm" ? 14 : 16} />
            </Select.Icon>
          </div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner
            sideOffset={sideOffset}
            alignItemWithTrigger={alignItemWithTrigger}
            className={styles.positioner}
          >
            <Select.Popup className={clsx(styles.popup, popupClassName)}>
              <Select.List className={styles.list}>
                {options
                  ? options.map((opt) => (
                      <Select.Item
                        key={String(opt.value)}
                        value={opt.value}
                        disabled={opt.disabled}
                        onMouseDown={handleItemMouseDown}
                        className={styles.item}
                      >
                        <div className={styles.itemContent}>
                          {opt.icon ? (
                            <span className={styles.itemIcon}>{opt.icon}</span>
                          ) : null}
                          <div className={styles.itemTextContainer}>
                            <Select.ItemText className={styles.itemLabel}>
                              {opt.label}
                            </Select.ItemText>
                            {opt.description ? (
                              <span className={styles.itemDescription}>
                                {opt.description}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <Select.ItemIndicator className={styles.itemIndicator}>
                          <Check size={16} strokeWidth={2.5} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))
                  : children}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>

      {helperText ? (
        <p className={styles.helperText} id={helperId}>
          {helperText}
        </p>
      ) : null}

      {errorId ? (
        <p className={styles.errorText} id={errorId} role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

// Attach Base UI composable primitives to Dropdown
Dropdown.Root = Select.Root;
Dropdown.Trigger = Select.Trigger;
Dropdown.Value = Select.Value;
Dropdown.Icon = Select.Icon;
Dropdown.Portal = Select.Portal;
Dropdown.Positioner = Select.Positioner;
Dropdown.Popup = Select.Popup;
Dropdown.List = Select.List;
Dropdown.Item = Select.Item;
Dropdown.ItemText = Select.ItemText;
Dropdown.ItemIndicator = Select.ItemIndicator;
Dropdown.Group = Select.Group;
Dropdown.GroupLabel = Select.GroupLabel;
Dropdown.Separator = Select.Separator;

/**
 * Dropdown Action Menu Component (MUI style Action Menu with Base UI)
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   trigger={<button>Actions</button>}
 *   items={[
 *     { label: "Edit Branch", onClick: () => edit() },
 *     "separator",
 *     { label: "Delete Branch", destructive: true, onClick: () => remove() },
 *   ]}
 * />
 * ```
 */
export function DropdownMenu({
  align = "start",
  className,
  disabled = false,
  enableRipple = true,
  items,
  popupClassName,
  sideOffset = 6,
  trigger,
}: DropdownMenuProps) {
  const handleItemMouseDown = (e: MouseEvent<HTMLElement>) => {
    if (enableRipple) {
      createTouchRipple(e, "dark");
    }
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        disabled={disabled}
        className={className}
        render={typeof trigger === "object" && trigger !== null ? (trigger as React.ReactElement) : undefined}
      >
        {typeof trigger !== "object" ? trigger : undefined}
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={sideOffset} align={align} className={styles.positioner}>
          <Menu.Popup className={clsx(styles.popup, popupClassName)}>
            <div className={styles.list}>
              {items.map((item, index) => {
                if (item === "separator") {
                  return (
                    <div
                      key={`sep-${index}`}
                      className={styles.separator}
                      role="separator"
                    />
                  );
                }

                return (
                  <Menu.Item
                    key={item.key ?? `item-${index}`}
                    disabled={item.disabled}
                    onClick={item.onClick}
                    onMouseDown={handleItemMouseDown}
                    className={clsx(
                      styles.menuItem,
                      item.destructive && styles.menuItemDestructive,
                    )}
                  >
                    {item.icon ? (
                      <span className={styles.itemIcon}>{item.icon}</span>
                    ) : null}
                    <div className={styles.itemTextContainer}>
                      <span className={styles.itemLabel}>{item.label}</span>
                      {item.description ? (
                        <span className={styles.itemDescription}>
                          {item.description}
                        </span>
                      ) : null}
                    </div>
                  </Menu.Item>
                );
              })}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

DropdownMenu.Root = Menu.Root;
DropdownMenu.Trigger = Menu.Trigger;
DropdownMenu.Portal = Menu.Portal;
DropdownMenu.Positioner = Menu.Positioner;
DropdownMenu.Popup = Menu.Popup;
DropdownMenu.Item = Menu.Item;
DropdownMenu.Separator = Menu.Separator;
