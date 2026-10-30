/**
 * @fileoverview Branches Page Entrypoint
 * @module app/(dashboard)/branches/page
 *
 * Super Admin branch management view (/branches).
 */

import type { Metadata } from "next";
import { BranchesView } from "@/features/branches";

export const metadata: Metadata = {
  title: "All Branches | Brew Desk",
  description: "Super Admin branch configuration, status control, and operations.",
};

export default function BranchesPage() {
  return <BranchesView />;
}
