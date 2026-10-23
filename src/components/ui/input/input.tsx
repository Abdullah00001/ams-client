import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./input.module.css";

export type InputType = "text" | "email" | "password" | "search" | "number";

export type InputProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  invalid?: boolean;
  hideLabel?: boolean;
  type?: InputType;
};

export function Input({
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  className,
  errorMessage,
  helperText,
  hideLabel = false,
  id,
  invalid = false,
  label,
  type = "text",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? `input-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = invalid && errorMessage ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      {label ? (
        <label className={clsx(styles.label, hideLabel && styles.visuallyHidden)} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={invalid || ariaInvalid}
        className={clsx(styles.input, invalid && styles.invalid, className)}
        id={inputId}
        type={type}
      />
      {helperText ? (
        <p className={styles.helperText} id={helperId}>
          {helperText}
        </p>
      ) : null}
      {errorId ? (
        <p className={styles.errorText} id={errorId}>
          <span className={styles.errorLabel}>Error:</span> {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
