import { Check } from "lucide-react";

import { Button } from "./ui/button";
import { Reveal } from "./reveal";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 sm:px-8 py-20 sm:py-28">
      <Reveal className="max-w-2xl mx-auto text-center">
        <span className="text-[13px] font-semibold text-sage-700 tracking-wide uppercase">
          Pricing
        </span>
        <h2 className="font-heading font-semibold text-[2rem] sm:text-[2.4rem] leading-tight tracking-tight text-ink mt-3">
          Simple pricing, no hidden charges
        </h2>
        <p className="text-ink-soft text-[16.5px] leading-relaxed mt-4">
          Start free. Upgrade only when your committee needs more.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-6 mt-14 max-w-3xl mx-auto">
        <Reveal>
          <div className="h-full rounded-3xl border border-sage-200 bg-white p-8">
            <h3 className="font-heading font-semibold text-[19px] text-ink">
              Community
            </h3>
            <p className="text-ink-soft text-[14px] mt-1.5">
              For a single mosque getting started
            </p>
            <p className="mt-6">
              <span className="font-heading font-semibold text-[2.4rem] text-ink">
                ৳0
              </span>
              <span className="text-ink-faint text-[14px]"> / forever</span>
            </p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <a href="#cta">Start Free</a>
            </Button>
            <ul className="mt-7 space-y-3 text-[14px] text-ink-soft">
              {[
                "Up to 200 members",
                "Donation & expense tracking",
                "Monthly report publishing",
                "1 committee admin",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check size={16} className="text-sage-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative h-full rounded-3xl border-2 border-sage-600 bg-white p-8 shadow-card">
            <span className="absolute -top-3.5 left-8 rounded-full bg-sage-600 text-white text-[12px] font-semibold px-3 py-1">
              Most popular
            </span>
            <h3 className="font-heading font-semibold text-[19px] text-ink">
              Committee Pro
            </h3>
            <p className="text-ink-soft text-[14px] mt-1.5">
              For active mosques managing multiple funds
            </p>
            <p className="mt-6">
              <span className="font-heading font-semibold text-[2.4rem] text-ink">
                ৳990
              </span>
              <span className="text-ink-faint text-[14px]"> / month, billed yearly</span>
            </p>
            <Button asChild className="mt-6 w-full">
              <a href="#cta">Start 14-day trial</a>
            </Button>
            <ul className="mt-7 space-y-3 text-[14px] text-ink-soft">
              {[
                "Unlimited members",
                "Multiple funds — Zakat, Qurbani, general",
                "SMS & WhatsApp notices",
                "Exportable PDF reports",
                "Multiple admin roles",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check size={16} className="text-sage-600 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <p className="text-center text-[13.5px] text-ink-faint mt-8">
        Managing more than one mosque?{" "}
        <a href="#" className="text-sage-700 font-semibold hover:underline">
          Talk to us about Federation plans
        </a>
      </p>
    </section>
  );
}
