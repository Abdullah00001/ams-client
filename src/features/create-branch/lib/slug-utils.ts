/**
 * @fileoverview Slug and Code Generation Utilities
 * @module features/create-branch/lib/slug-utils
 */

/**
 * Generates a URL-friendly slug from a branch name.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates an internal branch code prefix from a branch name.
 */
export function generateBranchCode(name: string): string {
  const code = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 4);

  return code ? `BRN-${code}-01` : "";
}
