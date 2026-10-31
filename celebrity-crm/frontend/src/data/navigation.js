import {
  CalendarClock,
  Clapperboard,
  CircleUserRound,
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
  { id: "contracts", label: "Contracts", icon: FileSignature, badge: 1 },
  { id: "payments", label: "Payments", icon: Wallet, badge: 1 },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "profile", label: "My profile", icon: CircleUserRound },
];
