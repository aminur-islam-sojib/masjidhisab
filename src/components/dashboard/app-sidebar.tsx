"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonStar, ChevronRight, LogOut, Building2, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { navigationItems } from "@/lib/dashboard-navigation";
import { AppSidebarProps } from "@/types/dashboard";

export function AppSidebar({
  mosqueName = "My Mosque",
  userName,
  userEmail,
  isOpen,
  onClose,
}: AppSidebarProps) {
  const pathname = usePathname();

  // Automatically close sidebar when navigation completes on mobile
  React.useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      {/* Mobile Backdrop / Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 border-r border-sage-200 bg-white flex flex-col justify-between h-screen transform transition-transform duration-200 ease-in-out font-body ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Top Branding & Close Button */}
        <div>
          <div className="h-16 px-5 border-b border-sage-100 flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <span className="grid place-items-center w-8 h-8 rounded-xl bg-sage-600 text-white shadow-sm">
                <MoonStar size={18} />
              </span>
              <span className="font-heading font-semibold text-lg tracking-tight text-ink">
                MasjidHisab
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-sage-100 md:hidden transition-colors"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Mosque Card */}
          <div className="p-3 mx-3 my-3 rounded-xl bg-sage-50 border border-sage-200/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sage-200/60 flex items-center justify-center text-sage-700 shrink-0">
              <Building2 size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-ink truncate">
                {mosqueName}
              </p>
              <p className="text-[11px] text-ink-faint">Verified Workspace</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-sage-600 text-white shadow-sm"
                      : "text-ink-soft hover:text-ink hover:bg-sage-100/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-ink-faint"}
                    />
                    <span>{item.title}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={14} className="text-white/80" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-sage-100 bg-white">
          <div className="flex items-center justify-between p-2 rounded-xl">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-sage-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-ink truncate">
                  {userName || "Admin User"}
                </p>
                <p className="text-[11px] text-ink-faint truncate">
                  {userEmail}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Log out"
              className="p-1.5 rounded-lg text-ink-faint hover:text-destructive hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
