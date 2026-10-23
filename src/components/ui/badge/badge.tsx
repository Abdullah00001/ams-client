import type { ComponentPropsWithRef } from "react";
import clsx from "clsx";
import styles from "./badge.module.css";

export type BadgeTone = "neutral" | "success" | "warning" | "error" | "info";

export type BadgeProps = ComponentPropsWithRef<"span"> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return <span {...props} className={clsx(styles.badge, styles[tone], className)} />;
}
