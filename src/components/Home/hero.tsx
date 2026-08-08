import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Landmark,
  Languages,
  Play,
  ShieldCheck,
  Smartphone,
  TrendingUp,
} from "lucide-react";

import { Button } from "./ui/button";
import { GeometricPattern, StarSeal } from "./geometric-pattern";
import { Reveal } from "./reveal";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <GeometricPattern />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-14 sm:pt-20 pb-20 sm:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
        {/* Copy */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-sage-100 text-sage-700 text-[13px] font-semibold px-3.5 py-1.5">
            <Landmark size={14} />
            Built for mosque committees in Bangladesh
          </span>

          <h1 className="font-heading font-semibold text-[2.5rem] leading-[1.08] sm:text-[3.15rem] sm:leading-[1.06] tracking-tight text-ink mt-6">
            Every taka accounted for.
            <br className="hidden sm:block" />
            Every musulli informed.
          </h1>

          <p className="text-[17px] sm:text-[18.5px] leading-relaxed text-ink-soft mt-6 max-w-[34rem]">
            MasjidHisab replaces the collection register and the year-end
            guesswork with one clear ledger — so your committee can track
            donations, manage members and events, and publish honest
            financial reports the whole community can see.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-9">
            <Button asChild size="lg">
              <a href="#cta">
                Start Free
                <ArrowRight size={17} />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how">
                <span className="grid place-items-center w-6 h-6 rounded-full bg-sage-100 text-sage-700">
                  <Play size={11} />
                </span>
                See how it works
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 text-[13.5px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-sage-600" /> Bank-level
              security
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone size={16} className="text-sage-600" /> Works on any
              phone
            </span>
            <span className="flex items-center gap-1.5">
              <Languages size={16} className="text-sage-600" /> বাংলা &amp;
              English
            </span>
          </div>
        </Reveal>

        {/* Visual: dashboard card + donation passbook (signature element) */}
        <Reveal delay={120}>
          <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
            {/* Dashboard mockup */}
            <div className="absolute left-0 top-4 w-[86%] sm:w-[82%] rounded-2xl bg-white border border-sage-100 shadow-card overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-sage-100 bg-sage-50/60">
                <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
                <span className="w-2.5 h-2.5 rounded-full bg-sage-200" />
                <span className="ml-3 text-[12px] font-medium text-ink-faint">
                  Baitul Amaan Jame Masjid · Dashboard
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[12px] text-ink-faint font-medium">
                      Collected this month
                    </p>
                    <p className="font-mono font-semibold text-[26px] text-ink tabular mt-0.5">
                      ৳3,84,600
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 text-sage-700 text-[12px] font-semibold px-2.5 py-1">
                    <TrendingUp size={12} /> 18% vs last month
                  </span>
                </div>

                <svg viewBox="0 0 300 90" className="w-full h-[78px]">
                  <polyline
                    points="0,70 30,60 60,64 90,45 120,50 150,32 180,38 210,20 240,26 270,10 300,16"
                    fill="none"
                    stroke="#4F7A5C"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polygon
                    points="0,70 30,60 60,64 90,45 120,50 150,32 180,38 210,20 240,26 270,10 300,16 300,90 0,90"
                    fill="#6B9080"
                    opacity="0.12"
                  />
                  <circle cx="300" cy="16" r="4" fill="#4F7A5C" />
                </svg>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-sage-100">
                  <div>
                    <p className="text-[11px] text-ink-faint font-medium">Members</p>
                    <p className="font-mono font-semibold text-[15px] mt-0.5">1,248</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint font-medium">Active funds</p>
                    <p className="font-mono font-semibold text-[15px] mt-0.5">6</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-faint font-medium">This week</p>
                    <p className="font-mono font-semibold text-[15px] mt-0.5">৳61,200</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation passbook — the signature element: a physical mosque
                collection passbook reimagined as software, perforated stub,
                mono-spaced figures, and a treasurer's seal */}
            <div className="absolute right-0 bottom-0 w-[72%] sm:w-[64%] rounded-2xl bg-white border border-sage-100 shadow-soft overflow-hidden">
              <div className="flex items-stretch">
                <div className="w-4 stub-edge bg-sage-50 border-r border-dashed border-sage-200 shrink-0" />
                <div className="p-4 flex-1">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="font-heading font-semibold text-[13px] text-ink">
                      Ledger · Ashwin
                    </p>
                    <span className="grid place-items-center w-8 h-8 rounded-full border-2 border-gold-400 text-gold-500 shrink-0">
                      <BadgeCheck size={15} />
                    </span>
                  </div>
                  <ul className="space-y-2 font-mono text-[12.5px]">
                    <li className="flex items-center justify-between">
                      <span className="text-ink-soft">Jumma collection</span>
                      <span className="tabular font-semibold text-ink">৳48,500</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-ink-soft">Qurbani fund</span>
                      <span className="tabular font-semibold text-ink">৳1,12,000</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-ink-soft">Iftar committee</span>
                      <span className="tabular font-semibold text-ink">৳36,200</span>
                    </li>
                  </ul>
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-dashed border-sage-200">
                    <span className="text-[11px] text-sage-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Verified by treasurer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating geometric seal */}
            <div className="hidden sm:grid absolute -right-2 top-0 w-16 h-16 place-items-center rounded-full bg-white border border-sage-100 shadow-soft">
              <StarSeal />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
