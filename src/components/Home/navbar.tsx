import { MoonStar, LogOut, LayoutDashboard, User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { auth, signOut } from "@/lib/auth/auth";

export async function Navbar() {
  // Fetch session directly on the server
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-sage-100 bg-background/85 backdrop-blur font-body">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-sage-600"
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-sage-600 text-white">
            <MoonStar size={18} />
          </span>
          <span className="font-heading font-semibold text-[18px] tracking-tight text-ink">
            MasjidHisab
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-medium text-ink-soft">
          <a href="#features" className="hover:text-sage-700 transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-sage-700 transition-colors">
            How it works
          </a>
          <a href="#pricing" className="hover:text-sage-700 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-sage-700 transition-colors">
            FAQ
          </a>
          <a href="/explore" className="hover:text-sage-700 transition-colors">
            Explore
          </a>
        </nav>

        {/* Dynamic Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            /* ================= LOGGED IN STATE ================= */
            <div className="flex items-center gap-3">
              {/* Dashboard Link */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-ink-soft hover:text-ink"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </Button>

              {/* User Avatar & Name Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sage-200/60 bg-sage-50/50 text-ink">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-600 text-xs font-semibold text-white">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <span className="text-xs font-medium max-w-30 truncate hidden sm:inline-block">
                  {user.name || user.email}
                </span>
              </div>

              {/* Server Action Logout Button */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 border-sage-200 text-ink-soft hover:text-red-600 hover:border-red-200 hover:bg-red-50/50"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Log out</span>
                </Button>
              </form>
            </div>
          ) : (
            /* ================= LOGGED OUT STATE ================= */
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-[14.5px] font-medium text-ink-soft hover:text-ink transition-colors px-2"
              >
                Sign in
              </Link>
              <Button asChild size="sm" className="px-5 py-2.5">
                <Link href="/register">Start Free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
