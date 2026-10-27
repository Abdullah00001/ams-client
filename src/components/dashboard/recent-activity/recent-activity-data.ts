export interface ActivityPart {
  text: string;
  bold?: boolean;
}

export interface ActivityItem {
  id: string;
  tag: "GBTA" | "DSCA" | "ADMIN";
  description: string;
  parts: ActivityPart[];
  timestamp: string;
  targetUrl: string;
}

export const RECENT_ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: "act-1",
    tag: "GBTA",
    description: "Rahim enrolled in Barista Foundation Batch 5",
    parts: [
      { text: "Rahim", bold: true },
      { text: " enrolled in " },
      { text: "Barista Foundation Batch 5", bold: true },
    ],
    timestamp: "2 mins ago",
    targetUrl: "/admin/students/stu-101",
  },
  {
    id: "act-2",
    tag: "DSCA",
    description: "Certificate issued to Sumaiya — DSCA-2026-00043",
    parts: [
      { text: "Certificate issued to " },
      { text: "Sumaiya", bold: true },
      { text: " — " },
      { text: "DSCA-2026-00043", bold: true },
    ],
    timestamp: "1 hr ago",
    targetUrl: "/admin/certificates/DSCA-2026-00043",
  },
  {
    id: "act-3",
    tag: "ADMIN",
    description: "Finance Admin marked 5 students as having pending fees for March",
    parts: [
      { text: "Finance Admin", bold: true },
      { text: " marked " },
      { text: "5 students", bold: true },
      { text: " as having pending fees for March" },
    ],
    timestamp: "2 hrs ago",
    targetUrl: "/admin/finance",
  },
  {
    id: "act-4",
    tag: "ADMIN",
    description: "New Staff Joined: Chef Thompson - Bakery Instructor by Admin",
    parts: [
      { text: "New Staff Joined: " },
      { text: "Chef Thompson", bold: true },
      { text: " - Bakery Instructor by " },
      { text: "Admin", bold: true },
    ],
    timestamp: "3 hrs ago",
    targetUrl: "/admin/academic/trainers",
  },
  {
    id: "act-5",
    tag: "GBTA",
    description: "Tanvir Hasan submitted the practical assessment in Latte Art",
    parts: [
      { text: "Tanvir Hasan", bold: true },
      { text: " submitted practical assessment in " },
      { text: "Latte Art", bold: true },
    ],
    timestamp: "4 hrs ago",
    targetUrl: "/admin/academic/exams",
  },
  {
    id: "act-6",
    tag: "DSCA",
    description: "New admission confirmed for European Bakery Diploma",
    parts: [
      { text: "New admission confirmed for " },
      { text: "European Bakery Diploma", bold: true },
    ],
    timestamp: "5 hrs ago",
    targetUrl: "/admin/students/stu-104",
  },
  {
    id: "act-7",
    tag: "ADMIN",
    description: "New branch created: Chittagong Branch",
    parts: [
      { text: "New branch created: " },
      { text: "Chittagong Branch", bold: true },
    ],
    timestamp: "Yesterday",
    targetUrl: "/admin/branches/chittagong",
  },
  {
    id: "act-8",
    tag: "GBTA",
    description: "Arman verified certificate — GBTA-2026-00098",
    parts: [
      { text: "Arman", bold: true },
      { text: " verified certificate — " },
      { text: "GBTA-2026-00098", bold: true },
    ],
    timestamp: "Yesterday",
    targetUrl: "/admin/certificates/GBTA-2026-00098",
  },
  {
    id: "act-9",
    tag: "DSCA",
    description: "Batch schedule updated: Pastry Chef Shift B",
    parts: [
      { text: "Batch schedule updated: " },
      { text: "Pastry Chef Shift B", bold: true },
    ],
    timestamp: "Yesterday",
    targetUrl: "/admin/academic/batches/shift-b",
  },
  {
    id: "act-10",
    tag: "GBTA",
    description: "Coffee Sensory Workshop registration completed (24/24 filled)",
    parts: [
      { text: "Coffee Sensory Workshop", bold: true },
      { text: " registration completed (" },
      { text: "24/24 filled", bold: true },
      { text: ")" },
    ],
    timestamp: "Yesterday",
    targetUrl: "/admin/academic/courses/coffee-sensory",
  },
  {
    id: "act-11",
    tag: "ADMIN",
    description: "Fee structure updated for 2027 Professional Programs",
    parts: [
      { text: "Fee structure updated for " },
      { text: "2027 Professional Programs", bold: true },
    ],
    timestamp: "2 days ago",
    targetUrl: "/admin/finance/fees",
  },
  {
    id: "act-12",
    tag: "DSCA",
    description: "Graduation status approved for Nabila - Batch 3",
    parts: [
      { text: "Graduation status approved for " },
      { text: "Nabila", bold: true },
      { text: " - Batch 3" },
    ],
    timestamp: "2 days ago",
    targetUrl: "/admin/students/stu-108",
  },
  {
    id: "act-13",
    tag: "GBTA",
    description: "Equipment calibration completed for La Marzocco Machine #4",
    parts: [
      { text: "Equipment calibration completed for " },
      { text: "La Marzocco Machine #4", bold: true },
    ],
    timestamp: "2 days ago",
    targetUrl: "/admin/branches/gbta",
  },
  {
    id: "act-14",
    tag: "DSCA",
    description: "Examination results published for Barista Level 2",
    parts: [
      { text: "Examination results published for " },
      { text: "Barista Level 2", bold: true },
    ],
    timestamp: "3 days ago",
    targetUrl: "/admin/academic/exams/barista-l2",
  },
  {
    id: "act-15",
    tag: "ADMIN",
    description: "System security audit and revenue reconciliation passed",
    parts: [
      { text: "System security audit and " },
      { text: "revenue reconciliation passed", bold: true },
    ],
    timestamp: "3 days ago",
    targetUrl: "/admin/finance/audit",
  },
];
