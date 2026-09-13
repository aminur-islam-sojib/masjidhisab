"use client";

import { Clock } from "lucide-react";
import { DaySchedule, PrayerTimeEntry } from "@/lib/prayer-times";

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

interface NextPrayerCardProps {
  today: DaySchedule | undefined;
  nextPrayer: PrayerTimeEntry | null;
  now: number;
}

export function NextPrayerCard({ today, nextPrayer, now }: NextPrayerCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-emerald-600" />
        <h3 className="text-sm font-semibold text-slate-900">Next Prayer</h3>
      </div>

      {nextPrayer ? (
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-700">
            {nextPrayer.name}
          </p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
            {nextPrayer.azan}
          </p>
          <p className="text-sm text-emerald-600 tabular-nums mt-1">
            in {formatCountdown(nextPrayer.azanTs - now)}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">
          All prayers completed for today.
        </p>
      )}

      <div className="mt-4 space-y-1.5">
        {(today?.prayers ?? []).map((prayer) => (
          <div
            key={prayer.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-slate-600">{prayer.name}</span>
            <span className="text-slate-900 font-medium tabular-nums">
              {prayer.azan}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
