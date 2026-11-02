/**
 * @fileoverview Dashboard Domain Utilities
 * @module features/dashboard/lib/dashboard-utils
 */

/**
 * Formats a monetary amount into a clean currency string with BDT symbol.
 */
export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}

/**
 * Formats a growth percentage with sign prefix.
 */
export function formatGrowthPercentage(value: number): string {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(1)}%`;
}

/**
 * Calculates sum of values in a numeric array.
 */
export function calculateSum(numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
