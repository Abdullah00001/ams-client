import type { ComponentPropsWithRef } from "react";
import clsx from "clsx";
import styles from "./card.module.css";

export type CardProps = ComponentPropsWithRef<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div {...props} className={clsx(styles.card, className)} />;
}
