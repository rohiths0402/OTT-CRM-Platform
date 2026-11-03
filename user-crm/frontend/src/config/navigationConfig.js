
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Wallet,
  Gift,
  Activity,
  Clapperboard,
  Megaphone,
  Bell,
  UsersRound,
  ClipboardList,
  Settings,
} from 'lucide-react'

export const navigationConfig = {
  admin: [
    { label: 'Command Center', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Subscribers', path: '/admin/subscribers', icon: Users },
    { label: 'Identity Vault', path: '/admin/identity-vault', icon: ShieldCheck },
    { label: 'Wallet Control', path: '/admin/wallet', icon: Wallet },
    { label: 'Rewards Studio', path: '/admin/rewards', icon: Gift },
    { label: 'Engagement Intelligence', path: '/admin/engagement', icon: Activity },
    { label: 'Viewing Insights', path: '/admin/viewing-insights', icon: Clapperboard },
    { label: 'Broadcast', path: '/admin/broadcast', icon: Bell },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: UsersRound },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList },
    { label: 'Preferences', path: '/admin/preferences', icon: Settings },
  ],

  super_admin: [
    { label: 'Command Center', path: '/super-admin', icon: LayoutDashboard, end: true },
    { label: 'Subscribers', path: '/super-admin/subscribers', icon: Users },
    { label: 'Identity Vault', path: '/super-admin/identity-vault', icon: ShieldCheck },
    { label: 'Wallet Control', path: '/super-admin/wallet', icon: Wallet },
    { label: 'Rewards Studio', path: '/super-admin/rewards', icon: Gift },
    { label: 'Engagement Intelligence', path: '/super-admin/engagement', icon: Activity },
    { label: 'Viewing Insights', path: '/super-admin/viewing-insights', icon: Clapperboard },
    { label: 'Broadcast', path: '/super-admin/broadcast', icon: Bell },
    { label: 'Roles & Permissions', path: '/super-admin/roles', icon: UsersRound },
    { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: ClipboardList },
    { label: 'Preferences', path: '/super-admin/preferences', icon: Settings },
  ],
}
