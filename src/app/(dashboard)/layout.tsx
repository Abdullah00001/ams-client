import { DashboardShell } from "@/components/layout/dashboard-shell/dashboard-shell";
import { TLayout } from "@/types";

export default function DashboardLayout({ children }: TLayout) {
  return <DashboardShell>{children}</DashboardShell>;
}
