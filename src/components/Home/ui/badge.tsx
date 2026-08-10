import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full text-[13px] font-semibold px-3.5 py-1.5 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-sage-100 text-sage-700",
        outline: "border border-sage-200 text-ink-soft",
        gold: "bg-gold-100 text-gold-500",
        solid: "bg-sage-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
