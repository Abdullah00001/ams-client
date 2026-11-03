/**
 * @fileoverview Universal Dropdown Component Types
 * @module components/ui/dropdown/dropdown.types
 */

import type { ReactNode } from "react";

export type DropdownSize = "sm" | "md" | "lg";
export type DropdownVariant = "outlined" | "filled" | "ghost";

export interface DropdownOption<T = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps<T = string> {
  id?: string;
  name?: string;
  label?: ReactNode;
  placeholder?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  options?: DropdownOption<T>[];
  value?: T | null;
  defaultValue?: T | null;
  onChange?: (value: T) => void;
  onValueChange?: (value: T) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  size?: DropdownSize;
  variant?: DropdownVariant;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  triggerClassName?: string;
  popupClassName?: string;
  children?: ReactNode;
  hideLabel?: boolean;
  enableRipple?: boolean;
  alignItemWithTrigger?: boolean;
  sideOffset?: number;
}

export interface DropdownMenuItem {
  key?: string;
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  href?: string;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: (DropdownMenuItem | "separator")[];
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
  popupClassName?: string;
  disabled?: boolean;
  enableRipple?: boolean;
}

