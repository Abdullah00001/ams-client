import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BedDouble,
  Bell,
  BookOpen,
  Building2,
  CalendarCheck2,
  CircleDollarSign,
  ClipboardList,
  ContactRound,
  DatabaseBackup,
  FileBadge2,
  FileText,
  Funnel,
  HandCoins,
  History,
  KeyRound,
  LayoutDashboard,
  Layers3,
  ListChecks,
  ReceiptText,
  Settings,
  ShieldCheck,
  Utensils,
  UserPlus,
  UserRoundCheck,
  Users,
  UsersRound,
  WalletCards,
} from "lucide-react";

type SidebarNavigationItemBase = {
  icon: LucideIcon;
  label: string;
};

export type ImplementedNavigationItem = SidebarNavigationItemBase & {
  href: "/" | "/dashboard";
  kind: "implemented";
};

export type UnimplementedNavigationItem = SidebarNavigationItemBase & {
  kind: "unimplemented";
};

export type SidebarNavigationItem = ImplementedNavigationItem | UnimplementedNavigationItem;

export type SidebarNavigationGroupId =
  | "platform"
  | "branch-management"
  | "students"
  | "academic"
  | "finance"
  | "crm"
  | "certificates"
  | "hostel"
  | "staff-payroll"
  | "reports"
  | "settings";

type SidebarNavigationGroupBase = {
  icon: LucideIcon;
  id: SidebarNavigationGroupId;
  items: SidebarNavigationItem[];
  label: string;
};

export type StaticNavigationGroup = SidebarNavigationGroupBase & {
  collapsible: false;
};

export type CollapsibleNavigationGroup = SidebarNavigationGroupBase & {
  collapsible: true;
};

export type SidebarNavigationGroup = StaticNavigationGroup | CollapsibleNavigationGroup;

// The functional specification owns this inventory. A route is deliberately absent until its page exists.
export const navigationItems: SidebarNavigationGroup[] = [
  {
    collapsible: false,
    icon: LayoutDashboard,
    id: "platform",
    items: [{ href: "/", icon: LayoutDashboard, kind: "implemented", label: "Dashboard" }],
    label: "Platform",
  },
  {
    collapsible: true,
    icon: Building2,
    id: "branch-management",
    items: [
      { icon: Building2, kind: "unimplemented", label: "All Branches" },
      { icon: ShieldCheck, kind: "unimplemented", label: "Permissions" },
      { icon: KeyRound, kind: "unimplemented", label: "Roles & Access" },
    ],
    label: "Branch Management",
  },
  {
    collapsible: true,
    icon: Users,
    id: "students",
    items: [
      { icon: Users, kind: "unimplemented", label: "All Students" },
      { icon: UserPlus, kind: "unimplemented", label: "Add Student" },
    ],
    label: "Students",
  },
  {
    collapsible: true,
    icon: BookOpen,
    id: "academic",
    items: [
      { icon: BookOpen, kind: "unimplemented", label: "Courses" },
      { icon: Layers3, kind: "unimplemented", label: "Batches/Shift" },
      { icon: CalendarCheck2, kind: "unimplemented", label: "Attendance" },
      { icon: UserRoundCheck, kind: "unimplemented", label: "Assign Trainer" },
    ],
    label: "Academic",
  },
  {
    collapsible: true,
    icon: WalletCards,
    id: "finance",
    items: [
      { icon: WalletCards, kind: "unimplemented", label: "Payments & Revenue" },
      { icon: CircleDollarSign, kind: "unimplemented", label: "Outstanding Dues" },
      { icon: ReceiptText, kind: "unimplemented", label: "Expense Management" },
      { icon: ListChecks, kind: "unimplemented", label: "Fee Structure" },
    ],
    label: "Finance",
  },
  {
    collapsible: true,
    icon: ContactRound,
    id: "crm",
    items: [
      { icon: ContactRound, kind: "unimplemented", label: "All Leads" },
      { icon: Funnel, kind: "unimplemented", label: "Lead Pipeline" },
    ],
    label: "CRM",
  },
  {
    collapsible: true,
    icon: FileBadge2,
    id: "certificates",
    items: [
      { icon: FileBadge2, kind: "unimplemented", label: "Issue Certificate" },
      { icon: BadgeCheck, kind: "unimplemented", label: "Eligible Students" },
      { icon: ClipboardList, kind: "unimplemented", label: "All Certificates" },
      { icon: FileText, kind: "unimplemented", label: "Templates" },
      { icon: History, kind: "unimplemented", label: "Verification Log" },
    ],
    label: "Certificates",
  },
  {
    collapsible: true,
    icon: BedDouble,
    id: "hostel",
    items: [
      { icon: Building2, kind: "unimplemented", label: "Room Management" },
      { icon: BedDouble, kind: "unimplemented", label: "Bed Assignment" },
      { icon: Utensils, kind: "unimplemented", label: "Meal Counting" },
      { icon: HandCoins, kind: "unimplemented", label: "Hostel Fee" },
      { icon: ReceiptText, kind: "unimplemented", label: "Hostel Expenses" },
    ],
    label: "Hostel",
  },
  {
    collapsible: true,
    icon: UsersRound,
    id: "staff-payroll",
    items: [
      { icon: UsersRound, kind: "unimplemented", label: "All Staff" },
      { icon: UserPlus, kind: "unimplemented", label: "Add Staff" },
      { icon: CalendarCheck2, kind: "unimplemented", label: "Staff Attendance" },
      { icon: WalletCards, kind: "unimplemented", label: "Payroll" },
    ],
    label: "Staff & Payroll",
  },
  {
    collapsible: true,
    icon: ClipboardList,
    id: "reports",
    items: [
      { icon: ClipboardList, kind: "unimplemented", label: "Enrollment" },
      { icon: CircleDollarSign, kind: "unimplemented", label: "Revenue" },
      { icon: CalendarCheck2, kind: "unimplemented", label: "Attendance" },
      { icon: ContactRound, kind: "unimplemented", label: "Leads" },
      { icon: FileBadge2, kind: "unimplemented", label: "Certificates" },
      { icon: ReceiptText, kind: "unimplemented", label: "Expenses" },
      { icon: Building2, kind: "unimplemented", label: "Hostel" },
      { icon: WalletCards, kind: "unimplemented", label: "Payrolls" },
    ],
    label: "Reports",
  },
  {
    collapsible: true,
    icon: Settings,
    id: "settings",
    items: [
      { icon: Settings, kind: "unimplemented", label: "General" },
      { icon: UsersRound, kind: "unimplemented", label: "Admin Accounts" },
      { icon: Bell, kind: "unimplemented", label: "Notifications" },
      { icon: BadgeCheck, kind: "unimplemented", label: "Certificate Settings" },
      { icon: DatabaseBackup, kind: "unimplemented", label: "Backup & Data" },
    ],
    label: "Settings",
  },
];
