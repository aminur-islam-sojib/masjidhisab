import { GeometricPattern } from "./geometric-pattern";

export function BrandPanel() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden bg-sage-700 lg:flex lg:flex-col lg:justify-between">
      {/* subtle animated geometric texture */}
      <GeometricPattern className="animate-pulse-slow absolute inset-0 h-full w-full text-sage-50 opacity-[0.16]" />

      {/* soft radial glow to keep it from feeling flat */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sage-400/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 px-12 pt-12">
        <span className="font-heading text-lg font-semibold tracking-tight text-white">
          MasjidHisab
        </span>
      </div>

      {/* floating card suggesting the dashboard, not a literal screenshot */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-12">
        <div className="animate-float-slow w-full max-w-xs rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-soft backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-16 rounded-full bg-white/25" />
            <div className="h-6 w-6 rounded-full bg-gold-400/80" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-2 w-full rounded-full bg-white/15" />
            <div className="h-2 w-4/5 rounded-full bg-white/15" />
            <div className="h-2 w-3/5 rounded-full bg-white/15" />
          </div>
          <div className="mt-6 flex gap-2">
            <div className="h-14 flex-1 rounded-xl bg-white/10" />
            <div className="h-14 flex-1 rounded-xl bg-white/[0.18]" />
            <div className="h-14 flex-1 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-12 pb-12">
        <p className="font-heading text-2xl leading-snug text-white">
          Every account, every donation, every mosque —
          <br />
          in one calm workspace.
        </p>
      </div>
    </div>
  );
}

export function BrandPanelMobile() {
  return (
    <div className="relative flex w-full items-center justify-between overflow-hidden bg-sage-700 px-6 py-5 lg:hidden">
      <GeometricPattern className="absolute inset-0 h-full w-full text-sage-50 opacity-[0.14]" />
      <span className="relative z-10 font-heading text-base font-semibold text-white">
        MasjidHisab
      </span>
      <span className="relative z-10 text-xs text-sage-100/90">
        One calm workspace for your mosque
      </span>
    </div>
  );
}
