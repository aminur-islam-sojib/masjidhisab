// lib/dashboard-navigation.ts
import {
  Bell,
  Clock,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  UserPlus,
} from "lucide-react";

export const navigationItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Finance & Accounts", href: "/dashboard/finance", icon: Wallet },
  { title: "Prayer Schedule", href: "/dashboard/prayers", icon: Clock },
  { title: "Committee & Members", href: "/dashboard/members", icon: Users },
  { title: "Join Requests", href: "/dashboard/requests", icon: UserPlus },
  { title: "Notices & Events", href: "/dashboard/notices", icon: Bell },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];