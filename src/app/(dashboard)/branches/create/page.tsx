/**
 * @fileoverview Create Branch Route Entrypoint (/branches/create)
 * @module app/(dashboard)/branches/create/page
 */

import type { Metadata } from "next";
import { CreateBranchView } from "@/features/branches";

export const metadata: Metadata = {
  title: "Create Branch | Brew Desk",
  description: "Configure and register a new academy branch campus.",
};

export default function CreateBranchPage() {
  return <CreateBranchView />;
}
