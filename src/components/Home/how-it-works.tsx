import { Landmark, NotebookPen, Send } from "lucide-react";

import { GeometricPattern } from "./geometric-pattern";
import { Reveal } from "./reveal";

const steps = [
  {
    icon: Landmark,
    title: "Set up your masjid profile",
    description:
      "Add your mosque's name, committee roles, and mobile banking or bank account details.",
  },
  {
    icon: NotebookPen,
    title: "Record collections as they happen",
    description:
      "Log donations from the Friday box, envelope collections, or online transfers in seconds.",
  },
  {
    icon: Send,
    title: "Share transparent reports",
    description:
      'Publish monthly statements the whole community can see — no more "where did the money go".',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="relative py-20 sm:py-28 bg-sage-50/50 border-y border-sage-100"
    >
      <GeometricPattern mask={false} />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl mx-auto text-center">
          <span className="text-[13px] font-semibold text-sage-700 tracking-wide uppercase">
            Getting started
          </span>
          <h2 className="font-heading font-semibold text-[2rem] sm:text-[2.4rem] leading-tight tracking-tight text-ink mt-3">
            From first login to your first published report
          </h2>
        </Reveal>

        <div className="relative grid sm:grid-cols-3 gap-8 sm:gap-6 mt-16">
          <div
            className="hidden sm:block absolute top-8 left-[16.6%] right-[16.6%] h-px"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg,#8FAE9C 0 8px,transparent 8px 16px)",
            }}
          />

          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80} className="relative text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white border border-sage-200 shadow-card grid place-items-center relative z-10">
                <step.icon size={26} className="text-sage-600" />
              </div>
              <h3 className="font-heading font-semibold text-[16.5px] text-ink mt-5">
                {step.title}
              </h3>
              <p className="text-ink-soft text-[14px] leading-relaxed mt-2 max-w-[19rem] mx-auto">
                {step.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
