export function GeometricPattern({ className }: { className?: string }) {
  // A restrained, line-based interpretation of an 8-point star / interlocking
  // grid tessellation — the kind of geometric motif found in mosque mashrabiya
  // and tilework, redrawn as thin modern line work rather than literal clipart.
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="masjidhisab-lattice"
          x="0"
          y="0"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          >
            {/* 8-point star at each tile center */}
            <path d="M60 10 L78 30 L110 30 L86 50 L96 82 L60 62 L24 82 L34 50 L10 30 L42 30 Z" />
            {/* connecting lattice lines between tiles */}
            <path d="M0 60 H120" />
            <path d="M60 0 V120" />
            <path d="M0 0 L120 120" opacity="0.5" />
            <path d="M120 0 L0 120" opacity="0.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#masjidhisab-lattice)" />
    </svg>
  );
}