/**
 * @fileoverview Add Student Page Entrypoint
 * @module app/(dashboard)/students/create/page
 *
 * Student Registration view (/students/create).
 */

import type { Metadata } from "next";
import { CreateStudentView } from "@/features/create-student";

export const metadata: Metadata = {
  title: "Add Student | Brew Desk",
  description: "Register a new student, upload credentials, assign course and batch, and set payment plan.",
};

export default function CreateStudentPage() {
  return <CreateStudentView />;
}

