import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Minimal local stand-in for @radix-ui/react-slot's <Slot>.
 * Only handles the one case Button needs: merging className/ref/props
 * onto a single child element (e.g. rendering Button as an <a> via
 * asChild) without adding a new dependency.
 */
const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, className, ...props }, ref) => {
  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<any>;

  return React.cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(className, child.props.className),
    ref,
  });
});
Slot.displayName = "Slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-700 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-sage-600 text-white hover:bg-sage-700 shadow-soft",
        outline:
          "border border-sage-200 text-ink bg-transparent hover:border-sage-400",
        ghost: "text-ink-soft hover:text-ink hover:bg-sage-50",
        onDark:
          "bg-white text-sage-700 hover:bg-sage-50 shadow-soft",
        outlineOnDark:
          "border border-white/40 text-white hover:border-white bg-transparent",
      },
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2 text-[14px]",
        lg: "px-7 py-4 text-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref as any}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };