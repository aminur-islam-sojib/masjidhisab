"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";

import {
  updatePrayerSettingsSchema,
  UpdatePrayerSettingsInput,
} from "@/lib/validations/prayer";
import { updatePrayerSettingsAction } from "@/lib/actions/prayer";
import { getMosqueSettingsAction } from "@/lib/actions/mosque";
import { Button } from "@/components/ui/button";

interface PrayerScheduleSettingsFormProps {
  onSaved?: () => void;
  onCancel?: () => void;
}

export function PrayerScheduleSettingsForm({
  onSaved,
  onCancel,
}: PrayerScheduleSettingsFormProps) {
  const [isPending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdatePrayerSettingsInput>({
    resolver: zodResolver(updatePrayerSettingsSchema),
    defaultValues: {
      calculationMethod: "UniversityOfIslamicSciencesKarachi",
      timezone: "Asia/Dhaka",
      mode: "auto",
      coordinates: { lat: 23.8103, lng: 90.4125 },
      jummahTime: "13:30",
      iqamahOffsets: { fajr: 20, dhuhr: 15, asr: 15, maghrib: 10, isha: 15 },
      manualTimes: {
        fajr: "05:00",
        dhuhr: "13:00",
        asr: "16:00",
        maghrib: "18:30",
        isha: "19:30",
      },
    },
  });

  const mode = watch("mode");

  const loadSettings = async () => {
    const res = await getMosqueSettingsAction();
    if (!res.success || !res.data) return;

    const prayer = res.data.prayerSettings;
    reset({
      calculationMethod:
        prayer?.calculationMethod ?? "UniversityOfIslamicSciencesKarachi",
      timezone: prayer?.timezone ?? "Asia/Dhaka",
      mode: prayer?.mode ?? "auto",
      coordinates: {
        lat: prayer?.coordinates?.lat ?? 23.8103,
        lng: prayer?.coordinates?.lng ?? 90.4125,
      },
      jummahTime: prayer?.jummahTime ?? "13:30",
      iqamahOffsets: {
        fajr: prayer?.iqamahOffsets?.fajr ?? 20,
        dhuhr: prayer?.iqamahOffsets?.dhuhr ?? 15,
        asr: prayer?.iqamahOffsets?.asr ?? 15,
        maghrib: prayer?.iqamahOffsets?.maghrib ?? 10,
        isha: prayer?.iqamahOffsets?.isha ?? 15,
      },
      manualTimes: {
        fajr: prayer?.manualTimes?.fajr ?? "05:00",
        dhuhr: prayer?.manualTimes?.dhuhr ?? "13:00",
        asr: prayer?.manualTimes?.asr ?? "16:00",
        maghrib: prayer?.manualTimes?.maghrib ?? "18:30",
        isha: prayer?.manualTimes?.isha ?? "19:30",
      },
    });
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  const onSubmit = async (data: UpdatePrayerSettingsInput) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updatePrayerSettingsAction(data);
      setMessage({ success: res.success, text: res.message });
      if (res.success && onSaved) onSaved();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Prayer Schedule Settings
          </h2>
          <p className="text-sm text-slate-500">
            Configure how prayer times are calculated or enter them manually.
          </p>
        </div>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Close
          </Button>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.success
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {message.success ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Schedule Mode
          </label>
          <select
            {...register("mode")}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="auto">Auto-calculate</option>
            <option value="manual">Manual entry</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Calculation Method
          </label>
          <select
            {...register("calculationMethod")}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="UniversityOfIslamicSciencesKarachi">
              University of Islamic Sciences, Karachi
            </option>
            <option value="IslamicSocietyOfNorthAmerica">
              Islamic Society of North America (ISNA)
            </option>
            <option value="MuslimWorldLeague">
              Muslim World League (MWL)
            </option>
            <option value="UmmAlQura">Umm al-Qura University, Makkah</option>
            <option value="EgyptianGeneralAuthorityOfSurvey">
              Egyptian General Authority of Survey
            </option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Timezone
          </label>
          <input
            readOnly
            {...register("timezone")}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-600 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Jummah Jamat Time
          </label>
          <input
            type="time"
            {...register("jummahTime")}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Location */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <MapPin size={16} className="text-emerald-600" />
          <span>Mosque Location (for auto-calculate)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              {...register("coordinates.lat", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-600">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              {...register("coordinates.lng", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
              className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Iqamah offsets */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <SlidersHorizontal size={16} className="text-emerald-600" />
          <span>Iqamah Delay Offsets (minutes after Azan)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map(
            (prayer) => (
              <div
                key={prayer}
                className="p-3 border border-slate-200 rounded-xl bg-white space-y-1"
              >
                <label className="block text-xs font-semibold text-slate-600 capitalize">
                  {prayer}
                </label>
                <input
                  type="number"
                  {...register(`iqamahOffsets.${prayer}`, {
                    setValueAs: (v) => (v === "" ? 0 : Number(v)),
                  })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Manual times */}
      {mode === "manual" && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Manual Azan Times
            </p>
            <p className="text-xs text-slate-500">
              These times apply to every day until changed.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map(
              (prayer) => (
                <div key={prayer} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-600 capitalize">
                    {prayer}
                  </label>
                  <input
                    type="time"
                    {...register(`manualTimes.${prayer}`)}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-2"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          <span>{isPending ? "Saving..." : "Save Settings"}</span>
        </Button>
      </div>
    </form>
  );
}
