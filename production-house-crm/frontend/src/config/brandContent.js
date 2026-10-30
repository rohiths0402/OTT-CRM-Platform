import { CalendarDays, Film, FolderKanban, Tv, Users } from "lucide-react";

export const LOGIN_PANEL = {
  heading: "Where Stories Become Cinema.",
  description:
    "One powerful platform to manage productions, OTT projects, creative teams and cinematic experiences.",
  features: [
    { icon: Tv, label: "OTT Project Management" },
    { icon: CalendarDays, label: "Production Planning" },
    { icon: Users, label: "Creative Team Coordination" },
  ],
  tagline: "Powering the future of film production",
};

export const SIGNUP_PANEL = {
  heading: "Create Your Production Legacy.",
  description:
    "Bring your production house, projects, teams and creative vision together in one powerful workspace.",
  features: [
    { icon: Film, label: "Manage Your Productions" },
    { icon: FolderKanban, label: "Organize Your Projects" },
    { icon: Users, label: "Empower Your Creative Team" },
  ],
  tagline: "Your stories. Your studio. Your legacy.",
};
