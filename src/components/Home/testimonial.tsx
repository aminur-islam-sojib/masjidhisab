import { Quote } from "lucide-react";

import { Reveal } from "./reveal";
import { StarSeal } from "./geometric-pattern";

export function Testimonial() {
  return (
    <section className="mx-auto max-w-5xl px-5 sm:px-8 py-20 sm:py-28">
      <Reveal>
        <div className="rounded-3xl bg-white border border-sage-100 shadow-card p-9 sm:p-14 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-[0.07]">
            <StarSeal size={180} color="#4F7A5C" />
          </div>
          <Quote size={34} className="text-sage-300" />
          <p className="font-heading text-[21px] sm:text-[25px] leading-snug text-ink mt-5 max-w-3xl">
            &ldquo;Before MasjidHisab, our treasurer kept everything in a
            notebook, and every year someone would ask where the Qurbani
            fund went. Now the whole committee — and the musullis — can see
            the ledger themselves.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-8">
            <span className="w-11 h-11 rounded-full bg-sage-100 grid place-items-center text-sage-700 font-semibold">
              AR
            </span>
            <div>
              <p className="text-[14.5px] font-semibold text-ink">
                Committee Secretary
              </p>
              <p className="text-[13px] text-ink-faint">
                A Jame Masjid committee, Dhaka
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
