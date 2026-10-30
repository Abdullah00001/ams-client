"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { MouseEvent } from "react";
import { createTouchRipple } from "@/lib/touch-ripple";
import styles from "./not-found.module.css";

export function NotFound() {
  const handleRipple = (e: MouseEvent<HTMLAnchorElement>) => {
    createTouchRipple(e, "light");
  };

  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.illustrationWrapper}>
          <Image
            src="/404_blue.svg"
            alt="Oops! 404 Error illustration"
            width={420}
            height={420}
            priority
            unoptimized
            className={styles.illustration}
          />
        </div>

        <h1 className={styles.heading}>
          Oops... Looks like this shot was under-extracted.
        </h1>

        <p className={styles.subtitle}>
          The page you’re looking for might have been purged,
          <br />
          misdialed, or swallowed by the knockbox.
        </p>

        <Link
          href="/"
          className={styles.homeButton}
          onMouseDown={handleRipple}
        >
          <ArrowLeft className={styles.buttonIcon} />
          <span>Back to home</span>
        </Link>
      </div>
    </main>
  );
}
