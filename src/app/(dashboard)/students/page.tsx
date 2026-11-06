/**
 * @fileoverview Students Page Entrypoint
 * @module app/(dashboard)/students/page
 *
 * Student Management view (/students).
 */

import type { Metadata } from "next";
import { StudentsView } from "@/features/students";

export const metadata: Metadata = {
  title: "All Students | Brew Desk",
  description: "Student management, enrollments, fee payment status, and certification records.",
};

export default function StudentsPage() {
  return <StudentsView />;
}
