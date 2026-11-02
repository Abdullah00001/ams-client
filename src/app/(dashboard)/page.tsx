/**
 * @fileoverview Main Academy Dashboard Page
 * @module app/(dashboard)/page
 *
 * Primary landing view of the Academy Management System (AMS).
 * Renders the composed DashboardView feature coordinator.
 */

import type { Metadata } from "next";
import { DashboardView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Brew Desk",
  description: "Academy Management System central overview and performance metrics.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
