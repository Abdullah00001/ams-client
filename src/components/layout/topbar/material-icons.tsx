import type { ComponentPropsWithoutRef } from "react";

type MaterialIconProps = ComponentPropsWithoutRef<"svg">;

export function MaterialKeyboardArrowDownIcon(props: MaterialIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}
