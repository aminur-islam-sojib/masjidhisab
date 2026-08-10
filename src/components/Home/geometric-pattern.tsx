import { cn } from "@/lib/utils/utils";

/**
 * Subtle 8-point star tessellation, inspired by Islamic geometric art.
 * Rendered as a low-opacity SVG tile so it reads as texture, not decoration.
 * `tone` picks the stroke color for use on light vs. dark section backgrounds.
 */
export function GeometricPattern({
  className,
  tone = "sage",
  mask = true,
}: {
  className?: string;
  tone?: "sage" | "light";
  mask?: boolean;
}) {
  const color = tone === "light" ? "%23FFFFFF" : "%234F7A5C";
  const opacity = tone === "light" ? "0.14" : "0.16";

  const bg = `url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='64'%20height='64'%3E%3Cg%20fill='none'%20stroke='${color}'%20stroke-opacity='${opacity}'%20stroke-width='1'%3E%3Crect%20x='14'%20y='14'%20width='36'%20height='36'/%3E%3Crect%20x='14'%20y='14'%20width='36'%20height='36'%20transform='rotate(45%2032%2032)'/%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: bg,
        backgroundSize: "64px 64px",
        maskImage: mask
          ? "radial-gradient(ellipse 75% 60% at 70% 10%, black, transparent)"
          : undefined,
        WebkitMaskImage: mask
          ? "radial-gradient(ellipse 75% 60% at 70% 10%, black, transparent)"
          : undefined,
      }}
    />
  );
}

/** Small stamp-style star mark, used on the ledger seal and testimonial corner. */
export function StarSeal({ size = 34, color = "#C9A15C" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <g fill="none" stroke={color} strokeWidth="1.6">
        <rect x="15" y="15" width="30" height="30" />
        <rect x="15" y="15" width="30" height="30" transform="rotate(45 30 30)" />
      </g>
    </svg>
  );
}
