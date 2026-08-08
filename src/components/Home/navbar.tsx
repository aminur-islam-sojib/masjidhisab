import { MoonStar } from "lucide-react";

import { Button } from "./ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-sage-100 bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-sage-600"
        >
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-sage-600 text-white">
            <MoonStar size={18} />
          </span>
          <span className="font-heading font-semibold text-[18px] tracking-tight text-ink">
            MasjidHisab
          </span>
        </a>

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
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden sm:inline-block text-[14.5px] font-medium text-ink-soft hover:text-ink transition-colors px-2"
          >
            Sign in
          </a>
          <Button asChild size="sm" className="px-5 py-2.5">
            <a href="#cta">Start Free</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
