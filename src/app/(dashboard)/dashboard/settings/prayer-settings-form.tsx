// app/dashboard/settings/_components/prayer-settings-form.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePrayerSettingsSchema,
  UpdatePrayerSettingsInput,
} from "@/lib/validations/prayer";
import { updatePrayerSettingsAction } from "@/lib/actions/prayer";
import { getMosqueSettingsAction } from "@/lib/actions/mosque";
import {
  Clock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PrayerSettingsForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    success: boolean;
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePrayerSettingsInput>({
    resolver: zodResolver(updatePrayerSettingsSchema),
    defaultValues: {
      calculationMethod: "UniversityOfIslamicSciencesKarachi",
      timezone: "Asia/Dhaka",
      jummahTime: "13:30",
      iqamahOffsets: {
        fajr: 20,
        dhuhr: 15,
        asr: 15,
        maghrib: 10,
        isha: 15,
      },
    },
  });

  const loadSettings = async () => {
    const res = await getMosqueSettingsAction();
    if (!res.success || !res.data) return;

    const prayer = res.data.prayerSettings;
    const offsets = prayer?.iqamahOffsets;
    reset({
      calculationMethod:
        prayer?.calculationMethod ?? "UniversityOfIslamicSciencesKarachi",
      timezone: prayer?.timezone ?? "Asia/Dhaka",
      jummahTime: prayer?.jummahTime ?? "13:30",
      iqamahOffsets: {
        fajr: offsets?.fajr ?? 20,
        dhuhr: offsets?.dhuhr ?? 15,
        asr: offsets?.asr ?? 15,
        maghrib: offsets?.maghrib ?? 10,
        isha: offsets?.isha ?? 15,
      },
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  async function onSubmit(data: UpdatePrayerSettingsInput) {
    setMessage(null);
    startTransition(async () => {
      const res = await updatePrayerSettingsAction(data);
      setMessage({ success: res.success, text: res.message });
      if (res.success) {
        await loadSettings();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-slate-900">
          Prayer Calculation & Iqamah Rules
        </h2>
        <p className="text-sm text-slate-500">
          Configure Azan calculation standards and Iqamah time delay offsets
          after Azan.
        </p>
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

      {/* General Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Calculation Method
          </label>
          <select
            {...register("calculationMethod")}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Timezone
          </label>
          <input
            {...register("timezone")}
            readOnly
            className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Jummah Jamat Time
          </label>
          <input
            type="time"
            {...register("jummahTime")}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Iqamah Offsets (Minutes After Azan) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
          <SlidersHorizontal size={16} className="text-emerald-600" />
          <span>Iqamah Delay Offsets (Minutes After Azan)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Fajr Offset
            </label>
            <input
              type="number"
              {...register("iqamahOffsets.fajr", { valueAsNumber: true })}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Dhuhr Offset
            </label>
            <input
              type="number"
              {...register("iqamahOffsets.dhuhr", { valueAsNumber: true })}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Asr Offset
            </label>
            <input
              type="number"
              {...register("iqamahOffsets.asr", { valueAsNumber: true })}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Maghrib Offset
            </label>
            <input
              type="number"
              {...register("iqamahOffsets.maghrib", { valueAsNumber: true })}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 border border-slate-200 rounded-xl bg-white space-y-1">
            <label className="block text-xs font-semibold text-slate-600">
              Isha Offset
            </label>
            <input
              type="number"
              {...register("iqamahOffsets.isha", { valueAsNumber: true })}
              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-xs flex items-center gap-2"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          <span>
            {isPending ? "Saving Prayer Settings..." : "Save Prayer Settings"}
          </span>
        </Button>
      </div>
    </form>
  );
}
