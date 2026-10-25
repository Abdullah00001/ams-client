import type { MouseEvent } from "react";
import styles from "./sidebar.module.css";

/**
 * Material UI (MUI) TouchRipple standard implementation:
 * - Calculates ripple origin from pointer coordinates.
 * - Scales from origin to cover diagonal with cubic-bezier(0.4, 0, 0.2, 1).
 * - Gracefully centers ripple on keyboard activation.
 */
export function createRipple(event: MouseEvent<HTMLElement>, isCurrentPage = false) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();

  const isKeyboard = event.clientX === 0 && event.clientY === 0;
  const x = isKeyboard ? rect.width / 2 : event.clientX - rect.left;
  const y = isKeyboard ? rect.height / 2 : event.clientY - rect.top;

  // MUI standard: diagonal * 2 to cover element completely
  const diameter = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2;

  const ripple = document.createElement("span");
  ripple.className = isCurrentPage ? styles.activeRipple : styles.ripple;
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${Math.round(x - diameter / 2)}px`;
  ripple.style.top = `${Math.round(y - diameter / 2)}px`;

  container.appendChild(ripple);

  window.setTimeout(() => {
    ripple.remove();
  }, 1300);
}
