import { Calculator, HandHeart, ScrollText, UsersRound } from "lucide-react";

export function TrustStrip() {
  return (
    <section className="border-y border-sage-100 bg-sage-50/60">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-ink-soft">
        <p className="text-[13.5px] font-semibold text-ink-soft w-full text-center sm:w-auto sm:text-left">
          Designed with mosque committees for —
        </p>
        <span className="flex items-center gap-2 text-[14px] font-medium">
          <Calculator size={16} className="text-sage-600" /> Treasurers
        </span>
        <span className="flex items-center gap-2 text-[14px] font-medium">
          <ScrollText size={16} className="text-sage-600" /> Secretaries
        </span>
        <span className="flex items-center gap-2 text-[14px] font-medium">
          <UsersRound size={16} className="text-sage-600" /> Sadars &amp; committees
        </span>
        <span className="flex items-center gap-2 text-[14px] font-medium">
          <HandHeart size={16} className="text-sage-600" /> Donors &amp; musullis
        </span>
      </div>
    </section>
  );
}
