import { CalendarClock, FileBarChart2, HandCoins, Users } from "lucide-react";

import { Reveal } from "./reveal";

const features = [
  {
    icon: HandCoins,
    title: "Donations",
    description:
      "Record Jumma box, Zakat, Qurbani and Sadaqah collections — by cash, bKash, Nagad or bank transfer. Every entry is timestamped and attributed the moment it's logged.",
    visual: (
      <div className="mt-6 rounded-2xl bg-sage-50 border border-sage-100 p-3.5">
        <div className="flex items-center justify-between text-[12.5px] font-mono">
          <span className="text-ink-soft">Rahim Uddin · bKash</span>
          <span className="font-semibold tabular text-sage-700">+৳1,500</span>
        </div>
        <div className="flex items-center justify-between text-[12.5px] font-mono mt-2">
          <span className="text-ink-soft">Jumma box · Cash</span>
          <span className="font-semibold tabular text-sage-700">+৳9,240</span>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    title: "Members",
    description:
      "Keep a running register of musullis and donors — names, contact numbers, family info and membership status — searchable in seconds instead of buried in a register book.",
    visual: (
      <div className="mt-6 rounded-2xl bg-sage-50 border border-sage-100 p-3.5 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-sage-200 grid place-items-center text-[11px] font-semibold text-sage-700">
            MK
          </span>
          <span className="text-[12.5px] text-ink-soft">
            Mostafa Kamal — Active member
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-sage-200 grid place-items-center text-[11px] font-semibold text-sage-700">
            SA
          </span>
          <span className="text-[12.5px] text-ink-soft">
            Sultana Akter — Regular donor
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: CalendarClock,
    title: "Events",
    description:
      "Plan Jumma programs, Eid collections, Milad and community iftars, and notify members with one message instead of one phone call at a time.",
    visual: (
      <div className="mt-6 rounded-2xl bg-sage-50 border border-sage-100 p-3.5 flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-white border border-sage-200 grid place-items-center shrink-0">
          <span className="text-[10px] font-semibold text-sage-600 leading-none">
            MAR
          </span>
          <span className="text-[13px] font-bold text-ink leading-none mt-0.5">
            14
          </span>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-ink">
            Community Iftar Mahfil
          </p>
          <p className="text-[12px] text-ink-faint">312 members notified</p>
        </div>
      </div>
    ),
  },
  {
    icon: FileBarChart2,
    title: "Reports",
    description:
      "Generate income-and-expense statements your committee can publish to the community — clear enough for anyone to read, accurate enough to stand up to any question.",
    visual: (
      <div className="mt-6 rounded-2xl bg-sage-50 border border-sage-100 p-3.5">
        <div className="flex items-end gap-2 h-14">
          <div className="w-4 rounded-t bg-sage-300" style={{ height: "40%" }} />
          <div className="w-4 rounded-t bg-sage-300" style={{ height: "65%" }} />
          <div className="w-4 rounded-t bg-sage-500" style={{ height: "50%" }} />
          <div className="w-4 rounded-t bg-sage-300" style={{ height: "85%" }} />
          <div className="w-4 rounded-t bg-sage-600" style={{ height: "100%" }} />
          <div className="w-4 rounded-t bg-sage-300" style={{ height: "70%" }} />
        </div>
        <p className="text-[11.5px] text-ink-faint mt-2">
          Monthly collections · last 6 months
        </p>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
      <Reveal className="max-w-2xl mx-auto text-center">
        <span className="text-[13px] font-semibold text-sage-700 tracking-wide uppercase">
          What it does
        </span>
        <h2 className="font-heading font-semibold text-[2rem] sm:text-[2.4rem] leading-tight tracking-tight text-ink mt-3">
          Everything your committee tracks by hand — in one place
        </h2>
        <p className="text-ink-soft text-[16.5px] leading-relaxed mt-4">
          No accounting background needed. If you can use a mobile banking
          app, you can run MasjidHisab.
        </p>
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-5 mt-14">
        {features.map((feature, i) => (
          <Reveal key={feature.title} delay={i * 50}>
            <div className="h-full rounded-3xl border border-sage-100 bg-white p-7 sm:p-8 hover:shadow-card transition-shadow">
              <span className="grid place-items-center w-11 h-11 rounded-2xl bg-sage-100 text-sage-700">
                <feature.icon size={20} />
              </span>
              <h3 className="font-heading font-semibold text-[19px] text-ink mt-4">
                {feature.title}
              </h3>
              <p className="text-ink-soft text-[14.5px] leading-relaxed mt-2 max-w-sm">
                {feature.description}
              </p>
              {feature.visual}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
