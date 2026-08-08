import { MoonStar, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-sage-100">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14 grid sm:grid-cols-[1.3fr_1fr_1fr_1fr] gap-10">
        <div>
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-sage-600 text-white">
              <MoonStar size={16} />
            </span>
            <span className="font-heading font-semibold text-[16px] text-ink">
              MasjidHisab
            </span>
          </a>
          <p className="text-[13.5px] text-ink-faint mt-4 max-w-xs leading-relaxed">
            Donation tracking and mosque management for committees across
            Bangladesh — built for clarity, not complexity.
          </p>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-ink mb-3.5">Product</p>
          <ul className="space-y-2.5 text-[13.5px] text-ink-faint">
            <li><a href="#features" className="hover:text-sage-700">Features</a></li>
            <li><a href="#how" className="hover:text-sage-700">How it works</a></li>
            <li><a href="#pricing" className="hover:text-sage-700">Pricing</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-ink mb-3.5">Support</p>
          <ul className="space-y-2.5 text-[13.5px] text-ink-faint">
            <li><a href="#" className="hover:text-sage-700">Help center</a></li>
            <li><a href="#" className="hover:text-sage-700">Contact us</a></li>
            <li><a href="#" className="hover:text-sage-700">WhatsApp support</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-ink mb-3.5">Company</p>
          <ul className="space-y-2.5 text-[13.5px] text-ink-faint">
            <li><a href="#" className="hover:text-sage-700">About</a></li>
            <li><a href="#" className="hover:text-sage-700">Privacy</a></li>
            <li><a href="#" className="hover:text-sage-700">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sage-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-ink-faint">
          <p>© {new Date().getFullYear()} MasjidHisab. Made for mosque committees in Bangladesh.</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck size={13} /> Your data is encrypted and never sold
          </p>
        </div>
      </div>
    </footer>
  );
}
