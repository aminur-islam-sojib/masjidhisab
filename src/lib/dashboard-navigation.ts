// lib/dashboard-navigation.ts
import { Bell, Clock, LayoutDashboard, Settings, Users, Wallet, UserPlus, UserCircle } from "lucide-react";
import { UserRole } from "@/types/auth";

export const navigationItems = [
  { title: "Overview", href: "/dashboard", icon: "LayoutDashboard", roles: [UserRole.MOSQUE_ADMIN, UserRole.STAFF, UserRole.MEMBER] },
  { title: "Finance & Accounts", href: "/dashboard/finance", icon: "Wallet", roles: [UserRole.MOSQUE_ADMIN, UserRole.STAFF] },
  { title: "Prayer Schedule", href: "/dashboard/prayers", icon: "Clock", roles: [UserRole.MOSQUE_ADMIN, UserRole.STAFF, UserRole.MEMBER] },
  { title: "Committee", href: "/dashboard/committee", icon: "Users", roles: [UserRole.MOSQUE_ADMIN] },
  { title: "Members", href: "/dashboard/members", icon: "Users", roles: [UserRole.MOSQUE_ADMIN, UserRole.STAFF] },
  { title: "Join Requests", href: "/dashboard/requests", icon: "UserPlus", roles: [UserRole.MOSQUE_ADMIN] },
  { title: "Notices & Events", href: "/dashboard/notices", icon: "Bell", roles: [UserRole.MOSQUE_ADMIN, UserRole.STAFF, UserRole.MEMBER] },
  { title: "My Profile", href: "/dashboard/profile", icon: "UserCircle", roles: [UserRole.MEMBER] },
  { title: "Settings", href: "/dashboard/settings", icon: "Settings", roles: [UserRole.MOSQUE_ADMIN] },
] as const;

export function getNavItemsForRole(role: UserRole) {
  return navigationItems.filter((item) => item.roles.includes(role));
}