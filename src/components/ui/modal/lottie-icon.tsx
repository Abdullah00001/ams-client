/**
 * @fileoverview Lottie Icon Player Component
 * @module components/ui/modal/lottie-icon
 *
 * Renders Lottie animation files via lottie-web with fallback animated SVG
 * matching the AMS Figma design (150x150px delete bin, warning, etc.).
 */

"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import styles from "./lottie-icon.module.css";

export type LottieIconVariant = "delete" | "error" | "warning" | "success" | "info";

export type LottieIconProps = {
  /** Optional external Lottie JSON animation URL */
  animationUrl?: string;
  /** Optional Lottie animation JSON object */
  animationData?: Record<string, unknown>;
  /** Built-in modal variant (defaults to "delete") */
  variant?: LottieIconVariant;
  /** Width in pixels (Figma spec: 150) */
  width?: number;
  /** Height in pixels (Figma spec: 150) */
  height?: number;
  /** Whether animation loops (default: true) */
  loop?: boolean;
  /** Whether animation autoplays (default: true) */
  autoplay?: boolean;
};

export function LottieIcon({
  animationUrl,
  animationData,
  variant = "delete",
  width = 150,
  height = 150,
  loop = true,
  autoplay = true,
}: LottieIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animInstance: AnimationItem | null = null;

    if (!containerRef.current) return;

    if (animationUrl || animationData) {
      import("lottie-web").then((lottieModule) => {
        const lottie = lottieModule.default || lottieModule;
        if (!containerRef.current) return;

        try {
          containerRef.current.innerHTML = "";
          animInstance = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop,
            autoplay,
            path: animationUrl,
            animationData,
          });
        } catch {
          // Fall back gracefully
        }
      });
    }

    return () => {
      if (animInstance) {
        animInstance.destroy();
      }
    };
  }, [animationUrl, animationData, loop, autoplay]);

  // If external lottie is loaded into container, render it
  if (animationUrl || animationData) {
    return (
      <div
        ref={containerRef}
        className={styles.lottieContainer}
        style={{ width, height }}
        aria-hidden="true"
      />
    );
  }

  // Built-in Figma Animated Lottie-like SVG icons
  return (
    <div
      className={styles.lottieContainer}
      style={{ width, height }}
      aria-hidden="true"
    >
      {variant === "delete" && (
        <svg
          viewBox="0 0 150 150"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.animatedTrash}
        >
          {/* Animated Lid Group */}
          <g className={styles.trashLid}>
            {/* Lid Handle */}
            <rect
              x="62"
              y="22"
              width="26"
              height="8"
              rx="4"
              fill="var(--ams-color-status-error, #f8285a)"
            />
            {/* Lid Base */}
            <rect
              x="42"
              y="30"
              width="66"
              height="12"
              rx="6"
              fill="var(--ams-color-status-error, #f8285a)"
            />
          </g>

          {/* Bin Body (Trapezoid from Figma) */}
          <path
            d="M 47 46 L 103 46 L 96 112 C 95.5 116 92 119 88 119 L 62 119 C 58 119 54.5 116 54 112 Z"
            fill="#FFE5E8"
          />

          {/* Three Vertical Stripes on Bin Body */}
          <rect
            x="62"
            y="56"
            width="4"
            height="46"
            rx="2"
            fill="var(--ams-color-status-error, #f8285a)"
          />
          <rect
            x="73"
            y="56"
            width="4"
            height="46"
            rx="2"
            fill="var(--ams-color-status-error, #f8285a)"
          />
          <rect
            x="84"
            y="56"
            width="4"
            height="46"
            rx="2"
            fill="var(--ams-color-status-error, #f8285a)"
          />
        </svg>
      )}

      {variant === "error" && (
        <svg
          viewBox="0 0 150 150"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.animatedWarning}
        >
          <circle
            cx="75"
            cy="75"
            r="48"
            fill="rgba(248, 40, 90, 0.14)"
          />
          <path
            d="M 75 38 L 112 102 C 114 105 112 109 108 109 L 42 109 C 38 109 36 105 38 102 Z"
            fill="var(--ams-color-status-error, #f8285a)"
          />
          <line
            x1="75"
            y1="60"
            x2="75"
            y2="86"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="75" cy="98" r="3.5" fill="#ffffff" />
        </svg>
      )}

      {variant === "warning" && (
        <svg
          viewBox="0 0 150 150"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.animatedWarning}
        >
          <circle
            cx="75"
            cy="75"
            r="48"
            fill="rgba(246, 192, 0, 0.16)"
          />
          <path
            d="M 75 38 L 112 102 C 114 105 112 109 108 109 L 42 109 C 38 109 36 105 38 102 Z"
            fill="var(--ams-color-status-warning, #f6c000)"
          />
          <line
            x1="75"
            y1="60"
            x2="75"
            y2="86"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="75" cy="98" r="3.5" fill="#ffffff" />
        </svg>
      )}

      {variant === "success" && (
        <svg
          viewBox="0 0 150 150"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.animatedSuccess}
        >
          <circle
            cx="75"
            cy="75"
            r="48"
            fill="rgba(23, 198, 83, 0.14)"
          />
          <circle
            cx="75"
            cy="75"
            r="38"
            fill="var(--ams-color-status-success, #17c653)"
          />
          <path
            d="M 58 75 L 69 86 L 93 62"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {variant === "info" && (
        <svg
          viewBox="0 0 150 150"
          width={width}
          height={height}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.animatedInfo}
        >
          <circle
            cx="75"
            cy="75"
            r="48"
            fill="var(--ams-color-primary-100, #e8f3ff)"
          />
          <circle
            cx="75"
            cy="75"
            r="38"
            fill="var(--ams-color-primary-300, #1b84ff)"
          />
          <circle cx="75" cy="58" r="4" fill="#ffffff" />
          <line
            x1="75"
            y1="70"
            x2="75"
            y2="92"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}
