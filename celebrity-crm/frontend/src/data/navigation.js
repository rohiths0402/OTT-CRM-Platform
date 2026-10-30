import {
  CalendarClock,
  Clapperboard,
  FileSignature,
  LayoutDashboard,
  Megaphone,
  ShieldCheck,
  Wallet,
} from "lucide-react";

export const navItems = [
  { id: "home", label: "Home", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: CalendarClock },
  { id: "projects", label: "Projects", icon: Clapperboard },
  { id: "deals", label: "Brand deals", icon: Megaphone, badge: 1 },
  { id: "contracts", label: "Contracts", icon: FileSignature, badge: 2 },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "security", label: "Security", icon: ShieldCheck },
];