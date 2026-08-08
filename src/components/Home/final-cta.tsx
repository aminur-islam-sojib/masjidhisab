import { ArrowRight } from "lucide-react";

import { Button } from "./ui/button";
import { GeometricPattern } from "./geometric-pattern";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section id="cta" className="relative overflow-hidden bg-sage-700 py-20 sm:py-24">
      <GeometricPattern tone="light" mask={false} />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <Reveal>
          <h2 className="font-heading font-semibold text-[2rem] sm:text-[2.6rem] leading-tight tracking-tight text-white">
            Bring transparency to your mosque&apos;s finances
          </h2>
          <p className="text-sage-100/90 text-[16.5px] leading-relaxed mt-4 max-w-xl mx-auto">
            Set up in a single Friday afternoon. No training required, no
            card needed to start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-9">
            <Button asChild variant="onDark" size="lg">
              <a href="#">
                Start Free <ArrowRight size={17} />
              </a>
            </Button>
            <Button asChild variant="outlineOnDark" size="lg">
              <a href="#">Talk to our team</a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
