/**
 * @fileoverview Dashboard Group Layout
 * @module app/(dashboard)/layout
 *
 * Wraps all dashboard routes with the responsive DashboardShell layout,
 * which includes the collapsible sidebar and topbar navigation.
 */

import { DashboardShell } from "@/components/layout/dashboard-shell/dashboard-shell";
import { TLayout } from "@/types";

/**
 * Root layout component for the `(dashboard)` route group.
 *
 * @component
 * @param {TLayout} props - Layout props containing nested page children
 * @returns {JSX.Element} Dashboard shell wrapper with page content
 */
export default function DashboardLayout({ children }: TLayout) {
  return <DashboardShell>{children}</DashboardShell>;
}
