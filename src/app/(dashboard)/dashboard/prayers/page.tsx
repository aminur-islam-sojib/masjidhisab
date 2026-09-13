"use client";

import * as React from "react";
import { Clock, Settings2, CalendarDays, Sunrise } from "lucide-react";
import { getPrayerScheduleAction } from "@/lib/actions/prayer";
import {
  DaySchedule,
  PrayerTimeEntry,
} from "@/lib/prayer-times";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PrayerScheduleSettingsForm } from "@/components/dashboard/prayers/prayer-schedule-settings-form";

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function PrayerRow({ prayer }: { prayer: PrayerTimeEntry }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2.5">
      <span className="text-sm font-semibold text-slate-800">{prayer.name}</span>
      <div className="text-right">
        <p className="text-sm font-bold text-emerald-700">{prayer.azan}</p>
        <p className="text-[11px] text-slate-400">Iqamah {prayer.iqamah}</p>
      </div>
    </div>
  );
}

export default function PrayersPage() {
  const [schedule, setSchedule] = React.useState<DaySchedule[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    let active = true;

    startTransition(async () => {
      const res = await getPrayerScheduleAction();
      if (!active) return;

      if (res.success) {
        setSchedule(res.data ?? []);
      } else {
        setError(res.message || "Failed to load prayer schedule.");
      }
    });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const today = schedule[0];
  const nextPrayer = today
    ? today.prayers.find((p) => p.azanTs > now) || null
    : null;

  return (
    <div className="space-y-6 mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Prayer Schedule
          </h1>
          <p className="text-sm text-slate-500">
            Today&apos;s prayers, iqamah times, and the coming week.
          </p>
        </div>

        <Button
          onClick={() => setShowSettings(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
        >
          <Settings2 size={16} />
          Schedule Settings
        </Button>
      </div>

      {isPending && schedule.length === 0 ? (
        <div className="text-sm text-slate-500">Loading prayer schedule…</div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        schedule.length > 0 && (
          <>
            {/* Today highlight */}
            <div className="rounded-2xl bg-emerald-600 p-5 sm:p-6 text-white shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">{today.label}</p>
                  <h2 className="text-3xl font-bold mt-1">Today&apos;s Prayer</h2>
                </div>

                <div className="bg-white/10 rounded-xl px-4 py-3">
                  <p className="text-emerald-100 text-xs">
                    {nextPrayer ? `Next: ${nextPrayer.name}` : "All prayers done"}
                  </p>
                  {nextPrayer && (
                    <p className="text-2xl font-bold tabular-nums">
                      {formatCountdown(nextPrayer.azanTs - now)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {today.prayers.map((prayer) => (
                  <div
                    key={prayer.name}
                    className="rounded-xl bg-white/10 px-3 py-3"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-100 text-xs font-medium">
                      <Clock size={13} />
                      {prayer.name}
                    </div>
                    <p className="text-lg font-bold mt-1">{prayer.azan}</p>
                    <p className="text-emerald-100 text-[11px]">
                      isaiah {prayer.iqamah}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Week strip */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
                <CalendarDays size={16} className="text-emerald-600" />
                <span>This Week</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {schedule.map((day) => (
                  <div
                    key={day.date}
                    className={`rounded-xl border bg-white p-4 shadow-sm ${
                      day.isToday
                        ? "border-emerald-300 ring-1 ring-emerald-200"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800">
                        {day.label}
                      </span>
                      {day.isToday && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                          <Sunrise size={12} /> Today
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {day.prayers.map((prayer) => (
                        <PrayerRow key={prayer.name} prayer={prayer} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      )}

      <Modal open={showSettings} onClose={() => setShowSettings(false)}>
        <PrayerScheduleSettingsForm
          onCancel={() => setShowSettings(false)}
          onSaved={() => {
            setShowSettings(false);
            setReloadKey((k) => k + 1);
          }}
        />
      </Modal>
    </div>
  );
}
