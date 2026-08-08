// components/dashboard/dashboard-shell.tsx
"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { AppSidebar } from "./app-sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  mosqueName: string;
  mosqueAddress?: string;
  userName: string;
  userEmail: string;
}

export function DashboardShell({
  children,
  mosqueName,
  mosqueAddress,
  userName,
  userEmail,
}: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-sage-50/40 flex font-body relative">
      {/* Responsive Sidebar (Slide-out on Mobile, Sticky on Desktop) */}
      <AppSidebar
        mosqueName={mosqueName}
        userName={userName}
        userEmail={userEmail}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-sage-200/80 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-ink hover:bg-sage-100/70 md:hidden transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="font-heading text-base font-semibold text-ink truncate max-w-[180px] sm:max-w-none">
                {mosqueName}
              </h2>
              {mosqueAddress && (
                <p className="text-xs text-ink-faint hidden sm:block">
                  Location: {mosqueAddress}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
              <span className="hidden sm:inline">Active Workspace</span>
              <span className="sm:hidden">Active</span>
            </span>
          </div>
        </header>

        {/* Main Route Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8  w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
